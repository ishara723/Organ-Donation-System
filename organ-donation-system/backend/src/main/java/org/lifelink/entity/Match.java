package org.lifelink.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Match Entity - Represents proposed donor-recipient matches
 */
@Entity
@Document(collection = "match")
@Table(name = "`match`")  // 'match' is a reserved keyword in some databases
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    @org.springframework.data.annotation.Id
    private Long matchId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    @DBRef
    private Donor donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    @DBRef
    private Request request;

    @Column(name = "match_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal matchScore = BigDecimal.ZERO;

    @Column(name = "compatibility_notes", columnDefinition = "TEXT")
    private String compatibilityNotes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.PROPOSED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposed_by", nullable = false)
    @DBRef
    private User proposedBy;

    @Column(name = "proposed_date", nullable = false)
    private LocalDateTime proposedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    @DBRef
    private User approvedBy;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    /**
     * Match status workflow
     */
    public enum Status {
        PROPOSED,       // Match proposed by admin
        ACCEPTED,       // Match accepted
        REJECTED,       // Match rejected
        COMPLETED       // Donation completed
    }

    @PrePersist
    protected void onCreate() {
        if (proposedDate == null) {
            proposedDate = LocalDateTime.now();
        }
    }

    /**
     * Calculate compatibility score based on various factors
     */
    public static BigDecimal calculateCompatibilityScore(Donor donor, Request request) {
        BigDecimal score = BigDecimal.ZERO;

        // Blood type compatibility (40 points)
        if (donor.getBloodType() == request.getPatientBloodType()) {
            score = score.add(BigDecimal.valueOf(40));
        } else if (donor.getBloodType() == Donor.BloodType.O_NEGATIVE) {
            // Universal donor
            score = score.add(BigDecimal.valueOf(35));
        } else if (isBloodTypeCompatible(donor.getBloodType(), request.getPatientBloodType())) {
            score = score.add(BigDecimal.valueOf(25));
        }

        // Location proximity (30 points)
        if (donor.getCity().equalsIgnoreCase(extractCity(request.getHospitalLocation()))) {
            score = score.add(BigDecimal.valueOf(30));
        } else if (donor.getState().equalsIgnoreCase(extractState(request.getHospitalLocation()))) {
            score = score.add(BigDecimal.valueOf(15));
        }

        // Age compatibility (15 points)
        int donorAge = donor.getAge();
        int patientAge = request.getPatientAge();
        int ageDiff = Math.abs(donorAge - patientAge);
        if (ageDiff < 10) {
            score = score.add(BigDecimal.valueOf(15));
        } else if (ageDiff < 20) {
            score = score.add(BigDecimal.valueOf(10));
        } else if (ageDiff < 30) {
            score = score.add(BigDecimal.valueOf(5));
        }

        // Verification status (10 points)
        if (Boolean.TRUE.equals(donor.getIsVerified())) {
            score = score.add(BigDecimal.valueOf(10));
        }

        // Consent status (5 points)
        if (donor.getConsentStatus() == Donor.ConsentStatus.APPROVED) {
            score = score.add(BigDecimal.valueOf(5));
        }

        return score;
    }

    /**
     * Check if blood types are compatible
     */
    private static boolean isBloodTypeCompatible(Donor.BloodType donorType, Donor.BloodType patientType) {
        // Simplified compatibility check
        if (donorType == Donor.BloodType.O_NEGATIVE) return true;
        if (donorType == Donor.BloodType.O_POSITIVE &&
                (patientType == Donor.BloodType.O_POSITIVE ||
                        patientType == Donor.BloodType.A_POSITIVE ||
                        patientType == Donor.BloodType.B_POSITIVE ||
                        patientType == Donor.BloodType.AB_POSITIVE)) return true;
        return false;
    }

    /**
     * Extract city from location string (e.g., "New York, NY" -> "New York")
     */
    private static String extractCity(String location) {
        if (location == null) return "";
        String[] parts = location.split(",");
        return parts.length > 0 ? parts[0].trim() : "";
    }

    /**
     * Extract state from location string (e.g., "New York, NY" -> "NY")
     */
    private static String extractState(String location) {
        if (location == null) return "";
        String[] parts = location.split(",");
        return parts.length > 1 ? parts[1].trim() : "";
    }
}