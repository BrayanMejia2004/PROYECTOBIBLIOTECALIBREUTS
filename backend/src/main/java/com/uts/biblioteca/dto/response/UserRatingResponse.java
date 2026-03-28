package com.uts.biblioteca.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO para respuesta de calificación del usuario */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRatingResponse {

    private Integer rating;

    private String comment;
}
