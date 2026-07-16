package org.lifelink.repository;

import org.lifelink.entity.Donor;
import org.lifelink.entity.DonorOrgan;
import org.lifelink.entity.OrganType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for DonorOrgan entity
 */
@Repository
public interface DonorOrganRepository extends MongoRepository<DonorOrgan, Long> {

    /**
     * Find all organs for a specific donor
     */
    List<DonorOrgan> findByDonor(Donor donor);

    /**
     * Find all organs of a specific donor by donor ID
     */
    default List<DonorOrgan> findByDonor_DonorId(Long donorId) {
        return findAll().stream()
                .filter(donorOrgan -> donorOrgan.getDonor() != null && donorId.equals(donorOrgan.getDonor().getDonorId()))
                .toList();
    }

    /**
     * Find specific organ for a donor
     */
    Optional<DonorOrgan> findByDonorAndOrganType(Donor donor, OrganType organType);

    /**
     * Find all available organs of a specific type
     */
    List<DonorOrgan> findByOrganTypeAndAvailabilityStatus(
            OrganType organType,
            DonorOrgan.AvailabilityStatus status
    );

    /**
     * Delete all organs for a donor
     */
    void deleteByDonor(Donor donor);
}