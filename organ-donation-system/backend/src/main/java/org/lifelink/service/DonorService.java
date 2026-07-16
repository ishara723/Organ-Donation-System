package org.lifelink.service;

import lombok.RequiredArgsConstructor;
import org.lifelink.dto.request.DonorProfileRequest;
import org.lifelink.entity.*;
import org.lifelink.exception.ResourceNotFoundException;
import org.lifelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;
    private final OrganTypeRepository organTypeRepository;
    private final DonorOrganRepository donorOrganRepository;
    private final NotificationService notificationService;
    private final org.lifelink.util.MongoIdGeneratorService idGeneratorService;

    @Transactional
    public Donor createDonorProfile(Long userId, DonorProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (donorRepository.findByUser_UserId(userId).isPresent()) {
            throw new IllegalArgumentException("Donor profile already exists");
        }

        Donor donor = Donor.builder()
            .donorId(idGeneratorService.nextId())
                .user(user)
                .fullName(request.getFullName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(Donor.Gender.valueOf(request.getGender()))
                .bloodType(Donor.BloodType.fromDisplayName(request.getBloodType()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .medicalHistory(request.getMedicalHistory())
                .emergencyContact(request.getEmergencyContact())
                .consentStatus(Donor.ConsentStatus.PENDING)
                .isVerified(false)
                .donorOrgans(new ArrayList<>())
                .build();

        donor = donorRepository.save(donor);

        // Add selected organs
        for (Integer organTypeId : request.getOrganTypeIds()) {
            OrganType organType = organTypeRepository.findById(organTypeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Organ type not found: " + organTypeId));

            DonorOrgan donorOrgan = DonorOrgan.builder()
                .id(idGeneratorService.nextId())
                    .donor(donor)
                    .organType(organType)
                    .availabilityStatus(DonorOrgan.AvailabilityStatus.AVAILABLE)
                    .build();

            donorOrganRepository.save(donorOrgan);
            donor.addOrgan(donorOrgan);
        }

        donorRepository.save(donor);

        // Notify admins
        notificationService.notifyAdmins(
                "New Donor Registration",
                "New donor " + donor.getFullName() + " registered and awaiting verification",
                Notification.Type.INFO
        );

        return donorRepository.findById(donor.getDonorId()).orElseThrow();
    }

    public Donor getDonorByUserId(Long userId) {
        return donorRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found"));
    }

    public Donor getDonorById(Long donorId) {
        return donorRepository.findById(donorId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: " + donorId));
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public List<Donor> getVerifiedDonors() {
        return donorRepository.findByIsVerifiedTrue();
    }

    public List<Donor> searchDonors(String bloodType, String city, String state, Integer organTypeId) {
        Donor.BloodType bt = bloodType != null && !bloodType.isEmpty() ?
                Donor.BloodType.fromDisplayName(bloodType) : null;
        return donorRepository.searchDonors(bt, city, state, organTypeId);
    }

    @Transactional
    public Donor verifyDonor(Long donorId, Long adminUserId, boolean verified) {
        Donor donor = getDonorById(donorId);
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        donor.setIsVerified(verified);
        if (verified) {
            donor.setVerifiedDate(LocalDateTime.now());
            donor.setVerifiedBy(admin);
            donor.setConsentStatus(Donor.ConsentStatus.APPROVED);
            donor.setConsentDate(LocalDateTime.now());
        }

        donor = donorRepository.save(donor);

        // Notify donor
        notificationService.createNotification(
                donor.getUser(),
                verified ? "Profile Verified" : "Verification Pending",
                verified ? "Your donor profile has been verified and approved!" :
                        "Your profile verification is pending review.",
                verified ? Notification.Type.SUCCESS : Notification.Type.INFO
        );

        return donor;
    }

    @Transactional
    public Donor updateConsentStatus(Long donorId, Donor.ConsentStatus newStatus) {
        Donor donor = getDonorById(donorId);
        donor.setConsentStatus(newStatus);
        donor.setConsentDate(LocalDateTime.now());
        return donorRepository.save(donor);
    }

    public long getVerifiedDonorCount() {
        return donorRepository.countByIsVerifiedTrue();
    }

    public long getPendingDonorCount() {
        return donorRepository.countByConsentStatus(Donor.ConsentStatus.PENDING);
    }
}