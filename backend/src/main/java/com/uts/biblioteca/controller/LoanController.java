package com.uts.biblioteca.controller;

import com.uts.biblioteca.dto.request.CreateLoanRequest;
import com.uts.biblioteca.dto.response.LoanResponse;
import com.uts.biblioteca.model.entity.User;
import com.uts.biblioteca.service.interfaces.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

import java.util.Objects;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para gestión de préstamos.
 * Endpoints: /api/loans/*
 */
@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    /** Solicita un nuevo préstamo de libro */
    @PostMapping
    public ResponseEntity<LoanResponse> createLoan(
            @Valid @RequestBody @NonNull CreateLoanRequest request,
            @AuthenticationPrincipal User user) {
        LoanResponse response = loanService.createLoan(Objects.requireNonNull(user.getId()), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** Obtiene los préstamos del usuario autenticado */
    @GetMapping
    public ResponseEntity<Page<LoanResponse>> getUserLoans(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20) @NonNull Pageable pageable) {
        return ResponseEntity.ok(loanService.getUserLoans(Objects.requireNonNull(user.getId()), pageable));
    }

    /** Obtiene un préstamo específico por ID */
    @GetMapping("/{id}")
    public ResponseEntity<LoanResponse> getLoanById(@PathVariable @NonNull String id) {
        return ResponseEntity.ok(loanService.getLoanById(id));
    }

    /** Devuelve un libro prestado */
    @PostMapping("/{id}/return")
    public ResponseEntity<LoanResponse> returnLoan(
            @PathVariable @NonNull String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(loanService.returnLoan(id, Objects.requireNonNull(user.getId())));
    }
}
