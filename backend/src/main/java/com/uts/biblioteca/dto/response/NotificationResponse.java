package com.uts.biblioteca.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private String id;

    private String type;

    private String message;

    private String loanId;

    private String bookTitle;

    private String userName;

    private Instant dueDate;

    private boolean read;

    private Instant createdAt;
}
