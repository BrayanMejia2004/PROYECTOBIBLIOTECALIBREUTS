package com.uts.biblioteca.service.interfaces;

import com.uts.biblioteca.dto.request.CreateBookRequest;
import com.uts.biblioteca.dto.request.RatingRequest;
import com.uts.biblioteca.dto.request.UpdateBookRequest;
import com.uts.biblioteca.dto.response.BookResponse;
import com.uts.biblioteca.dto.response.UserRatingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/** Interfaz para servicios del catálogo de libros */
public interface BookService {

    /** Obtiene todos los libros con paginación */
    Page<BookResponse> getAllBooks(Pageable pageable);

    /** Obtiene solo libros disponibles */
    Page<BookResponse> getAvailableBooks(Pageable pageable);

    /** Busca libros por término en título, autor o categoría */
    Page<BookResponse> searchBooks(String searchTerm, Pageable pageable);

    /** Filtra libros por categoría */
    Page<BookResponse> getBooksByCategory(String category, Pageable pageable);

    /** Filtra libros por autor */
    Page<BookResponse> getBooksByAuthor(String author, Pageable pageable);

    /** Obtiene un libro por su ID */
    BookResponse getBookById(String id);

    /** Crea un nuevo libro */
    BookResponse createBook(CreateBookRequest request, String userId, String userName);

    /** Actualiza un libro existente */
    BookResponse updateBook(String id, UpdateBookRequest request);

    /** Elimina un libro */
    void deleteBook(String id);

    /** Califica un libro (1-5 estrellas) */
    BookResponse rateBook(String bookId, String userId, RatingRequest request);

    /** Obtiene la calificación del usuario para un libro */
    UserRatingResponse getUserRating(String bookId, String userId);

    /** Obtiene los libros más populares */
    List<BookResponse> getPopularBooks();

    /** Obtiene los libros mejor calificados */
    List<BookResponse> getTopRatedBooks();
}
