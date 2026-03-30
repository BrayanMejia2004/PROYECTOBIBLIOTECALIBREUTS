package com.uts.biblioteca.dto.response;

import com.uts.biblioteca.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO para respuesta de autenticación */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private String id;

    private String document;

    private String name;

    private Integer semester;

    private String phone;

    private String email;

    private Role role;

    private String photoUrl;
}
