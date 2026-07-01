package com.uts.biblioteca.controller;

import com.uts.biblioteca.dto.request.UpdateProfileRequest;
import com.uts.biblioteca.dto.response.UserResponse;
import com.uts.biblioteca.model.entity.User;
import com.uts.biblioteca.service.interfaces.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.jspecify.annotations.NonNull;

import java.util.Objects;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para gestión de perfil de usuario.
 * Endpoints: /api/users/*
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** Obtiene el perfil del usuario autenticado */
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getUserProfile(Objects.requireNonNull(user.getId())));
    }

    /** Actualiza el perfil del usuario (nombre y foto) */
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String photoUrl) {
        return ResponseEntity.ok(userService.updateUserProfile(Objects.requireNonNull(user.getId()), name, photoUrl));
    }

    /** Actualiza solo la foto de perfil (recibe base64 en body) */
    @PutMapping("/profile/photo")
    public ResponseEntity<UserResponse> updateProfilePhoto(
            @AuthenticationPrincipal User user,
            @RequestBody PhotoRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(Objects.requireNonNull(user.getId()), null, request.photoUrl()));
    }

    public record PhotoRequest(@NotBlank(message = "La URL de la foto es requerida") String photoUrl) {}

    /** Actualiza el perfil completo del usuario (documento, nombre, semestre, teléfono) */
    @PutMapping("/profile/full")
    public ResponseEntity<UserResponse> updateFullProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody @NonNull UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateFullProfile(Objects.requireNonNull(user.getId()), request));
    }

    /** Verifica si el perfil del usuario está completo */
    @GetMapping("/profile/complete")
    public ResponseEntity<Boolean> isProfileComplete(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.isProfileComplete(Objects.requireNonNull(user.getId())));
    }
}
