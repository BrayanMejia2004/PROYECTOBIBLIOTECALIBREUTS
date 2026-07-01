package com.uts.biblioteca.service.interfaces;

import com.uts.biblioteca.dto.request.UpdateProfileRequest;
import com.uts.biblioteca.dto.request.UpdateUserRequest;
import com.uts.biblioteca.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.jspecify.annotations.NonNull;

/** Interfaz para servicios de usuario */
public interface UserService {

    /** Obtiene el perfil de un usuario */
    UserResponse getUserProfile(@NonNull String userId);

    /** Actualiza el perfil del usuario (nombre y foto) */
    UserResponse updateUserProfile(@NonNull String userId, String name, String photoUrl);

    /** Actualiza el perfil completo del usuario (document, name, semester, phone) */
    UserResponse updateFullProfile(@NonNull String userId, @NonNull UpdateProfileRequest request);

    /** Verifica si el perfil del usuario está completo */
    boolean isProfileComplete(@NonNull String userId);

    /** Obtiene todos los usuarios del sistema (admin) */
    Page<UserResponse> getAllUsers(@NonNull Pageable pageable);

    /** Actualiza un usuario por el administrador */
    UserResponse updateUser(@NonNull String userId, @NonNull UpdateUserRequest request);

    /** Elimina un usuario por el administrador */
    void deleteUser(@NonNull String userId);
}
