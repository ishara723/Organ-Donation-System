package org.lifelink.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchRequest {

    @NotNull(message = "Donor ID is required")
    @Positive(message = "Invalid donor ID")
    private Long donorId;

    @NotNull(message = "Request ID is required")
    @Positive(message = "Invalid request ID")
    private Long requestId;

    private String compatibilityNotes;

    private String notes;
}