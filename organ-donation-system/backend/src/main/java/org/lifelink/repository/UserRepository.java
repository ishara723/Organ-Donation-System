package org.lifelink.repository;

import org.lifelink.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends MongoRepository<User, Long> {

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if email already exists
     */
    boolean existsByEmail(String email);

    /**
     * Find all users by role
     */
    List<User> findByRole(User.Role role);

    /**
     * Find all active users
     */
    List<User> findByIsActiveTrue();

    /**
     * Find users by role and active status
     */
    List<User> findByRoleAndIsActive(User.Role role, Boolean isActive);
}