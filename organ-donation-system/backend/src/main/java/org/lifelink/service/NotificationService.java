package org.lifelink.service;

import lombok.RequiredArgsConstructor;
import org.lifelink.entity.Notification;
import org.lifelink.entity.User;
import org.lifelink.exception.ResourceNotFoundException;
import org.lifelink.repository.NotificationRepository;
import org.lifelink.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final org.lifelink.util.MongoIdGeneratorService idGeneratorService;

    @Transactional
    public Notification createNotification(User user, String title, String message, Notification.Type type) {
        Notification notification = Notification.builder()
            .notificationId(idGeneratorService.nextId())
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    @Transactional
    public void notifyAdmins(String title, String message, Notification.Type type) {
        List<User> admins = userRepository.findByRole(User.Role.ADMIN);

        for (User admin : admins) {
            createNotification(admin, title, message, type);
        }
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUser_UserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);

        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }

        notificationRepository.saveAll(unreadNotifications);
    }

    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own notifications");
        }

        notificationRepository.delete(notification);
    }
}