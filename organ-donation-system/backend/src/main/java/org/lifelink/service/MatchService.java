package org.lifelink.service;

import lombok.RequiredArgsConstructor;
import org.lifelink.dto.request.MatchRequest;
import org.lifelink.entity.*;
import org.lifelink.exception.ResourceNotFoundException;
import org.lifelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final DonorRepository donorRepository;
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final org.lifelink.util.MongoIdGeneratorService idGeneratorService;

    @Transactional
    public Match createMatch(MatchRequest dto, Long adminUserId) {
        Donor donor = donorRepository.findById(dto.getDonorId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found"));

        Request request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        // Calculate compatibility score
        BigDecimal matchScore = Match.calculateCompatibilityScore(donor, request);

        Match match = Match.builder()
            .matchId(idGeneratorService.nextId())
                .donor(donor)
                .request(request)
                .matchScore(matchScore)
                .compatibilityNotes(dto.getCompatibilityNotes())
                .status(Match.Status.PROPOSED)
                .proposedBy(admin)
                .proposedDate(LocalDateTime.now())
                .notes(dto.getNotes())
                .build();

        match = matchRepository.save(match);

        // Update request status
        request.setStatus(Request.Status.MATCHED);
        requestRepository.save(request);

        // Notify hospital
        notificationService.createNotification(
                request.getUser(),
                "Match Found",
                "A compatible donor has been matched with your request #" + request.getRequestId(),
                Notification.Type.SUCCESS
        );

        // Notify donor
        notificationService.createNotification(
                donor.getUser(),
                "Match Proposed",
                "You have been matched with an organ request. Thank you for your generosity!",
                Notification.Type.INFO
        );

        return match;
    }

    public Match getMatchById(Long matchId) {
        return matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + matchId));
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public List<Match> getMatchesByDonor(Long donorId) {
        return matchRepository.findByDonor_DonorId(donorId);
    }

    public List<Match> getMatchesByRequest(Long requestId) {
        return matchRepository.findByRequest_RequestId(requestId);
    }

    public List<Donor> getCompatibleDonors(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        // Search for compatible donors
        return donorRepository.searchDonors(
                request.getPatientBloodType(),
                extractCity(request.getHospitalLocation()),
                extractState(request.getHospitalLocation()),
                request.getOrganType().getOrganTypeId()
        );
    }

    @Transactional
    public Match updateMatchStatus(Long matchId, Match.Status newStatus, Long adminUserId) {
        Match match = getMatchById(matchId);
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        match.setStatus(newStatus);

        if (newStatus == Match.Status.ACCEPTED) {
            match.setApprovedBy(admin);
            match.setApprovedDate(LocalDateTime.now());

            // Update request status
            Request request = match.getRequest();
            request.setStatus(Request.Status.COMPLETED);
            requestRepository.save(request);
        }

        match = matchRepository.save(match);

        // Notify parties
        notificationService.createNotification(
                match.getRequest().getUser(),
                "Match Status Updated",
                "Match status changed to: " + newStatus,
                Notification.Type.INFO
        );

        return match;
    }

    public long getActiveMatchCount() {
        return matchRepository.countByStatus(Match.Status.PROPOSED);
    }

    public long getCompletedMatchCount() {
        return matchRepository.countByStatus(Match.Status.COMPLETED);
    }

    private String extractCity(String location) {
        if (location == null) return null;
        String[] parts = location.split(",");
        return parts.length > 0 ? parts[0].trim() : null;
    }

    private String extractState(String location) {
        if (location == null) return null;
        String[] parts = location.split(",");
        return parts.length > 1 ? parts[1].trim() : null;
    }
}