package org.lifelink.service;

import lombok.RequiredArgsConstructor;
import org.lifelink.dto.request.LoginRequest;
import org.lifelink.dto.request.RegisterRequest;
import org.lifelink.dto.response.AuthResponse;
import org.lifelink.entity.User;
import org.lifelink.exception.UnauthorizedException;
import org.lifelink.repository.UserRepository;
import org.lifelink.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final org.lifelink.util.MongoIdGeneratorService idGeneratorService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
            .userId(idGeneratorService.nextId())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.valueOf(request.getRole()))
                .isActive(true)
                .build();

        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getUserId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .expiresIn(jwtTokenProvider.getExpirationTime())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(user);

            return AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .expiresIn(jwtTokenProvider.getExpirationTime())
                    .build();

        } catch (AuthenticationException e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }
}