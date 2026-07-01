package com.uts.biblioteca.model.entity;

import com.uts.biblioteca.model.enums.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/** Entidad de documento MongoDB para préstamos */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "loans")
@CompoundIndexes({
    @CompoundIndex(name = "idx_user_status", def = "{'userId': 1, 'status': 1}"),
    @CompoundIndex(name = "idx_book_user_status", def = "{'bookId': 1, 'userId': 1, 'status': 1}"),
    @CompoundIndex(name = "idx_status_dueDate", def = "{'status': 1, 'dueDate': 1}"),
    @CompoundIndex(name = "idx_user_status_dueDate", def = "{'userId': 1, 'status': 1, 'dueDate': 1}")
})
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
