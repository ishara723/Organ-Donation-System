package org.lifelink.repository;

import org.lifelink.entity.Donor;
import org.lifelink.entity.Match;
import org.lifelink.entity.Request;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Match entity
 */
@Repository
public interface MatchRepository extends MongoRepository<Match, Long> {

    /**
     * Find matches by donor
     */
    List<Match> findByDonor(Donor donor);

    /**
     * Find matches by donor ID
     */
    default List<Match> findByDonor_DonorId(Long donorId) {
        return findAll().stream()
                .filter(match -> match.getDonor() != null && donorId.equals(match.getDonor().getDonorId()))
                .toList();
    }

    /**
     * Find matches by request
     */
    List<Match> findByRequest(Request request);

    /**
     * Find matches by request ID
     */
    default List<Match> findByRequest_RequestId(Long requestId) {
        return findAll().stream()
                .filter(match -> match.getRequest() != null && requestId.equals(match.getRequest().getRequestId()))
                .toList();
    }

    /**
     * Find matches by status
     */
    List<Match> findByStatus(Match.Status status);

    /**
     * Find match by donor and request
     */
    Optional<Match> findByDonorAndRequest(Donor donor, Request request);

    /**
     * Count matches by status
     */
    long countByStatus(Match.Status status);
}