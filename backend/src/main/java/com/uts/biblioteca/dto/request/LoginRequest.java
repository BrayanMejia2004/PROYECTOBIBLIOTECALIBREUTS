package com.uts.biblioteca.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO para solicitud de inicio de sesión */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "El correo es requerido")
    @Email(message = "Debe ser un correo válido")
    @Pattern(regexp = ".*@uts\\.edu\\.co$", message = "Solo se permiten correos institucionales @uts.edu.co")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    private String password;
}
