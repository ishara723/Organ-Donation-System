package org.lifelink.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * Request Entity - Represents organ requests from hospitals/recipients
 */
@Entity
@Document(collection = "request")
@Table(name = "request")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    @org.springframework.data.annotation.Id
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @DBRef
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organ_type_id", nullable = false)
    @DBRef
    private OrganType organType;

    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @Column(name = "patient_age", nullable = false)
    private Integer patientAge;

    @Enumerated(EnumType.STRING)
    @Column(name = "patient_blood_type", nullable = false)
    private Donor.BloodType patientBloodType;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level", nullable = false)
    private UrgencyLevel urgencyLevel;

    @Column(name = "hospital_name", nullable = false)
    private String hospitalName;

    @Column(name = "hospital_location", nullable = false)
    private String hospitalLocation;

    @Column(name = "medical_reason", columnDefinition = "TEXT", nullable = false)
    private String medicalReason;

    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(nullable = false)
    @Builder.Default
    private Integer priority = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    @DBRef
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    /**
     * Request status workflow
     */
    public enum Status {
        PENDING,        // Newly submitted
        UNDER_REVIEW,   // Being reviewed by admin
        APPROVED,       // Approved by admin
        MATCHED,        // Matched with a donor
        COMPLETED,      // Donation completed
        REJECTED,       // Rejected by admin
        CANCELLED       // Cancelled by requester
    }

    /**
     * Medical urgency levels
     */
    public enum UrgencyLevel {
        LOW,            // Routine
        MEDIUM,         // Semi-urgent
        HIGH,           // Urgent
        CRITICAL        // Life-threatening
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        // Auto-assign priority based on urgency
        if (priority == null || priority == 0) {
            priority = calculatePriority();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Calculate priority score based on urgency and age
     */
    public Integer calculatePriority() {
        int score = 0;

        // Urgency weight
        switch (urgencyLevel) {
            case CRITICAL: score += 40; break;
            case HIGH: score += 30; break;
            case MEDIUM: score += 20; break;
            case LOW: score += 10; break;
        }

        // Age weight (younger patients get slightly higher priority)
        if (patientAge != null) {
            if (patientAge < 18) score += 15;
            else if (patientAge < 40) score += 10;
            else if (patientAge < 60) score += 5;
        }

        return score;
    }

    /**
     * Check if request is in active state
     */
    @Transient
    public boolean isActive() {
        return status == Status.PENDING ||
                status == Status.UNDER_REVIEW ||
                status == Status.APPROVED;
    }
}