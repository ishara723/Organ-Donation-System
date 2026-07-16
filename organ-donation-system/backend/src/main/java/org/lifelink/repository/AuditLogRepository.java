package org.lifelink.repository;

import org.lifelink.entity.AuditLog;
import org.lifelink.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for AuditLog entity
 */
@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, Long> {

    /**
     * Find audit logs by user
     */
    List<AuditLog> findByUserOrderByTimestampDesc(User user);

    /**
     * Find audit logs by action
     */
    List<AuditLog> findByActionOrderByTimestampDesc(String action);

    /**
     * Find audit logs by entity type
     */
    List<AuditLog> findByEntityTypeOrderByTimestampDesc(String entityType);

    /**
     * Find audit logs by entity
     */
    List<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, Long entityId);

    /**
     * Find audit logs in date range
     */
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);

    /**
     * Find audit logs by user and action
     */
    List<AuditLog> findByUserAndActionOrderByTimestampDesc(User user, String action);
}