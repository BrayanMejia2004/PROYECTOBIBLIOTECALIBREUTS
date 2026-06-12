package com.uts.biblioteca.dto.request;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/** DTO para solicitud de actualización de libro */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookRequest {
    @Size(min = 1, max = 200, message = "El título debe tener entre 1 y 200 caracteres")
    private String title;

    @Size(min = 1, max = 200, message = "El autor debe tener entre 1 y 200 caracteres")
    private String author;

    @Size(max = 2000, message = "El resumen debe tener máximo 2000 caracteres")
    private String summary;

    @PastOrPresent(message = "La fecha de publicación no puede ser futura")
    private Instant publicationDate;

    @Positive(message = "El número de páginas debe ser positivo")
    private Integer pages;

    @Size(min = 1, max = 50, message = "El idioma debe tener entre 1 y 50 caracteres")
    private String language;

    @Size(min = 1, max = 50, message = "La categoría debe tener entre 1 y 50 caracteres")
    private String category;

    private Boolean availability;
}
