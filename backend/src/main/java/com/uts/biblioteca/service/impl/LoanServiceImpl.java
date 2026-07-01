package com.uts.biblioteca.service.impl;

import com.uts.biblioteca.dto.request.CreateLoanRequest;
import com.uts.biblioteca.dto.response.BookResponse;
import com.uts.biblioteca.dto.response.LoanResponse;
import com.uts.biblioteca.dto.response.NotificationResponse;
import com.uts.biblioteca.dto.response.UserResponse;
import com.uts.biblioteca.exception.BadRequestException;
import com.uts.biblioteca.exception.ResourceNotFoundException;
import com.uts.biblioteca.model.entity.Book;
import com.uts.biblioteca.model.entity.Loan;
import com.uts.biblioteca.model.entity.User;
import com.uts.biblioteca.model.enums.LoanStatus;
import com.uts.biblioteca.repository.BookRepository;
import com.uts.biblioteca.repository.LoanRepository;
import com.uts.biblioteca.repository.UserRepository;
import com.uts.biblioteca.service.interfaces.LoanService;
import com.uts.biblioteca.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Implementación de servicios de préstamos */
@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private static final int MAX_LOANS_PER_USER = 2;
    private static final int LOAN_DAYS = 14;

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    @Transactional
    @CacheEvict(value = "adminStats", allEntries = true)
    public LoanResponse createLoan(@NonNull String userId, @NonNull CreateLoanRequest request) {
        // Valida que el perfil esté completo
        if (!userService.isProfileComplete(userId)) {
            throw new BadRequestException("Debes completar tu perfil (documento, nombre, semestre, teléfono) para solicitar préstamos");
        }

        // Valida límite de préstamos
        long activeLoans = loanRepository.countByUserIdAndStatus(userId, LoanStatus.ACTIVE);
        if (activeLoans >= MAX_LOANS_PER_USER) {
            throw new BadRequestException("Has alcanzado el límite máximo de préstamos (" + MAX_LOANS_PER_USER + ")");
        }

        // Valida que no tenga el libro
        if (loanRepository.findByBookIdAndUserIdAndStatus(request.getBookId(), userId, LoanStatus.ACTIVE).isPresent()) {
            throw new BadRequestException("Ya tienes este libro en préstamo");
        }

        // Busca libro
        Book book = Objects.requireNonNull(bookRepository.findById(Objects.requireNonNull(request.getBookId()))
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado")));

        // Valida disponibilidad
        if (!book.getAvailability()) {
            throw new BadRequestException("El libro no está disponible");
        }

        // Crea préstamo con fecha límite de 14 días
        Instant now = Instant.now();
        Instant dueDate = now.plus(LOAN_DAYS, ChronoUnit.DAYS);

        Loan loan = Objects.requireNonNull(Loan.builder()
                .userId(userId)
                .bookId(book.getId())
                .loanDate(now)
                .dueDate(dueDate)
                .status(LoanStatus.ACTIVE)
                .build());

        loan = loanRepository.save(loan);

        // Marca libro como no disponible
        book.setAvailability(false);
        bookRepository.save(book);

        return toResponse(loan, book);
    }

    @Override
    public Page<LoanResponse> getUserLoans(@NonNull String userId, @NonNull Pageable pageable) {
        Page<Loan> loans = loanRepository.findByUserId(userId, pageable);
        Map<String, Book> bookMap = fetchBooksByIds(loans.getContent());
        return loans.map(loan -> toResponse(loan, bookMap.get(loan.getBookId())));
    }

    @Override
    public Page<LoanResponse> getAllLoans(@NonNull Pageable pageable) {
        Page<Loan> loans = loanRepository.findAll(pageable);
        Map<String, Book> bookMap = fetchBooksByIds(loans.getContent());
        Map<String, User> userMap = fetchUsersByIds(loans.getContent());
        return loans.map(loan -> toResponse(loan, bookMap.get(loan.getBookId()), userMap.get(loan.getUserId())));
    }

    @Override
    public LoanResponse getLoanById(@NonNull String id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo no encontrado"));

        Book book = bookRepository.findById(loan.getBookId()).orElse(null);
        User user = userRepository.findById(loan.getUserId()).orElse(null);

        return toResponse(loan, book, user);
    }

    @Override
    @Transactional
    @CacheEvict(value = "adminStats", allEntries = true)
    public LoanResponse returnLoan(@NonNull String loanId, @NonNull String userId) {
        // Busca préstamo
        Loan loan = Objects.requireNonNull(loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo no encontrado")));

        // Valida propiedad
        if (!loan.getUserId().equals(userId)) {
            throw new BadRequestException("No tienes autorización para devolver este préstamo");
        }

        // Valida que no esté ya devuelto
        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new BadRequestException("Este libro ya fue devuelto");
        }

        // Marca como devuelto
        loan.setStatus(LoanStatus.RETURNED);
        loan.setReturnDate(Instant.now());
        loan = loanRepository.save(loan);

        // Marca libro como disponible
        Book book = Objects.requireNonNull(bookRepository.findById(Objects.requireNonNull(loan.getBookId()))
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado")));
        
        book.setAvailability(true);
        bookRepository.save(book);

        return toResponse(loan, book);
    }

    @Override
    public boolean hasActiveLoans(@NonNull String userId) {
        return loanRepository.countByUserIdAndStatus(userId, LoanStatus.ACTIVE) > 0;
    }

    @Override
    public long countActiveLoans(@NonNull String userId) {
        return loanRepository.countByUserIdAndStatus(userId, LoanStatus.ACTIVE);
    }

    private static final int DAYS_BEFORE_NOTIFICATION = 3;

    @Override
    public List<NotificationResponse> getNotifications(@NonNull String userId) {
        List<NotificationResponse> notifications = new ArrayList<>();
        Instant now = Instant.now();
        Instant threeDaysFromNow = now.plus(DAYS_BEFORE_NOTIFICATION, ChronoUnit.DAYS);

        List<Loan> loans = new ArrayList<>();
        loans.addAll(loanRepository.findByUserIdAndStatus(userId, LoanStatus.OVERDUE));
        loans.addAll(loanRepository.findByUserIdAndStatusAndDueDateBetween(
                userId, LoanStatus.ACTIVE, now, threeDaysFromNow));

        Map<String, Book> bookMap = fetchBooksByIds(loans);

        for (Loan loan : loans) {
            Book book = bookMap.get(loan.getBookId());
            boolean isOverdue = loan.getStatus() == LoanStatus.OVERDUE;
            String bookTitle = book != null ? book.getTitle() : "Unknown";
            String type = isOverdue ? "OVERDUE" : "DUE_SOON";
            String message = isOverdue
                    ? "Tu préstamo del libro \"" + bookTitle + "\" está vencido"
                    : "Tu préstamo del libro \"" + bookTitle + "\" vence en "
                    + ChronoUnit.DAYS.between(now, loan.getDueDate()) + " día(s)";
            notifications.add(NotificationResponse.builder()
                    .id(loan.getId())
                    .type(type)
                    .message(message)
                    .loanId(loan.getId())
                    .bookTitle(book != null ? book.getTitle() : null)
                    .dueDate(loan.getDueDate())
                    .read(loan.isNotificationRead())
                    .createdAt(isOverdue ? loan.getDueDate() : now)
                    .build());
        }

        return notifications;
    }

    @Override
    @Transactional
    public void markNotificationAsRead(@NonNull String loanId, @NonNull String userId) {
        Loan loan = loanRepository.findById(loanId).orElse(null);
        if (loan != null && loan.getUserId().equals(userId)) {
            loan.setNotificationRead(true);
            loanRepository.save(loan);
        }
    }

    @Override
    @Transactional
    public void markAllNotificationsAsRead(@NonNull String userId) {
        Instant now = Instant.now();
        Instant threeDaysFromNow = now.plus(DAYS_BEFORE_NOTIFICATION, ChronoUnit.DAYS);

        List<Loan> loans = new ArrayList<>();
        loans.addAll(loanRepository.findByUserIdAndStatus(userId, LoanStatus.OVERDUE));
        loans.addAll(loanRepository.findByUserIdAndStatusAndDueDateBetween(
                userId, LoanStatus.ACTIVE, now, threeDaysFromNow));

        loans.forEach(loan -> loan.setNotificationRead(true));
        loanRepository.saveAll(loans);
    }

    /** Convierte entidad Loan a LoanResponse con objeto Book y User */
    private LoanResponse toResponse(Loan loan, Book book, User user) {
        BookResponse bookResponse = null;
        if (book != null) {
            bookResponse = BookResponse.builder()
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
        
        UserResponse userResponse = null;
        if (user != null) {
            userResponse = UserResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .semester(user.getSemester())
                    .phone(user.getPhone())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .createdAt(user.getCreatedAt())
                    .build();
        }
        
        return LoanResponse.builder()
                .id(loan.getId())
                .userId(loan.getUserId())
                .user(userResponse)
                .bookId(loan.getBookId())
                .book(bookResponse)
                .bookTitle(book != null ? book.getTitle() : null)
                .loanDate(loan.getLoanDate())
                .dueDate(loan.getDueDate())
                .returnDate(loan.getReturnDate())
                .status(loan.getStatus())
                .build();
    }

    /** Convierte entidad Loan a LoanResponse con objeto Book */
    private LoanResponse toResponse(Loan loan, Book book) {
        return toResponse(loan, book, null);
    }

    // Admin notifications storage (in-memory)
    private static final List<NotificationResponse> adminNotifications = new CopyOnWriteArrayList<>();

    @Override
    public List<NotificationResponse> getAdminNotifications() {
        return new ArrayList<>(adminNotifications);
    }

    @Override
    @Transactional
    public void markAdminNotificationAsRead(@NonNull String notificationId) {
        for (NotificationResponse notification : adminNotifications) {
            if (notification.getId().equals(notificationId)) {
                notification.setRead(true);
                break;
            }
        }
    }

    @Override
    @Transactional
    public void markAllAdminNotificationsAsRead() {
        for (NotificationResponse notification : adminNotifications) {
            notification.setRead(true);
        }
    }

    @Override
    @Transactional
    public void createBookNotification(@NonNull String userId, @NonNull String userName, @NonNull String bookTitle) {
        NotificationResponse notification = NotificationResponse.builder()
                .id(java.util.UUID.randomUUID().toString())
                .type("BOOK_ADDED")
                .message(userName + " agregó: " + bookTitle)
                .userName(userName)
                .bookTitle(bookTitle)
                .read(false)
                .createdAt(Instant.now())
                .build();
        adminNotifications.add(0, notification);
    }

    private Map<String, Book> fetchBooksByIds(List<Loan> loans) {
        List<String> bookIds = loans.stream()
                .map(loan -> loan.getBookId())
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
        if (bookIds.isEmpty()) return Collections.emptyMap();
        return bookRepository.findAllById(bookIds).stream()
                .collect(Collectors.toMap(book -> book.getId(), Function.identity()));
    }

    private Map<String, User> fetchUsersByIds(List<Loan> loans) {
        List<String> userIds = loans.stream()
                .map(loan -> loan.getUserId())
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
        if (userIds.isEmpty()) return Collections.emptyMap();
        return userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(user -> user.getId(), Function.identity()));
    }
}
