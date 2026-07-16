package org.lifelink.service;

import lombok.RequiredArgsConstructor;
import org.lifelink.dto.request.OrganRequestRequest;
import org.lifelink.entity.*;
import org.lifelink.exception.ResourceNotFoundException;
import org.lifelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final OrganTypeRepository organTypeRepository;
    private final NotificationService notificationService;
    private final org.lifelink.util.MongoIdGeneratorService idGeneratorService;

    @Transactional
    public Request createRequest(Long userId, OrganRequestRequest dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        OrganType organType = organTypeRepository.findById(dto.getOrganTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Organ type not found"));

        Request request = Request.builder()
            .requestId(idGeneratorService.nextId())
                .user(user)
                .organType(organType)
                .patientName(dto.getPatientName())
                .patientAge(dto.getPatientAge())
                .patientBloodType(Donor.BloodType.fromDisplayName(dto.getPatientBloodType()))
                .urgencyLevel(Request.UrgencyLevel.valueOf(dto.getUrgencyLevel()))
                .hospitalName(dto.getHospitalName())
                .hospitalLocation(dto.getHospitalLocation())
                .medicalReason(dto.getMedicalReason())
                .additionalNotes(dto.getAdditionalNotes())
                .status(Request.Status.PENDING)
                .build();

            request.setPriority(request.calculatePriority());

        request = requestRepository.save(request);

        // Notify admins
        notificationService.notifyAdmins(
                "New Organ Request",
                "New " + organType.getName() + " request from " + dto.getHospitalName() +
                        " (Urgency: " + dto.getUrgencyLevel() + ")",
                Notification.Type.WARNING
        );

        return request;
    }

    public Request getRequestById(Long requestId) {
        return requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));
    }

    public List<Request> getUserRequests(Long userId) {
        return requestRepository.findByUser_UserId(userId);
    }

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<Request> getActiveRequests() {
        return requestRepository.findActiveRequests();
    }

    public List<Request> searchRequests(Request.Status status, Request.UrgencyLevel urgency, Integer organTypeId) {
        return requestRepository.searchRequests(status, urgency, organTypeId);
    }

    @Transactional
    public Request updateStatus(Long requestId, Request.Status newStatus, Long adminUserId, String notes) {
        Request request = getRequestById(requestId);
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        request.setStatus(newStatus);
        request.setReviewedBy(admin);
        request.setReviewedAt(LocalDateTime.now());

        if (notes != null && !notes.isEmpty()) {
            String currentNotes = request.getAdditionalNotes() != null ? request.getAdditionalNotes() : "";
            request.setAdditionalNotes(currentNotes + "\n[Admin] " + notes);
        }

        request = requestRepository.save(request);

        // Notify requester
        notificationService.createNotification(
                request.getUser(),
                "Request Status Updated",
                "Your organ request status changed to: " + newStatus,
                newStatus == Request.Status.APPROVED ? Notification.Type.SUCCESS : Notification.Type.INFO
        );

        return request;
    }

    @Transactional
    public void cancelRequest(Long requestId, Long userId) {
        Request request = getRequestById(requestId);

        if (!request.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel your own requests");
        }

        request.setStatus(Request.Status.CANCELLED);
        requestRepository.save(request);
    }

    public long getPendingRequestCount() {
        return requestRepository.countByStatus(Request.Status.PENDING);
    }

    public long getApprovedRequestCount() {
        return requestRepository.countByStatus(Request.Status.APPROVED);
    }
}