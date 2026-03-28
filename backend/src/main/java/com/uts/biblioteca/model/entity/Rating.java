package com.uts.biblioteca.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/** Entidad de documento MongoDB para calificaciones de libros */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ratings")
public class Rating {

    @Id
    private String id;

    private String userId;

    private String bookId;

    private Integer rating;

    private String comment;

    private Instant createdAt;
}
