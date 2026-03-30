package com.uts.biblioteca.service.impl;

import com.uts.biblioteca.dto.request.UpdateProfileRequest;
import com.uts.biblioteca.dto.request.UpdateUserRequest;
import com.uts.biblioteca.dto.response.UserResponse;
import com.uts.biblioteca.exception.BadRequestException;
import com.uts.biblioteca.exception.ResourceNotFoundException;
import com.uts.biblioteca.model.entity.User;
import com.uts.biblioteca.model.enums.LoanStatus;
import com.uts.biblioteca.repository.LoanRepository;
import com.uts.biblioteca.repository.UserRepository;
import com.uts.biblioteca.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/** Implementación de servicios de usuario */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getUserProfile(String userId) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserProfile(String userId, String name, String photoUrl) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (name != null && !name.isBlank()) {
            user.setName(name);
        }
        if (photoUrl != null) {
            if (photoUrl.isBlank()) {
                user.setPhotoUrl(null);
            } else {
                user.setPhotoUrl(photoUrl);
            }
        }
        user.setUpdatedAt(Instant.now());
        user = userRepository.save(user);

        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateFullProfile(String userId, UpdateProfileRequest request) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        user.setDocument(request.getDocument());
        user.setName(request.getName());
        user.setSemester(request.getSemester());
        user.setPhone(request.getPhone());
        user.setUpdatedAt(Instant.now());
        user = userRepository.save(user);

        return toUserResponse(user);
    }

    @Override
    public boolean isProfileComplete(String userId) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return user.getDocument() != null && !user.getDocument().isBlank()
                && user.getName() != null && !user.getName().isBlank()
                && user.getSemester() != null
                && user.getPhone() != null && !user.getPhone().isBlank();
    }

    @SuppressWarnings("null")
    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::toUserResponse);
    }

    @Override
    @Transactional
    public UserResponse updateUser(String userId, UpdateUserRequest request) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        user.setDocument(request.getDocument());
        user.setName(request.getName());
        user.setSemester(request.getSemester());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        user.setUpdatedAt(Instant.now());
        user = userRepository.save(user);

        return toUserResponse(user);
    }

    @SuppressWarnings("null")
    @Override
    @Transactional
    public void deleteUser(String userId) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        long activeLoans = loanRepository.countByUserIdAndStatus(userId, LoanStatus.ACTIVE);
        if (activeLoans > 0) {
            throw new BadRequestException("No se puede eliminar el usuario porque tiene préstamos activos");
        }

        userRepository.delete(user);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .document(user.getDocument())
                .name(user.getName())
                .semester(user.getSemester())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole())
                .photoUrl(user.getPhotoUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
