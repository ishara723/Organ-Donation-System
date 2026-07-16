package org.lifelink.repository;

import org.lifelink.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Donor entity
 */
@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    /**
     * Find donor by user ID
     */
    Optional<Donor> findByUser_UserId(Long userId);

    /**
     * Find all verified donors
     */
    List<Donor> findByIsVerifiedTrue();

    /**
     * Find donors by consent status
     */
    List<Donor> findByConsentStatus(Donor.ConsentStatus status);

    /**
     * Find donors by blood type
     */
    List<Donor> findByBloodType(Donor.BloodType bloodType);

    /**
     * Find donors by city
     */
    List<Donor> findByCity(String city);

    /**
     * Find donors by state
     */
    List<Donor> findByState(String state);

    /**
     * Find verified and approved donors
     */
    List<Donor> findByIsVerifiedTrueAndConsentStatus(Donor.ConsentStatus status);

    /**
     * Search donors by multiple criteria
     */
    @Query("SELECT DISTINCT d FROM Donor d " +
            "LEFT JOIN d.donorOrgans do " +
            "WHERE (:bloodType IS NULL OR d.bloodType = :bloodType) " +
            "AND (:city IS NULL OR LOWER(d.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
            "AND (:state IS NULL OR LOWER(d.state) LIKE LOWER(CONCAT('%', :state, '%'))) " +
            "AND (:organTypeId IS NULL OR do.organType.organTypeId = :organTypeId) " +
            "AND d.isVerified = true " +
            "AND d.consentStatus = 'APPROVED' " +
            "AND (do.availabilityStatus IS NULL OR do.availabilityStatus = 'AVAILABLE')")
    List<Donor> searchDonors(
            @Param("bloodType") Donor.BloodType bloodType,
            @Param("city") String city,
            @Param("state") String state,
            @Param("organTypeId") Integer organTypeId
    );

    /**
     * Find donors by organ type
     */
    @Query("SELECT DISTINCT d FROM Donor d " +
            "JOIN d.donorOrgans do " +
            "WHERE do.organType.organTypeId = :organTypeId " +
            "AND do.availabilityStatus = 'AVAILABLE'")
    List<Donor> findByOrganType(@Param("organTypeId") Integer organTypeId);

    /**
     * Count verified donors
     */
    long countByIsVerifiedTrue();

    /**
     * Count donors by consent status
     */
    long countByConsentStatus(Donor.ConsentStatus status);
}