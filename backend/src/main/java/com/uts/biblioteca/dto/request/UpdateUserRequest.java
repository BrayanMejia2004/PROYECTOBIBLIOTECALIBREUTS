package com.uts.biblioteca.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO para actualización de usuario por administrador */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @NotBlank(message = "El documento es requerido")
    @Size(min = 5, max = 20, message = "El documento debe tener entre 5 y 20 caracteres")
    private String document;

    @NotBlank(message = "El nombre es requerido")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;

    @NotNull(message = "El semestre es requerido")
    @Positive(message = "El semestre debe ser un número positivo")
    private Integer semester;

    @NotBlank(message = "El teléfono es requerido")
    @Size(min = 7, max = 15, message = "El teléfono debe tener entre 7 y 15 caracteres")
    private String phone;

    @NotBlank(message = "El correo es requerido")
    @Email(message = "Debe ser un correo válido")
    @Pattern(regexp = ".*@uts\\.edu\\.co$", message = "Solo se permiten correos institucionales @uts.edu.co")
    private String email;

    @Size(min = 10, max = 50, message = "La contraseña debe tener entre 10 y 50 caracteres")
    @Pattern(
        regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{10,}$",
        message = "La contraseña debe tener al menos 10 caracteres, incluyendo letras, números y un símbolo"
    )
    private String password;
}
