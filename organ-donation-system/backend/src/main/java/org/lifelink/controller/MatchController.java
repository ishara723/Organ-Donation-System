package org.lifelink.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.lifelink.dto.request.MatchRequest;
import org.lifelink.dto.request.UpdateStatusRequest;
import org.lifelink.dto.response.ApiResponse;
import org.lifelink.entity.Donor;
import org.lifelink.entity.Match;
import org.lifelink.entity.User;
import org.lifelink.service.MatchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
@Tag(name = "Matches", description = "Donor-recipient matching endpoints")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("hasRole('ADMIN')")
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    @Operation(summary = "Create match proposal (Admin only)")
    public ResponseEntity<ApiResponse<Match>> createMatch(
            @Valid @RequestBody MatchRequest dto,
            @AuthenticationPrincipal User admin) {
        Match match = matchService.createMatch(dto, admin.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Match created successfully", match));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get match by ID")
    public ResponseEntity<Match> getMatchById(@PathVariable Long id) {
        Match match = matchService.getMatchById(id);
        return ResponseEntity.ok(match);
    }

    @GetMapping
    @Operation(summary = "Get all matches")
    public ResponseEntity<List<Match>> getAllMatches() {
        List<Match> matches = matchService.getAllMatches();
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/by-donor/{donorId}")
    @Operation(summary = "Get matches for a specific donor")
    public ResponseEntity<List<Match>> getMatchesByDonor(@PathVariable Long donorId) {
        List<Match> matches = matchService.getMatchesByDonor(donorId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/by-request/{requestId}")
    @Operation(summary = "Get matches for a specific request")
    public ResponseEntity<List<Match>> getMatchesByRequest(@PathVariable Long requestId) {
        List<Match> matches = matchService.getMatchesByRequest(requestId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/compatible/{requestId}")
    @Operation(summary = "Get compatible donors for a request")
    public ResponseEntity<List<Donor>> getCompatibleDonors(@PathVariable Long requestId) {
        List<Donor> donors = matchService.getCompatibleDonors(requestId);
        return ResponseEntity.ok(donors);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update match status")
    public ResponseEntity<ApiResponse<Match>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest dto,
            @AuthenticationPrincipal User admin) {

        Match.Status newStatus = Match.Status.valueOf(dto.getStatus());
        Match updated = matchService.updateMatchStatus(id, newStatus, admin.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Match status updated", updated));
    }
}