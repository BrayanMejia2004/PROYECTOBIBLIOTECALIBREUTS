package com.uts.biblioteca.service.impl;

import com.uts.biblioteca.dto.request.CreateBookRequest;
import com.uts.biblioteca.dto.request.RatingRequest;
import com.uts.biblioteca.dto.request.UpdateBookRequest;
import com.uts.biblioteca.dto.response.BookResponse;
import com.uts.biblioteca.dto.response.UserRatingResponse;
import com.uts.biblioteca.exception.ResourceNotFoundException;
import com.uts.biblioteca.model.entity.Book;
import com.uts.biblioteca.model.entity.Rating;
import com.uts.biblioteca.repository.BookRepository;
import com.uts.biblioteca.repository.RatingRepository;
import com.uts.biblioteca.service.interfaces.BookService;
import com.uts.biblioteca.service.interfaces.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/** Implementación de servicios del catálogo de libros */
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final RatingRepository ratingRepository;
    private final LoanService loanService;

    @SuppressWarnings("null")
    @Override
    @Cacheable(value = "books", key = "#pageable.pageNumber")
    public Page<BookResponse> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Cacheable(value = "books-available", key = "#pageable.pageNumber")
    public Page<BookResponse> getAvailableBooks(Pageable pageable) {
        return bookRepository.findByAvailability(true, pageable).map(this::toResponse);
    }

    @Override
    @Cacheable(value = "books-search", key = "#searchTerm + '-' + #pageable.pageNumber")
    public Page<BookResponse> searchBooks(String searchTerm, Pageable pageable) {
        return bookRepository.search(searchTerm, pageable).map(this::toResponse);
    }

    @Override
    @Cacheable(value = "books-category", key = "#category + '-' + #pageable.pageNumber")
    public Page<BookResponse> getBooksByCategory(String category, Pageable pageable) {
        return bookRepository.findByCategory(category, pageable).map(this::toResponse);
    }

    @Override
    @Cacheable(value = "books-author", key = "#author + '-' + #pageable.pageNumber")
    public Page<BookResponse> getBooksByAuthor(String author, Pageable pageable) {
        return bookRepository.findByAuthorContainingIgnoreCase(author, pageable).map(this::toResponse);
    }

    @Override
    @Cacheable(value = "book-detail", key = "#id")
    public BookResponse getBookById(String id) {
        @SuppressWarnings("null")
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado"));
        return toResponse(book);
    }

    @SuppressWarnings("null")
    @Override
    @Transactional
    @CacheEvict(value = {"books", "books-available", "books-category", "books-author", "book-detail"}, allEntries = true)
    public BookResponse createBook(CreateBookRequest request, String userId, String userName) {
        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .summary(request.getSummary())
                .publicationDate(request.getPublicationDate())
                .pages(request.getPages())
                .language(request.getLanguage())
                .category(request.getCategory())
                .availability(true)
                .rating(0.0)
                .ratingCount(0)
                .coverImage(request.getCoverImage())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        book = bookRepository.save(book);
        
        if (userId != null && userName != null) {
            loanService.createBookNotification(userId, userName, book.getTitle());
        }
        
        return toResponse(book);
    }

    @SuppressWarnings("null")
    @Override
    @Transactional
    @CacheEvict(value = {"books", "books-available", "books-category", "books-author", "book-detail"}, allEntries = true)
    public BookResponse updateBook(String id, UpdateBookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado"));

        if (request.getTitle() != null) book.setTitle(request.getTitle());
        if (request.getAuthor() != null) book.setAuthor(request.getAuthor());
        if (request.getSummary() != null) book.setSummary(request.getSummary());
        if (request.getPublicationDate() != null) book.setPublicationDate(request.getPublicationDate());
        if (request.getPages() != null) book.setPages(request.getPages());
        if (request.getLanguage() != null) book.setLanguage(request.getLanguage());
        if (request.getCategory() != null) book.setCategory(request.getCategory());
        if (request.getAvailability() != null) book.setAvailability(request.getAvailability());
        
        book.setUpdatedAt(Instant.now());
        book = bookRepository.save(book);
        
        return toResponse(book);
    }

    @SuppressWarnings("null")
    @Override
    @Transactional
    @CacheEvict(value = {"books", "books-available", "books-category", "books-author", "book-detail"}, allEntries = true)
    public void deleteBook(String id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Libro no encontrado");
        }
        bookRepository.deleteById(id);
    }

    @SuppressWarnings("null")
    @Override
    @Transactional
    public BookResponse rateBook(String bookId, String userId, RatingRequest request) {
        // Busca libro
        @SuppressWarnings("null")
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado"));

        // Busca si ya existe calificación
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndBookId(userId, bookId);
        
        if (existingRating.isPresent()) {
            // Actualiza la calificación existente
            Rating rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
            ratingRepository.save(rating);
        } else {
            // Crea nueva calificación
            Rating rating = Rating.builder()
                    .userId(userId)
                    .bookId(bookId)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .createdAt(Instant.now())
                    .build();
            ratingRepository.save(rating);
        }

        // Calcula nuevo promedio
        List<Rating> ratings = ratingRepository.findByBookId(bookId);
        Double averageRating = ratings.stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);

        // Actualiza libro
        book.setRating(averageRating);
        book.setRatingCount(ratings.size());
        book.setUpdatedAt(Instant.now());
        bookRepository.save(book);

        return toResponse(book);
    }

    @Override
    public UserRatingResponse getUserRating(String bookId, String userId) {
        Optional<Rating> rating = ratingRepository.findByUserIdAndBookId(userId, bookId);
        
        if (rating.isPresent()) {
            return UserRatingResponse.builder()
                    .rating(rating.get().getRating())
                    .comment(rating.get().getComment())
                    .build();
        }
        
        return null;
    }

    @Override
    public List<BookResponse> getPopularBooks() {
        return bookRepository.findTop10ByOrderByRatingCountDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookResponse> getTopRatedBooks() {
        return bookRepository.findTop10ByOrderByRatingDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /** Convierte entidad Book a BookResponse */
    private BookResponse toResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .summary(book.getSummary())
                .publicationDate(book.getPublicationDate())
                .pages(book.getPages())
                .language(book.getLanguage())
                .category(book.getCategory())
                .rating(book.getRating())
                .ratingCount(book.getRatingCount())
                .availability(book.getAvailability())
                .coverImage(book.getCoverImage())
                .build();
    }
}
