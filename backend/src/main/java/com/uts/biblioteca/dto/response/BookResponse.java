package com.uts.biblioteca.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/** DTO para respuesta de libro */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {

    private String id;

    private String title;

    private String author;

    private String summary;

    private Instant publicationDate;

    private Integer pages;

    private String language;

    private String category;

    private Double rating;

    private Integer ratingCount;

    private Boolean availability;

    private String coverImage;
}
