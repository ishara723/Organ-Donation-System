package org.lifelink.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * OrganType Entity - Represents types of organs available for donation
 */
@Entity
@Document(collection = "organ_type")
@Table(name = "organ_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "organ_type_id")
    @org.springframework.data.annotation.Id
    private Integer organTypeId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}