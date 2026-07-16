package org.lifelink.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.lifelink.dto.response.DashboardStatsResponse;
import org.lifelink.entity.Donor;
import org.lifelink.entity.Request;
import org.lifelink.service.AdminService;
import org.lifelink.service.DonorService;
import org.lifelink.service.RequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin dashboard and management endpoints")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final DonorService donorService;
    private final RequestService requestService;

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/donors/pending")
    @Operation(summary = "Get donors pending verification")
    public ResponseEntity<List<Donor>> getPendingDonors() {
        List<Donor> donors = donorService.getAllDonors().stream()
                .filter(d -> !d.getIsVerified())
                .toList();
        return ResponseEntity.ok(donors);
    }

    @GetMapping("/requests/pending")
    @Operation(summary = "Get pending requests")
    public ResponseEntity<List<Request>> getPendingRequests() {
        List<Request> requests = requestService.searchRequests(Request.Status.PENDING, null, null);
        return ResponseEntity.ok(requests);
    }
}