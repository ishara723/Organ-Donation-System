package org.lifelink.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger Configuration - API documentation setup
 */
@Configuration
public class OpenAPIConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${server.servlet.context-path:/api/v1}")
    private String contextPath;

    /**
     * Configure OpenAPI documentation
     */
    @Bean
    public OpenAPI customOpenAPI() {
        // Security scheme for JWT
        final String securitySchemeName = "bearer-jwt";

        return new OpenAPI()
                // API Information
                .info(new Info()
                        .title("LifeLink Organ Donation API")
                        .version("1.0.0")
                        .description("""
                                REST API for Organ Donation Management System
                                
                                ## Features
                                - User authentication with JWT
                                - Donor profile management
                                - Organ request handling
                                - Donor-recipient matching
                                - Notification system
                                - Admin dashboard
                                
                                ## Authentication
                                All protected endpoints require a valid JWT token in the Authorization header:
                                ```
                                Authorization: Bearer <your_jwt_token>
                                ```
                                """)
                        .contact(new Contact()
                                .name("LifeLink Support")
                                .email("support@lifelink.org")
                                .url("https://lifelink.org"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))

                // Servers
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort + contextPath)
                                .description("Local Development Server"),
                        new Server()
                                .url("https://api.lifelink.org" + contextPath)
                                .description("Production Server")))

                // Security
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT token obtained from /auth/login endpoint")));
    }
}