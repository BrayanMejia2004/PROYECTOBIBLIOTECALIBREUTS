package com.uts.biblioteca.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.uts.biblioteca.model.enums.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/** DTO para respuesta de préstamo */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanResponse {

    private String id;

    private String userId;

    private UserResponse user;

    private String bookId;

    private BookResponse book;

    private String bookTitle;

    private Instant loanDate;

    private Instant dueDate;

    private Instant returnDate;

    private LoanStatus status;
}
