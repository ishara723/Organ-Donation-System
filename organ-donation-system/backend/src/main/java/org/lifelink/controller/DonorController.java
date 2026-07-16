package org.lifelink.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.lifelink.dto.request.DonorProfileRequest;
import org.lifelink.dto.response.ApiResponse;
import org.lifelink.entity.Donor;
import org.lifelink.entity.User;
import org.lifelink.service.DonorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donors")
@RequiredArgsConstructor
@Tag(name = "Donors", description = "Donor profile management endpoints")
@SecurityRequirement(name = "bearer-jwt")
public class DonorController {

    private final DonorService donorService;

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    @Operation(summary = "Create donor profile", description = "Create a new donor profile with medical information and organ selection")
    public ResponseEntity<ApiResponse<Donor>> createProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DonorProfileRequest request) {
        Donor donor = donorService.createDonorProfile(user.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Donor profile created successfully", donor));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('DONOR')")
    @Operation(summary = "Get current user's donor profile")
    public ResponseEntity<Donor> getMyProfile(@AuthenticationPrincipal User user) {
        Donor donor = donorService.getDonorByUserId(user.getUserId());
        return ResponseEntity.ok(donor);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONOR', 'HOSPITAL', 'ADMIN')")
    @Operation(summary = "Get donor by ID")
    public ResponseEntity<Donor> getDonorById(@PathVariable Long id) {
        Donor donor = donorService.getDonorById(id);
        return ResponseEntity.ok(donor);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HOSPITAL', 'ADMIN')")
    @Operation(summary = "Get all donors")
    public ResponseEntity<List<Donor>> getAllDonors() {
        List<Donor> donors = donorService.getAllDonors();
        return ResponseEntity.ok(donors);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('HOSPITAL', 'ADMIN')")
    @Operation(summary = "Search donors by criteria")
    public ResponseEntity<List<Donor>> searchDonors(
            @RequestParam(required = false) String bloodType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Integer organTypeId) {
        List<Donor> donors = donorService.searchDonors(bloodType, city, state, organTypeId);
        return ResponseEntity.ok(donors);
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Verify donor profile (Admin only)")
    public ResponseEntity<ApiResponse<Donor>> verifyDonor(
            @PathVariable Long id,
            @RequestParam boolean verified,
            @AuthenticationPrincipal User admin) {
        Donor donor = donorService.verifyDonor(id, admin.getUserId(), verified);
        return ResponseEntity.ok(ApiResponse.success(
                verified ? "Donor verified successfully" : "Donor verification removed",
                donor
        ));
    }

    @PutMapping("/{id}/consent")
    @PreAuthorize("hasRole('DONOR')")
    @Operation(summary = "Update consent status")
    public ResponseEntity<ApiResponse<Donor>> updateConsent(
            @PathVariable Long id,
            @RequestParam String consentStatus,
            @AuthenticationPrincipal User user) {

        // Verify user owns this profile
        Donor donor = donorService.getDonorById(id);
        if (!donor.getUser().getUserId().equals(user.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("You can only update your own consent"));
        }

        Donor updated = donorService.updateConsentStatus(id, Donor.ConsentStatus.valueOf(consentStatus));
        return ResponseEntity.ok(ApiResponse.success("Consent status updated", updated));
    }
}