package com.uts.biblioteca.controller;

import com.uts.biblioteca.dto.request.LoginRequest;
import com.uts.biblioteca.dto.request.RefreshRequest;
import com.uts.biblioteca.dto.request.RegisterRequest;
import com.uts.biblioteca.dto.response.AuthResponse;
import com.uts.biblioteca.service.interfaces.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controlador para autenticación de usuarios.
 * Endpoints: /api/auth/register, /api/auth/login
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** Registro de nuevo usuario con validación de correo @uts.edu.co */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** Inicio de sesión de usuario existente */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    /** Refresca el token JWT usando el token actual */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        AuthResponse response = authService.refreshToken(request.getToken());
        return ResponseEntity.ok(response);
    }
    
    /** Cierra la sesión invalidando el refresh token */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken != null && !refreshToken.isEmpty()) {
            authService.logout(refreshToken);
        }
        return ResponseEntity.ok(Map.of("message", "Sesión cerrada exitosamente"));
    }
    
    /** Cierra todas las sesiones del usuario */
    @PostMapping("/logout-all")
    public ResponseEntity<?> logoutAll(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        if (userId != null && !userId.isEmpty()) {
            authService.logoutAll(userId);
        }
        return ResponseEntity.ok(Map.of("message", "Todas las sesiones han sido cerradas"));
    }
}
