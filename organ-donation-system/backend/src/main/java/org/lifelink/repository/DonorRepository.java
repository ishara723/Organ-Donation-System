package org.lifelink.repository;

import org.lifelink.entity.Donor;
import org.lifelink.entity.DonorOrgan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Donor entity
 */
@Repository
public interface DonorRepository extends MongoRepository<Donor, Long> {

    /**
     * Find donor by user ID
     */
    default Optional<Donor> findByUser_UserId(Long userId) {
        return findAll().stream()
                .filter(donor -> donor.getUser() != null && userId.equals(donor.getUser().getUserId()))
                .findFirst();
    }

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
    default List<Donor> searchDonors(
            Donor.BloodType bloodType,
            String city,
            String state,
            Integer organTypeId
    ) {
        return findAll().stream()
                .filter(d -> Boolean.TRUE.equals(d.getIsVerified()))
                .filter(d -> d.getConsentStatus() == Donor.ConsentStatus.APPROVED)
                .filter(d -> bloodType == null || d.getBloodType() == bloodType)
                .filter(d -> city == null || (d.getCity() != null && d.getCity().toLowerCase().contains(city.toLowerCase())))
                .filter(d -> state == null || (d.getState() != null && d.getState().toLowerCase().contains(state.toLowerCase())))
                .filter(d -> organTypeId == null || (d.getDonorOrgans() != null && d.getDonorOrgans().stream().anyMatch(doItem ->
                        doItem.getOrganType() != null && organTypeId.equals(doItem.getOrganType().getOrganTypeId()) &&
                        (doItem.getAvailabilityStatus() == null || doItem.getAvailabilityStatus() == DonorOrgan.AvailabilityStatus.AVAILABLE)
                )))
                .toList();
    }

    /**
     * Find donors by organ type
     */
    default List<Donor> findByOrganType(Integer organTypeId) {
        return findAll().stream()
                .filter(d -> d.getDonorOrgans() != null && d.getDonorOrgans().stream().anyMatch(doItem ->
                        doItem.getOrganType() != null && organTypeId.equals(doItem.getOrganType().getOrganTypeId()) &&
                        doItem.getAvailabilityStatus() == DonorOrgan.AvailabilityStatus.AVAILABLE
                ))
                .toList();
    }

    /**
     * Count verified donors
     */
    long countByIsVerifiedTrue();

    /**
     * Count donors by consent status
     */
    long countByConsentStatus(Donor.ConsentStatus status);
}