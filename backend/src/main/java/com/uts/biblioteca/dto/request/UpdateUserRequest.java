package com.uts.biblioteca.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Max;
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
    @Pattern(regexp = "\\d+", message = "El documento solo debe contener números")
    private String document;

    @NotBlank(message = "El nombre es requerido")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El nombre solo debe contener letras")
    private String name;

    @NotNull(message = "El semestre es requerido")
    @Positive(message = "El semestre debe ser un número positivo")
    @Max(value = 12, message = "El semestre debe ser máximo 12")
    private Integer semester;

    @NotBlank(message = "El teléfono es requerido")
    @Size(min = 7, max = 15, message = "El teléfono debe tener entre 7 y 15 caracteres")
    @Pattern(regexp = "\\d+", message = "El teléfono solo debe contener números")
    private String phone;

    @NotBlank(message = "El correo es requerido")
    @Email(message = "Debe ser un correo válido")
    @Pattern(regexp = ".*@uts\\.edu\\.co$", message = "Solo se permiten correos institucionales @uts.edu.co")
    private String email;

    @Size(min = 8, max = 50, message = "La contraseña debe tener entre 8 y 50 caracteres")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
        message = "La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&)"
    )
    private String password;
}
