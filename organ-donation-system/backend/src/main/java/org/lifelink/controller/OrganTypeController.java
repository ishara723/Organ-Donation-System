package org.lifelink.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.lifelink.entity.OrganType;
import org.lifelink.service.OrganTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/organ-types")
@RequiredArgsConstructor
@Tag(name = "Organ Types", description = "Organ type reference data")
public class OrganTypeController {

    private final OrganTypeService organTypeService;

    @GetMapping
    @Operation(summary = "Get all organ types")
    public ResponseEntity<List<OrganType>> getAllOrganTypes() {
        List<OrganType> organTypes = organTypeService.getActiveOrganTypes();
        return ResponseEntity.ok(organTypes);
    }
}