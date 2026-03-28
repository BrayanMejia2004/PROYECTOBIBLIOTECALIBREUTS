package com.uts.biblioteca.model.entity;

import com.uts.biblioteca.model.enums.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/** Entidad de documento MongoDB para préstamos */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "loans")
public class Loan {

    @Id
    private String id;

    private String userId;

    private String bookId;

    private Instant loanDate;

    private Instant dueDate;

    private Instant returnDate;

    private LoanStatus status;

    @Builder.Default
    private boolean notificationRead = false;
}
