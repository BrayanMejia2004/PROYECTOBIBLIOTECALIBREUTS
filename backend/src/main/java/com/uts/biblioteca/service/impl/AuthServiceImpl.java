package com.uts.biblioteca.service.impl;

import com.uts.biblioteca.dto.request.LoginRequest;
import com.uts.biblioteca.dto.request.RegisterRequest;
import com.uts.biblioteca.dto.response.AuthResponse;
import com.uts.biblioteca.exception.BadRequestException;
import com.uts.biblioteca.model.entity.RefreshToken;
import com.uts.biblioteca.model.entity.User;
import com.uts.biblioteca.model.enums.Role;
import com.uts.biblioteca.repository.RefreshTokenRepository;
import com.uts.biblioteca.repository.UserRepository;
import com.uts.biblioteca.security.JwtTokenProvider;
import com.uts.biblioteca.service.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

/** Implementación de servicios de autenticación */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @SuppressWarnings("null")
    @Override
    public AuthResponse register(RegisterRequest request) {
        log.info("Intentando registrar usuario con email: {}", request.getEmail());
        
        // Valida que el correo no exista
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("El correo ya está registrado: {}", request.getEmail());
            throw new BadRequestException("El correo ya está registrado");
        }

        // Valida dominio institucional
        String emailDomain = request.getEmail().substring(request.getEmail().indexOf("@"));
        if (!emailDomain.equals("@uts.edu.co")) {
            log.warn("Dominio de correo inválido: {}", emailDomain);
            throw new BadRequestException("Solo se permiten correos institucionales @uts.edu.co");
        }

        try {
            // Crea usuario con contraseña encriptada
            // Los campos adicionales (document, name, semester, phone) se completarán en el perfil
            User user = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

            user = userRepository.save(user);
            log.info("Usuario guardado exitosamente: {}", user.getId());

            // Genera token JWT
            String token = jwtTokenProvider.generateToken(user);
            
            // Genera y guarda refresh token
            String refreshTokenValue = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
            saveRefreshToken(user.getId(), refreshTokenValue);

            return AuthResponse.builder()
                    .token(token)
                    .id(user.getId())
                    .document(user.getDocument())
                    .name(user.getName())
                    .semester(user.getSemester())
                    .phone(user.getPhone())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();
        } catch (Exception e) {
            log.error("Error al registrar usuario: {}", e.getMessage(), e);
            throw new BadRequestException("Error al registrar usuario: " + e.getMessage());
        }
    }

    @SuppressWarnings("null")
    @Override
    public AuthResponse login(LoginRequest request) {
        // Autentica credenciales
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        // Genera token JWT
        String token = jwtTokenProvider.generateToken(user);
        
        // Genera y guarda refresh token
        String refreshTokenValue = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
        saveRefreshToken(user.getId(), refreshTokenValue);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .document(user.getDocument())
                .name(user.getName())
                .semester(user.getSemester())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
    
    @Override
    public AuthResponse refreshToken(String currentToken) {
        // Valida el refresh token contra la base de datos
        @SuppressWarnings("null")
        RefreshToken storedToken = refreshTokenRepository.findByTokenAndRevokedFalse(currentToken)
                .orElseThrow(() -> new BadRequestException("Refresh token inválido o expirado"));
        
        // Verifica si no ha expirado
        if (storedToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("Refresh token expirado");
        }
        
        // Extrae el email del token actual
        String email = jwtTokenProvider.extractUsername(currentToken);
        
        // Busca el usuario
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));
        
        // Genera nuevo token
        String newToken = jwtTokenProvider.generateToken(user);
        
        return AuthResponse.builder()
                .token(newToken)
                .id(user.getId())
                .document(user.getDocument())
                .name(user.getName())
                .semester(user.getSemester())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
    
    @SuppressWarnings("null")
    @Override
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                    log.info("Refresh token revocado para usuario");
                });
    }
    
    @SuppressWarnings("null")
    @Override
    public void logoutAll(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
        log.info("Todos los refresh tokens revocados para usuario: {}", userId);
    }
    
    @SuppressWarnings("null")
    private void saveRefreshToken(@NonNull String userId, @NonNull String tokenValue) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(tokenValue)
                .userId(userId)
                .expiresAt(Instant.now().plusMillis(jwtTokenProvider.getRefreshExpiration()))
                .createdAt(Instant.now())
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
    }
}
