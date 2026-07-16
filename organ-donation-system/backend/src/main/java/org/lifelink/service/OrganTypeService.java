package org.lifelink.service;

import lombok.RequiredArgsConstructor;
import org.lifelink.entity.OrganType;
import org.lifelink.repository.OrganTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganTypeService {

    private final OrganTypeRepository organTypeRepository;

    public List<OrganType> getAllOrganTypes() {
        return organTypeRepository.findAll();
    }

    public List<OrganType> getActiveOrganTypes() {
        return organTypeRepository.findByIsActiveTrue();
    }
}