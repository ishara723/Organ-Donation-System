package org.lifelink.repository;

import org.lifelink.entity.OrganType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for OrganType entity
 */
@Repository
public interface OrganTypeRepository extends MongoRepository<OrganType, Integer> {

    /**
     * Find organ type by name
     */
    Optional<OrganType> findByName(String name);

    /**
     * Find all active organ types
     */
    List<OrganType> findByIsActiveTrue();

    /**
     * Check if organ type exists by name
     */
    boolean existsByName(String name);
}