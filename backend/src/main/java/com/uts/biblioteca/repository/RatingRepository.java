package com.uts.biblioteca.repository;

import com.uts.biblioteca.model.entity.Rating;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/** Repositorio para acceso a documentos de calificaciones en MongoDB */
public interface RatingRepository extends MongoRepository<Rating, String> {

    /** Obtiene todas las calificaciones de un libro */
    List<Rating> findByBookId(String bookId);

    /** Busca calificación de un usuario para un libro */
    Optional<Rating> findByUserIdAndBookId(String userId, String bookId);

    /** Verifica si usuario ya calificó un libro */
    boolean existsByUserIdAndBookId(String userId, String bookId);

    /** Calcula promedio de calificación de un libro directamente en MongoDB */
    @Aggregation(pipeline = {
        "{ $match: { 'bookId': ?0 } }",
        "{ $group: { _id: null, average: { $avg: '$rating' } } }"
    })
    Double findAverageRatingByBookId(String bookId);

    /** Cuenta calificaciones de un libro */
    long countByBookId(String bookId);
}
