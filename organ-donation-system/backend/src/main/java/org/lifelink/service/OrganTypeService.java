package org.lifelink.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.lifelink.entity.OrganType;
import org.lifelink.repository.OrganTypeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganTypeService {

    private final OrganTypeRepository organTypeRepository;

    @PostConstruct
    public void initDefaultOrganTypes() {
        if (organTypeRepository.count() == 0) {
            List<OrganType> defaults = List.of(
                OrganType.builder().organTypeId(1).name("Kidney").description("Renal organ transplant").isActive(true).createdAt(LocalDateTime.now()).build(),
                OrganType.builder().organTypeId(2).name("Liver").description("Hepatic organ transplant").isActive(true).createdAt(LocalDateTime.now()).build(),
                OrganType.builder().organTypeId(3).name("Heart").description("Cardiac organ transplant").isActive(true).createdAt(LocalDateTime.now()).build(),
                OrganType.builder().organTypeId(4).name("Lungs").description("Pulmonary organ transplant").isActive(true).createdAt(LocalDateTime.now()).build(),
                OrganType.builder().organTypeId(5).name("Pancreas").description("Pancreatic organ transplant").isActive(true).createdAt(LocalDateTime.now()).build(),
                OrganType.builder().organTypeId(6).name("Corneas").description("Ocular tissue transplant").isActive(true).createdAt(LocalDateTime.now()).build()
            );
            organTypeRepository.saveAll(defaults);
        }
    }

    public List<OrganType> getAllOrganTypes() {
        initDefaultOrganTypes();
        return organTypeRepository.findAll();
    }

    public List<OrganType> getActiveOrganTypes() {
        initDefaultOrganTypes();
        return organTypeRepository.findByIsActiveTrue();
    }
}