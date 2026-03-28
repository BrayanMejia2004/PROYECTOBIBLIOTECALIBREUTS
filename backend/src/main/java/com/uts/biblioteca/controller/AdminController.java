package com.uts.biblioteca.controller;

import com.uts.biblioteca.dto.request.UpdateUserRequest;
import com.uts.biblioteca.dto.response.AdminStatsResponse;
import com.uts.biblioteca.dto.response.LoanResponse;
import com.uts.biblioteca.dto.response.UserResponse;
import com.uts.biblioteca.model.enums.LoanStatus;
import com.uts.biblioteca.repository.BookRepository;
import com.uts.biblioteca.repository.LoanRepository;
import com.uts.biblioteca.repository.UserRepository;
import com.uts.biblioteca.service.interfaces.LoanService;
import com.uts.biblioteca.service.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

/**
 * Controlador para funciones de administración.
 * Endpoints: /api/admin/*
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final LoanService loanService;
    private final UserService userService;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

    /** Obtiene estadísticas del dashboard */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        long totalBooks = bookRepository.count();
        long totalUsers = userRepository.count();
        long activeLoans = loanRepository.countByStatus(LoanStatus.ACTIVE);
        long returnedLoans = loanRepository.countByStatus(LoanStatus.RETURNED);
        
        Instant now = Instant.now();
        long overdueLoans = loanRepository.findByStatusAndDueDateBefore(LoanStatus.ACTIVE, now).size();

        return ResponseEntity.ok(AdminStatsResponse.builder()
                .totalBooks(totalBooks)
                .totalUsers(totalUsers)
                .activeLoans(activeLoans)
                .overdueLoans(overdueLoans)
                .returnedLoans(returnedLoans)
                .build());
    }

    /** Obtiene todos los préstamos del sistema */
    @GetMapping("/loans")
    public ResponseEntity<Page<LoanResponse>> getAllLoans(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(loanService.getAllLoans(pageable));
    }

    /** Obtiene todos los usuarios del sistema */
    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    /** Actualiza un usuario */
    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    /** Elimina un usuario */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
