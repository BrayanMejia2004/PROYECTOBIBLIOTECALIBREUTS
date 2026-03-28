package com.uts.biblioteca.repository;

import com.uts.biblioteca.model.entity.Loan;
import com.uts.biblioteca.model.enums.LoanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/** Repositorio para acceso a documentos de préstamos en MongoDB */
@Repository
public interface LoanRepository extends MongoRepository<Loan, String> {

    /** Obtiene préstamos de un usuario */
    Page<Loan> findByUserId(String userId, Pageable pageable);

    /** Obtiene préstamos por usuario y estado */
    List<Loan> findByUserIdAndStatus(String userId, LoanStatus status);

    /** Busca préstamo activo de un libro por usuario */
    Optional<Loan> findByBookIdAndUserIdAndStatus(String bookId, String userId, LoanStatus status);

    /** Cuenta préstamos activos de un usuario */
    long countByUserIdAndStatus(String userId, LoanStatus status);

    /** Busca préstamos vencidos */
    List<Loan> findByStatusAndDueDateBefore(LoanStatus status, java.time.Instant dueDate);

    /** Cuenta todos los préstamos por estado */
    long countByStatus(LoanStatus status);

    /** Busca préstamos que vencen en los próximos X días */
    List<Loan> findByUserIdAndStatusAndDueDateBetween(
        String userId, LoanStatus status, java.time.Instant start, java.time.Instant end);
}
