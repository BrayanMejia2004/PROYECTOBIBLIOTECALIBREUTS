package com.uts.biblioteca.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/** DTO para solicitud de creación de libro */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookRequest {

    @NotBlank(message = "El título es requerido")
    private String title;

    @NotBlank(message = "El autor es requerido")
    private String author;

    @NotBlank(message = "El resumen es requerido")
    private String summary;

    @NotNull(message = "La fecha de publicación es requerida")
    private Instant publicationDate;

    @NotNull(message = "El número de páginas es requerido")
    @Positive(message = "El número de páginas debe ser positivo")
    private Integer pages;

    @NotBlank(message = "El idioma es requerido")
    private String language;

    @NotBlank(message = "La categoría es requerida")
    private String category;

    private String coverImage;
}
