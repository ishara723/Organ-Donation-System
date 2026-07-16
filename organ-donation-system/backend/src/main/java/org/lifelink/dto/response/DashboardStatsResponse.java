package org.lifelink.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private long totalDonors;
    private long verifiedDonors;
    private long pendingDonors;

    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;

    private long activeMatches;
    private long completedMatches;

    private Map<String, Long> requestsByOrganType;
    private Map<String, Long> requestsByUrgency;
    private Map<String, Long> donorsByBloodType;
}