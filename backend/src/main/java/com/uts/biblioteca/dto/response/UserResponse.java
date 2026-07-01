package com.uts.biblioteca.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.uts.biblioteca.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/** DTO para respuesta de usuario */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;

    private String name;

    private Integer semester;

    private String phone;

    private String email;

    private Role role;

    private String photoUrl;

    private Instant createdAt;
}
