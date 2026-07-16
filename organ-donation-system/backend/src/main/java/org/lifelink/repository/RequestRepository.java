package org.lifelink.repository;

import org.lifelink.entity.OrganType;
import org.lifelink.entity.Request;
import org.lifelink.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Repository interface for Request entity
 */
@Repository
public interface RequestRepository extends MongoRepository<Request, Long> {

    /**
     * Find requests by user
     */
    List<Request> findByUser(User user);

    /**
     * Find requests by user ID
     */
        default List<Request> findByUser_UserId(Long userId) {
                return findAll().stream()
                                .filter(request -> request.getUser() != null && userId.equals(request.getUser().getUserId()))
                                .toList();
        }

    /**
     * Find requests by status
     */
    List<Request> findByStatus(Request.Status status);

    /**
     * Find requests by urgency level
     */
    List<Request> findByUrgencyLevel(Request.UrgencyLevel urgencyLevel);

    /**
     * Find requests by organ type
     */
    List<Request> findByOrganType(OrganType organType);

    /**
     * Find requests by user and status
     */
    List<Request> findByUserAndStatus(User user, Request.Status status);

    /**
     * Find all active requests (pending, under review, or approved)
     */
    default List<Request> findActiveRequests() {
        return findAll().stream()
                .filter(request -> request.getStatus() == Request.Status.PENDING
                        || request.getStatus() == Request.Status.UNDER_REVIEW
                        || request.getStatus() == Request.Status.APPROVED)
                .sorted(Comparator.comparing(Request::getPriority, Comparator.reverseOrder())
                        .thenComparing(Request::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());
    }

    /**
     * Find requests by multiple filters
     */
    default List<Request> searchRequests(
            Request.Status status,
            Request.UrgencyLevel urgencyLevel,
            Integer organTypeId
    ) {
        return findAll().stream()
                .filter(request -> status == null || request.getStatus() == status)
                .filter(request -> urgencyLevel == null || request.getUrgencyLevel() == urgencyLevel)
                .filter(request -> organTypeId == null || request.getOrganType() != null && organTypeId.equals(request.getOrganType().getOrganTypeId()))
                .sorted(Comparator.comparing(Request::getPriority, Comparator.reverseOrder())
                        .thenComparing(Request::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());
    }

    /**
     * Count requests by status
     */
    long countByStatus(Request.Status status);

    /**
     * Count requests by urgency level
     */
    long countByUrgencyLevel(Request.UrgencyLevel urgencyLevel);
}