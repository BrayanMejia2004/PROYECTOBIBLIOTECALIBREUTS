package com.uts.biblioteca.repository;

import com.uts.biblioteca.model.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/** Repositorio para acceso a documentos de libros en MongoDB */
@Repository
public interface BookRepository extends MongoRepository<Book, String> {

    /** Filtra libros por disponibilidad */
    Page<Book> findByAvailability(Boolean availability, Pageable pageable);

    /** Filtra libros por categoría */
    Page<Book> findByCategory(String category, Pageable pageable);

    /** Busca libros por autor (insensible a mayúsculas) */
    Page<Book> findByAuthorContainingIgnoreCase(String author, Pageable pageable);

    /** Busca libros por título, autor o categoría usando regex */
    @Query("{ $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' } }, " +
           "{ 'author': { $regex: ?0, $options: 'i' } }, " +
           "{ 'category': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Page<Book> search(String searchTerm, Pageable pageable);

    /** Top 10 libros mejor calificados */
    List<Book> findTop10ByOrderByRatingDesc();

    /** Top 10 libros más populares (más calificaciones) */
    List<Book> findTop10ByOrderByRatingCountDesc();

    /** Busca libro por título y autor */
    Optional<Book> findByTitleAndAuthor(String title, String author);
}
