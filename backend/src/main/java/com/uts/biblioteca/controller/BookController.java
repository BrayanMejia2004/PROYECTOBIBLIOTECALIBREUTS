package com.uts.biblioteca.controller;

import com.uts.biblioteca.dto.request.CreateBookRequest;
import com.uts.biblioteca.dto.request.RatingRequest;
import com.uts.biblioteca.dto.request.UpdateBookRequest;
import com.uts.biblioteca.dto.response.BookResponse;
import com.uts.biblioteca.dto.response.UserRatingResponse;
import com.uts.biblioteca.model.entity.User;
import com.uts.biblioteca.service.interfaces.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para gestión del catálogo de libros.
 * Endpoints: /api/books/*
 */
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    /** Obtiene todos los libros con paginación */
    @GetMapping
    public ResponseEntity<Page<BookResponse>> getAllBooks(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }

    /** Obtiene solo libros disponibles */
    @GetMapping("/available")
    public ResponseEntity<Page<BookResponse>> getAvailableBooks(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.getAvailableBooks(pageable));
    }

    /** Busca libros por título, autor o categoría */
    @GetMapping("/search")
    public ResponseEntity<Page<BookResponse>> searchBooks(
            @RequestParam String q,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.searchBooks(q, pageable));
    }

    /** Filtra libros por categoría */
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<BookResponse>> getBooksByCategory(
            @PathVariable String category,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.getBooksByCategory(category, pageable));
    }

    /** Filtra libros por autor */
    @GetMapping("/author/{author}")
    public ResponseEntity<Page<BookResponse>> getBooksByAuthor(
            @PathVariable String author,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.getBooksByAuthor(author, pageable));
    }

    /** Obtiene los libros más populares por cantidad de calificaciones */
    @GetMapping("/popular")
    public ResponseEntity<List<BookResponse>> getPopularBooks() {
        return ResponseEntity.ok(bookService.getPopularBooks());
    }

    /** Obtiene los libros mejor calificados */
    @GetMapping("/top-rated")
    public ResponseEntity<List<BookResponse>> getTopRatedBooks() {
        return ResponseEntity.ok(bookService.getTopRatedBooks());
    }

    /** Obtiene detalle de un libro por ID */
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable String id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    /** Crea un nuevo libro (usuario autenticado) */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookResponse> createBook(
            @Valid @RequestBody CreateBookRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookService.createBook(request, user.getId(), user.getName()));
    }

    /** Actualiza un libro (solo admin) */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookResponse> updateBook(
            @PathVariable String id,
            @RequestBody UpdateBookRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }

    /** Elimina un libro (solo admin) */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    /** Califica un libro */
    @PostMapping("/{id}/rate")
    public ResponseEntity<BookResponse> rateBook(
            @PathVariable String id,
            @Valid @RequestBody RatingRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookService.rateBook(id, user.getId(), request));
    }

    /** Obtiene la calificación del usuario para un libro */
    @GetMapping("/{id}/user-rating")
    public ResponseEntity<UserRatingResponse> getUserRating(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookService.getUserRating(id, user.getId()));
    }
}
