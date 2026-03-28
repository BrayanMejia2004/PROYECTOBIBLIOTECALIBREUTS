package com.uts.biblioteca.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/** Entidad de documento MongoDB para libros */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "books")
public class Book {

    @Id
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

    private Instant createdAt;

    private Instant updatedAt;
}
