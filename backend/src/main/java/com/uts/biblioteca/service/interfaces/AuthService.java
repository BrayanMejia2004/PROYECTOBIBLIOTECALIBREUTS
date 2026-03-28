package com.uts.biblioteca.service.interfaces;

import com.uts.biblioteca.dto.request.LoginRequest;
import com.uts.biblioteca.dto.request.RegisterRequest;
import com.uts.biblioteca.dto.response.AuthResponse;

/** Interfaz para servicios de autenticación */
public interface AuthService {

    /** Registra un nuevo usuario en el sistema */
    AuthResponse register(RegisterRequest request);

    /** Autentica un usuario y retorna token JWT */
    AuthResponse login(LoginRequest request);
    
    /** Refresca el token JWT usando el token actual */
    AuthResponse refreshToken(String currentToken);
    
    /** Invalida el refresh token (logout) */
    void logout(String refreshToken);
    
    /** Invalida todos los refresh tokens de un usuario */
    void logoutAll(String userId);
}
