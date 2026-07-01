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
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/** Implementación de servicios del catálogo de libros */
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final RatingRepository ratingRepository;
    private final LoanService loanService;

    
    @Override
    public Page<BookResponse> getAllBooks(@NonNull Pageable pageable) {
        return bookRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public Page<BookResponse> getAvailableBooks(@NonNull Pageable pageable) {
        return bookRepository.findByAvailability(true, pageable).map(this::toResponse);
    }

    @Override
    public Page<BookResponse> searchBooks(String searchTerm, @NonNull Pageable pageable) {
        return bookRepository.search(searchTerm, pageable).map(this::toResponse);
    }

    @Override
    public Page<BookResponse> getBooksByCategory(String category, @NonNull Pageable pageable) {
        return bookRepository.findByCategory(category, pageable).map(this::toResponse);
    }

    @Override
    public Page<BookResponse> getBooksByAuthor(String author, @NonNull Pageable pageable) {
        return bookRepository.findByAuthorContainingIgnoreCase(author, pageable).map(this::toResponse);
    }

    @Override
    public BookResponse getBookById(@NonNull String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado"));
        return toResponse(book);
    }

    
    @Override
    @Transactional
    @CacheEvict(value = {"popularBooks", "topRatedBooks", "adminStats"}, allEntries = true)
    public BookResponse createBook(@NonNull CreateBookRequest request, String userId, String userName) {
        Book book = Objects.requireNonNull(Book.builder()
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
                .build());

        book = bookRepository.save(book);
        
        if (userId != null && userName != null) {
            loanService.createBookNotification(Objects.requireNonNull(userId), Objects.requireNonNull(userName), Objects.requireNonNull(book.getTitle()));
        }
        
        return toResponse(book);
    }

    
    @Override
    @Transactional
    @CacheEvict(value = {"popularBooks", "topRatedBooks", "adminStats"}, allEntries = true)
    public BookResponse updateBook(@NonNull String id, @NonNull UpdateBookRequest request) {
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

    
    @Override
    @Transactional
    @CacheEvict(value = {"popularBooks", "topRatedBooks", "adminStats"}, allEntries = true)
    public void deleteBook(@NonNull String id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Libro no encontrado");
        }
        bookRepository.deleteById(id);
    }

    
    @Override
    @Transactional
    @CacheEvict(value = {"popularBooks", "topRatedBooks", "adminStats"}, allEntries = true)
    public BookResponse rateBook(@NonNull String bookId, String userId, @NonNull RatingRequest request) {
        // Busca libro
        
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
            Rating rating = Objects.requireNonNull(Rating.builder()
                    .userId(userId)
                    .bookId(bookId)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .createdAt(Instant.now())
                    .build());
            ratingRepository.save(rating);
        }

        // Calcula nuevo promedio directamente en MongoDB
        Double averageRating = ratingRepository.findAverageRatingByBookId(bookId);
        long ratingCount = ratingRepository.countByBookId(bookId);

        book.setRating(averageRating != null ? averageRating : 0.0);
        book.setRatingCount((int) ratingCount);
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
    @Cacheable("popularBooks")
    public List<BookResponse> getPopularBooks() {
        return bookRepository.findByRatingCountGreaterThanOrderByRatingCountDesc(0)
                .stream().limit(10)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable("topRatedBooks")
    public List<BookResponse> getTopRatedBooks() {
        return bookRepository.findByRatingGreaterThan(4.0).stream()
                .limit(10)
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
