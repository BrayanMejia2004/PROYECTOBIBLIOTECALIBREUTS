package com.uts.biblioteca.service.interfaces;

import com.uts.biblioteca.dto.request.CreateLoanRequest;
import com.uts.biblioteca.dto.response.LoanResponse;
import com.uts.biblioteca.dto.response.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.jspecify.annotations.NonNull;

import java.util.List;

public interface LoanService {

    LoanResponse createLoan(@NonNull String userId, @NonNull CreateLoanRequest request);

    Page<LoanResponse> getUserLoans(@NonNull String userId, @NonNull Pageable pageable);

    Page<LoanResponse> getAllLoans(@NonNull Pageable pageable);

    LoanResponse getLoanById(@NonNull String id);

    LoanResponse returnLoan(@NonNull String loanId, @NonNull String userId);

    boolean hasActiveLoans(@NonNull String userId);

    long countActiveLoans(@NonNull String userId);

    List<NotificationResponse> getNotifications(@NonNull String userId);

    void markNotificationAsRead(@NonNull String loanId, @NonNull String userId);

    void markAllNotificationsAsRead(@NonNull String userId);

    List<NotificationResponse> getAdminNotifications();

    void markAdminNotificationAsRead(@NonNull String notificationId);

    void markAllAdminNotificationsAsRead();

    void createBookNotification(@NonNull String userId, @NonNull String userName, @NonNull String bookTitle);
}
