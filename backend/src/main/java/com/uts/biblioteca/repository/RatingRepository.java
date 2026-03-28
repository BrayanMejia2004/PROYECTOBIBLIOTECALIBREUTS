package com.uts.biblioteca.repository;

import com.uts.biblioteca.model.entity.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/** Repositorio para acceso a documentos de calificaciones en MongoDB */
@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {

    /** Obtiene todas las calificaciones de un libro */
    List<Rating> findByBookId(String bookId);

    /** Busca calificación de un usuario para un libro */
    Optional<Rating> findByUserIdAndBookId(String userId, String bookId);

    /** Verifica si usuario ya calificó un libro */
    boolean existsByUserIdAndBookId(String userId, String bookId);

    /** Calcula promedio de calificación de un libro */
    Double findAverageRatingByBookId(String bookId);
}
