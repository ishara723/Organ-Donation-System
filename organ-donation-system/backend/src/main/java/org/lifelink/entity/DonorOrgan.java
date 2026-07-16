package org.lifelink.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * DonorOrgan Entity - Junction table linking Donors with OrganTypes
 * Represents which organs a donor is willing to donate
 */
@Entity
@Document(collection = "donor_organ")
@Table(
        name = "donor_organ",
        uniqueConstraints = @UniqueConstraint(columnNames = {"donor_id", "organ_type_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorOrgan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.annotation.Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    @DBRef
    private Donor donor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organ_type_id", nullable = false)
    @DBRef
    private OrganType organType;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status")
    @Builder.Default
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    /**
     * Availability status of the organ
     */
    public enum AvailabilityStatus {
        AVAILABLE,      // Available for donation
        RESERVED,       // Reserved for a recipient
        DONATED,        // Already donated
        UNAVAILABLE     // No longer available
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DonorOrgan)) return false;
        DonorOrgan that = (DonorOrgan) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}