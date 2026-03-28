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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

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

    @SuppressWarnings("null")
    @Override
    @Transactional
    public LoanResponse createLoan(String userId, CreateLoanRequest request) {
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
        @SuppressWarnings("null")
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado"));

        // Valida disponibilidad
        if (!book.getAvailability()) {
            throw new BadRequestException("El libro no está disponible");
        }

        // Crea préstamo con fecha límite de 14 días
        Instant now = Instant.now();
        Instant dueDate = now.plus(LOAN_DAYS, ChronoUnit.DAYS);

        Loan loan = Loan.builder()
                .userId(userId)
                .bookId(book.getId())
                .loanDate(now)
                .dueDate(dueDate)
                .status(LoanStatus.ACTIVE)
                .build();

        loan = loanRepository.save(loan);

        // Marca libro como no disponible
        book.setAvailability(false);
        bookRepository.save(book);

        return toResponse(loan, book);
    }

    @Override
    public Page<LoanResponse> getUserLoans(String userId, Pageable pageable) {
        return loanRepository.findByUserId(userId, pageable)
                .map(loan -> {
                    @SuppressWarnings("null")
                    Book book = bookRepository.findById(loan.getBookId())
                            .orElse(null);
                    return toResponse(loan, book);
                });
    }

    @SuppressWarnings("null")
    @Override
    public Page<LoanResponse> getAllLoans(Pageable pageable) {
        return loanRepository.findAll(pageable)
                .map(loan -> {
                    @SuppressWarnings("null")
                    Book book = bookRepository.findById(loan.getBookId())
                            .orElse(null);
                    User user = userRepository.findById(loan.getUserId())
                            .orElse(null);
                    return toResponse(loan, book, user);
                });
    }

    @SuppressWarnings("null")
    @Override
    public LoanResponse getLoanById(String id) {
        @SuppressWarnings("null")
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo no encontrado"));
        
        @SuppressWarnings("null")
        Book book = bookRepository.findById(loan.getBookId())
                .orElse(null);
        
        User user = userRepository.findById(loan.getUserId())
                .orElse(null);
        
        return toResponse(loan, book, user);
    }

    @Override
    @Transactional
    public LoanResponse returnLoan(String loanId, String userId) {
        // Busca préstamo
        @SuppressWarnings("null")
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo no encontrado"));

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
        @SuppressWarnings("null")
        Book book = bookRepository.findById(loan.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado"));
        
        book.setAvailability(true);
        bookRepository.save(book);

        return toResponse(loan, book);
    }

    @Override
    public boolean hasActiveLoans(String userId) {
        return loanRepository.countByUserIdAndStatus(userId, LoanStatus.ACTIVE) > 0;
    }

    @Override
    public long countActiveLoans(String userId) {
        return loanRepository.countByUserIdAndStatus(userId, LoanStatus.ACTIVE);
    }

    private static final int DAYS_BEFORE_NOTIFICATION = 3;

    @Override
    public List<NotificationResponse> getNotifications(String userId) {
        List<NotificationResponse> notifications = new ArrayList<>();
        Instant now = Instant.now();
        
        List<Loan> overdueLoans = loanRepository.findByUserIdAndStatus(userId, LoanStatus.OVERDUE);
        for (Loan loan : overdueLoans) {
            @SuppressWarnings("null")
            Book book = bookRepository.findById(loan.getBookId()).orElse(null);
            notifications.add(NotificationResponse.builder()
                    .id(loan.getId())
                    .type("OVERDUE")
                    .message("Tu préstamo del libro \"" + (book != null ? book.getTitle() : "Unknown") + "\" está vencido")
                    .loanId(loan.getId())
                    .bookTitle(book != null ? book.getTitle() : null)
                    .dueDate(loan.getDueDate())
                    .read(loan.isNotificationRead())
                    .createdAt(loan.getDueDate())
                    .build());
        }
        
        Instant threeDaysFromNow = now.plus(DAYS_BEFORE_NOTIFICATION, ChronoUnit.DAYS);
        List<Loan> dueSoonLoans = loanRepository.findByUserIdAndStatusAndDueDateBetween(
                userId, LoanStatus.ACTIVE, now, threeDaysFromNow);
        for (Loan loan : dueSoonLoans) {
            @SuppressWarnings("null")
            Book book = bookRepository.findById(loan.getBookId()).orElse(null);
            long daysUntilDue = ChronoUnit.DAYS.between(now, loan.getDueDate());
            notifications.add(NotificationResponse.builder()
                    .id(loan.getId())
                    .type("DUE_SOON")
                    .message("Tu préstamo del libro \"" + (book != null ? book.getTitle() : "Unknown") + "\" vence en " + daysUntilDue + " día(s)")
                    .loanId(loan.getId())
                    .bookTitle(book != null ? book.getTitle() : null)
                    .dueDate(loan.getDueDate())
                    .read(loan.isNotificationRead())
                    .createdAt(now)
                    .build());
        }
        
        return notifications;
    }

    @Override
    @Transactional
    public void markNotificationAsRead(String loanId, String userId) {
        @SuppressWarnings("null")
        Loan loan = loanRepository.findById(loanId).orElse(null);
        if (loan != null && loan.getUserId().equals(userId)) {
            loan.setNotificationRead(true);
            loanRepository.save(loan);
        }
    }

    @Override
    @Transactional
    public void markAllNotificationsAsRead(String userId) {
        List<Loan> overdueLoans = loanRepository.findByUserIdAndStatus(userId, LoanStatus.OVERDUE);
        for (Loan loan : overdueLoans) {
            loan.setNotificationRead(true);
            loanRepository.save(loan);
        }
        
        Instant now = Instant.now();
        Instant threeDaysFromNow = now.plus(DAYS_BEFORE_NOTIFICATION, ChronoUnit.DAYS);
        List<Loan> dueSoonLoans = loanRepository.findByUserIdAndStatusAndDueDateBetween(
                userId, LoanStatus.ACTIVE, now, threeDaysFromNow);
        for (Loan loan : dueSoonLoans) {
            loan.setNotificationRead(true);
            loanRepository.save(loan);
        }
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
                    .document(user.getDocument())
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

    /** Convierte entidad Loan a LoanResponse (sin objeto Book, solo título) */
    @SuppressWarnings("unused")
    private LoanResponse toResponse(Loan loan, String bookTitle) {
        return LoanResponse.builder()
                .id(loan.getId())
                .userId(loan.getUserId())
                .bookId(loan.getBookId())
                .bookTitle(bookTitle)
                .loanDate(loan.getLoanDate())
                .dueDate(loan.getDueDate())
                .returnDate(loan.getReturnDate())
                .status(loan.getStatus())
                .build();
    }

    // Admin notifications storage (in-memory)
    private static final List<NotificationResponse> adminNotifications = new ArrayList<>();

    @Override
    public List<NotificationResponse> getAdminNotifications() {
        return new ArrayList<>(adminNotifications);
    }

    @Override
    @Transactional
    public void markAdminNotificationAsRead(String notificationId) {
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
    public void createBookNotification(String userId, String userName, String bookTitle) {
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
}
