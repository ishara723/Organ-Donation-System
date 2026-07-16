package org.lifelink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * LifeLink Organ Donation Management System
 * Main Application Entry Point
 *
 * @author LifeLink Development Team
 * @version 1.0.0
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@EnableMongoAuditing
@EnableAsync
public class LifeLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(LifeLinkApplication.class, args);
        System.out.println("""
            
            ╔═══════════════════════════════════════════════════════════════╗
            ║                                                               ║
            ║    LifeLink Organ Donation System                            ║
            ║    Version: 1.0.0                                            ║
            ║    Status: RUNNING                                           ║
            ║                                                               ║
            ║    API Base: http://localhost:8080/api/v1                   ║
            ║    Swagger UI: http://localhost:8080/api/v1/swagger-ui.html ║
            ║                                                               ║
            ╚═══════════════════════════════════════════════════════════════╝
            
            """);
    }
}