package org.lifelink.repository;

import org.lifelink.entity.Notification;
import org.lifelink.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Notification entity
 */
@Repository
public interface NotificationRepository extends MongoRepository<Notification, Long> {

    /**
     * Find all notifications for a user
     */
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Find notifications by user ID
     */
    default List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Long userId) {
        return findAll().stream()
                .filter(notification -> notification.getUser() != null && userId.equals(notification.getUser().getUserId()))
                .sorted((left, right) -> right.getCreatedAt().compareTo(left.getCreatedAt()))
                .toList();
    }

    /**
     * Find unread notifications for a user
     */
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);

    /**
     * Find unread notifications by user ID
     */
    default List<Notification> findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId) {
        return findAll().stream()
                .filter(notification -> notification.getUser() != null && userId.equals(notification.getUser().getUserId()))
                .filter(notification -> Boolean.FALSE.equals(notification.getIsRead()))
                .sorted((left, right) -> right.getCreatedAt().compareTo(left.getCreatedAt()))
                .toList();
    }

    /**
     * Count unread notifications for a user
     */
    long countByUserAndIsReadFalse(User user);

    /**
     * Count unread notifications by user ID
     */
    default long countByUser_UserIdAndIsReadFalse(Long userId) {
        return findAll().stream()
                .filter(notification -> notification.getUser() != null && userId.equals(notification.getUser().getUserId()))
                .filter(notification -> Boolean.FALSE.equals(notification.getIsRead()))
                .count();
    }

    /**
     * Delete all read notifications for a user
     */
    void deleteByUserAndIsReadTrue(User user);
}