package com.uts.biblioteca.controller;

import com.uts.biblioteca.dto.request.UpdateProfileRequest;
import com.uts.biblioteca.dto.response.UserResponse;
import com.uts.biblioteca.model.entity.User;
import com.uts.biblioteca.service.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
        return ResponseEntity.ok(userService.getUserProfile(user.getId()));
    }

    /** Actualiza el perfil del usuario (nombre y foto) */
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String photoUrl) {
        return ResponseEntity.ok(userService.updateUserProfile(user.getId(), name, photoUrl));
    }

    /** Actualiza solo la foto de perfil (recibe base64 en body) */
    @PutMapping("/profile/photo")
    public ResponseEntity<UserResponse> updateProfilePhoto(
            @AuthenticationPrincipal User user,
            @RequestBody PhotoRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(user.getId(), null, request.photoUrl()));
    }

    public record PhotoRequest(String photoUrl) {}

    /** Actualiza el perfil completo del usuario (documento, nombre, semestre, teléfono) */
    @PutMapping("/profile/full")
    public ResponseEntity<UserResponse> updateFullProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateFullProfile(user.getId(), request));
    }

    /** Verifica si el perfil del usuario está completo */
    @GetMapping("/profile/complete")
    public ResponseEntity<Boolean> isProfileComplete(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.isProfileComplete(user.getId()));
    }
}
