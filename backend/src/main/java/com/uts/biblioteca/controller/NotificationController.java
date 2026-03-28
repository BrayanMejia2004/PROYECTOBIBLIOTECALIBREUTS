package com.uts.biblioteca.controller;

import com.uts.biblioteca.dto.response.NotificationResponse;
import com.uts.biblioteca.model.entity.User;
import com.uts.biblioteca.service.interfaces.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final LoanService loanService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(loanService.getNotifications(user.getId()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        loanService.markNotificationAsRead(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal User user) {
        loanService.markAllNotificationsAsRead(user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin")
    public ResponseEntity<List<NotificationResponse>> getAdminNotifications() {
        return ResponseEntity.ok(loanService.getAdminNotifications());
    }

    @PutMapping("/admin/{id}/read")
    public ResponseEntity<Void> markAdminNotificationAsRead(
            @PathVariable String id) {
        loanService.markAdminNotificationAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/read-all")
    public ResponseEntity<Void> markAllAdminNotificationsAsRead() {
        loanService.markAllAdminNotificationsAsRead();
        return ResponseEntity.ok().build();
    }
}
