package org.lifelink.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

/**
 * Donor Entity - Represents organ donors in the system
 */
@Entity
@Document(collection = "donor")
@Table(name = "donor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donor_id")
    @org.springframework.data.annotation.Id
    private Long donorId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @DBRef
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_type", nullable = false)
    private BloodType bloodType;

    @Column(nullable = false)
    private String phone;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String country;

    @Column(name = "postal_code", nullable = false)
    private String postalCode;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "consent_status")
    private ConsentStatus consentStatus = ConsentStatus.PENDING;

    @Column(name = "consent_date")
    private LocalDateTime consentDate;

    @Builder.Default
    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "verified_date")
    private LocalDateTime verifiedDate;

    @ManyToOne
    @JoinColumn(name = "verified_by")
    @DBRef
    private User verifiedBy;

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @DBRef
    private List<DonorOrgan> donorOrgans = new ArrayList<>();

    /**
     * Gender enumeration
     */
    public enum Gender {
        MALE, FEMALE, OTHER
    }

    /**
     * Blood type enumeration with display names
     */
    public enum BloodType {
        A_POSITIVE("A+"),
        A_NEGATIVE("A-"),
        B_POSITIVE("B+"),
        B_NEGATIVE("B-"),
        AB_POSITIVE("AB+"),
        AB_NEGATIVE("AB-"),
        O_POSITIVE("O+"),
        O_NEGATIVE("O-");

        private final String displayName;

        BloodType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }

        public static BloodType fromDisplayName(String displayName) {
            for (BloodType bt : BloodType.values()) {
                if (bt.displayName.equals(displayName)) {
                    return bt;
                }
            }
            throw new IllegalArgumentException("Invalid blood type: " + displayName);
        }
    }

    /**
     * Consent status enumeration
     */
    public enum ConsentStatus {
        PENDING,    // Waiting for verification
        APPROVED,   // Consent approved
        REVOKED     // Consent withdrawn
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Calculate donor's age
     */
    @Transient
    public int getAge() {
        if (dateOfBirth == null) {
            return 0;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    /**
     * Add organ to donor's organ list
     */
    public void addOrgan(DonorOrgan donorOrgan) {
        donorOrgans.add(donorOrgan);
        donorOrgan.setDonor(this);
    }

    /**
     * Remove organ from donor's organ list
     */
    public void removeOrgan(DonorOrgan donorOrgan) {
        donorOrgans.remove(donorOrgan);
        donorOrgan.setDonor(null);
    }
}