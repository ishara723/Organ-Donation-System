package org.lifelink.service;

import lombok.RequiredArgsConstructor;
import org.lifelink.dto.response.DashboardStatsResponse;
import org.lifelink.entity.Donor;
import org.lifelink.entity.Request;
import org.lifelink.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final DonorRepository donorRepository;
    private final RequestRepository requestRepository;
    private final MatchRepository matchRepository;

    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        // Donor stats
        stats.setTotalDonors(donorRepository.count());
        stats.setVerifiedDonors(donorRepository.countByIsVerifiedTrue());
        stats.setPendingDonors(donorRepository.countByConsentStatus(Donor.ConsentStatus.PENDING));

        // Request stats
        stats.setTotalRequests(requestRepository.count());
        stats.setPendingRequests(requestRepository.countByStatus(Request.Status.PENDING));
        stats.setApprovedRequests(requestRepository.countByStatus(Request.Status.APPROVED));

        // Match stats
        stats.setActiveMatches(matchRepository.countByStatus(org.lifelink.entity.Match.Status.PROPOSED));
        stats.setCompletedMatches(matchRepository.countByStatus(org.lifelink.entity.Match.Status.COMPLETED));

        // Requests by urgency
        Map<String, Long> requestsByUrgency = new HashMap<>();
        for (Request.UrgencyLevel level : Request.UrgencyLevel.values()) {
            requestsByUrgency.put(level.name(), requestRepository.countByUrgencyLevel(level));
        }
        stats.setRequestsByUrgency(requestsByUrgency);

        return stats;
    }
}