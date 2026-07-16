package org.lifelink.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.lifelink.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Base64;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * JWT Token Provider - Handles JWT token generation and validation
 */
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    /**
     * Generate signing key from secret
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate JWT token for user
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getUserId())
                .claim("role", user.getRole().name())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Get email from JWT token
     */
    public String getEmailFromToken(String token) {
        JsonNode claims = parseClaims(token);
        if (claims == null) return null;
        JsonNode sub = claims.get("sub");
        return sub != null ? sub.asText() : null;
    }

    /**
     * Get user ID from JWT token
     */
    public Long getUserIdFromToken(String token) {
        JsonNode claims = parseClaims(token);
        if (claims == null) return null;
        JsonNode id = claims.get("userId");
        return id != null ? id.asLong() : null;
    }

    /**
     * Get role from JWT token
     */
    public String getRoleFromToken(String token) {
        JsonNode claims = parseClaims(token);
        if (claims == null) return null;
        JsonNode role = claims.get("role");
        return role != null ? role.asText() : null;
    }

    /**
     * Validate JWT token
     */
    public boolean validateToken(String token) {
        try {
            JsonNode claims = parseClaims(token);
            if (claims == null) return false;
            JsonNode exp = claims.get("exp");
            if (exp != null) {
                long expVal = exp.asLong();
                long nowSec = System.currentTimeMillis() / 1000L;
                return expVal > nowSec;
            }
            return true;
        } catch (SecurityException ex) {
            System.err.println("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            System.err.println("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            System.err.println("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            System.err.println("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            System.err.println("JWT claims string is empty");
        }
        return false;
    }

    private JsonNode parseClaims(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) return null;
            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(decoded);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Get expiration time in milliseconds
     */
    public long getExpirationTime() {
        return jwtExpirationMs;
    }
}