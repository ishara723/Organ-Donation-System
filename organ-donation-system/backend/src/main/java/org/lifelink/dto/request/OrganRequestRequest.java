package org.lifelink.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganRequestRequest {

    @NotNull(message = "Organ type is required")
    @Positive(message = "Invalid organ type ID")
    private Integer organTypeId;

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotNull(message = "Patient age is required")
    @Min(value = 0, message = "Age must be positive")
    @Max(value = 150, message = "Invalid age")
    private Integer patientAge;

    @NotBlank(message = "Patient blood type is required")
    @Pattern(regexp = "A\\+|A-|B\\+|B-|AB\\+|AB-|O\\+|O-", message = "Invalid blood type")
    private String patientBloodType;

    @NotBlank(message = "Urgency level is required")
    @Pattern(regexp = "LOW|MEDIUM|HIGH|CRITICAL", message = "Invalid urgency level")
    private String urgencyLevel;

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "Hospital location is required")
    private String hospitalLocation;

    @NotBlank(message = "Medical reason is required")
    @Size(min = 10, message = "Medical reason must be at least 10 characters")
    private String medicalReason;

    private String additionalNotes;
}