package org.lifelink.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.lifelink.dto.request.OrganRequestRequest;
import org.lifelink.dto.request.UpdateStatusRequest;
import org.lifelink.dto.response.ApiResponse;
import org.lifelink.entity.Request;
import org.lifelink.entity.User;
import org.lifelink.service.RequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
@RequiredArgsConstructor
@Tag(name = "Requests", description = "Organ request management endpoints")
@SecurityRequirement(name = "bearer-jwt")
public class RequestController {

    private final RequestService requestService;

    @PostMapping
    @PreAuthorize("hasRole('HOSPITAL')")
    @Operation(summary = "Create organ request", description = "Submit a new organ request for a patient")
    public ResponseEntity<ApiResponse<Request>> createRequest(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody OrganRequestRequest dto) {
        Request request = requestService.createRequest(user.getUserId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Request created successfully", request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOSPITAL', 'ADMIN')")
    @Operation(summary = "Get request by ID")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id) {
        Request request = requestService.getRequestById(id);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('HOSPITAL')")
    @Operation(summary = "Get current user's requests")
    public ResponseEntity<List<Request>> getMyRequests(@AuthenticationPrincipal User user) {
        List<Request> requests = requestService.getUserRequests(user.getUserId());
        return ResponseEntity.ok(requests);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HOSPITAL', 'ADMIN')")
    @Operation(summary = "Get all requests or search by criteria")
    public ResponseEntity<List<Request>> searchRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String urgencyLevel,
            @RequestParam(required = false) Integer organTypeId) {

        Request.Status statusEnum = status != null ? Request.Status.valueOf(status) : null;
        Request.UrgencyLevel urgencyEnum = urgencyLevel != null ? Request.UrgencyLevel.valueOf(urgencyLevel) : null;

        List<Request> requests = requestService.searchRequests(statusEnum, urgencyEnum, organTypeId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all active requests")
    public ResponseEntity<List<Request>> getActiveRequests() {
        List<Request> requests = requestService.getActiveRequests();
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update request status (Admin only)")
    public ResponseEntity<ApiResponse<Request>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest dto,
            @AuthenticationPrincipal User admin) {

        Request.Status newStatus = Request.Status.valueOf(dto.getStatus());
        Request updated = requestService.updateStatus(id, newStatus, admin.getUserId(), dto.getNotes());
        return ResponseEntity.ok(ApiResponse.success("Request status updated", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HOSPITAL')")
    @Operation(summary = "Cancel request")
    public ResponseEntity<ApiResponse<Void>> cancelRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        requestService.cancelRequest(id, user.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Request cancelled successfully"));
    }
}