package com.uts.biblioteca.service.interfaces;

import com.uts.biblioteca.dto.request.UpdateProfileRequest;
import com.uts.biblioteca.dto.request.UpdateUserRequest;
import com.uts.biblioteca.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** Interfaz para servicios de usuario */
public interface UserService {

    /** Obtiene el perfil de un usuario */
    UserResponse getUserProfile(String userId);

    /** Actualiza el perfil del usuario (nombre y foto) */
    UserResponse updateUserProfile(String userId, String name, String photoUrl);

    /** Actualiza el perfil completo del usuario (document, name, semester, phone) */
    UserResponse updateFullProfile(String userId, UpdateProfileRequest request);

    /** Verifica si el perfil del usuario está completo */
    boolean isProfileComplete(String userId);

    /** Obtiene todos los usuarios del sistema (admin) */
    Page<UserResponse> getAllUsers(Pageable pageable);

    /** Actualiza un usuario por el administrador */
    UserResponse updateUser(String userId, UpdateUserRequest request);

    /** Elimina un usuario por el administrador */
    void deleteUser(String userId);
}
