package com.uts.biblioteca.dto.request;

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
    private String title;
    private String author;
    private String summary;
    private Instant publicationDate;
    private Integer pages;
    private String language;
    private String category;
    private Boolean availability;
}
