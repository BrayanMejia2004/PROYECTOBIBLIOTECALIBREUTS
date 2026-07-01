package com.uts.biblioteca.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/** Entidad de documento MongoDB para calificaciones de libros */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ratings")
@CompoundIndexes({
    @CompoundIndex(name = "idx_user_book", def = "{'userId': 1, 'bookId': 1}")
})
public class Rating {

    @Id
    private String id;

    private String userId;

    @Indexed
    private String bookId;

    private Integer rating;

    private String comment;

    private Instant createdAt;
}
