package com.uts.biblioteca.controller;

import com.uts.biblioteca.dto.response.NotificationResponse;
import com.uts.biblioteca.model.entity.User;
import com.uts.biblioteca.service.interfaces.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final LoanService loanService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(loanService.getNotifications(Objects.requireNonNull(user.getId())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable @NonNull String id,
            @AuthenticationPrincipal User user) {
        loanService.markNotificationAsRead(id, Objects.requireNonNull(user.getId()));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal User user) {
        loanService.markAllNotificationsAsRead(Objects.requireNonNull(user.getId()));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin")
    public ResponseEntity<List<NotificationResponse>> getAdminNotifications() {
        return ResponseEntity.ok(loanService.getAdminNotifications());
    }

    @PutMapping("/admin/{id}/read")
    public ResponseEntity<Void> markAdminNotificationAsRead(
            @PathVariable @NonNull String id) {
        loanService.markAdminNotificationAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/read-all")
    public ResponseEntity<Void> markAllAdminNotificationsAsRead() {
        loanService.markAllAdminNotificationsAsRead();
        return ResponseEntity.ok().build();
    }
}
