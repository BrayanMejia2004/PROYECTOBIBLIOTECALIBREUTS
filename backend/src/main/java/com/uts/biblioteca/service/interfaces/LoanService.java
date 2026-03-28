package com.uts.biblioteca.service.interfaces;

import com.uts.biblioteca.dto.request.CreateLoanRequest;
import com.uts.biblioteca.dto.response.LoanResponse;
import com.uts.biblioteca.dto.response.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LoanService {

    LoanResponse createLoan(String userId, CreateLoanRequest request);

    Page<LoanResponse> getUserLoans(String userId, Pageable pageable);

    Page<LoanResponse> getAllLoans(Pageable pageable);

    LoanResponse getLoanById(String id);

    LoanResponse returnLoan(String loanId, String userId);

    boolean hasActiveLoans(String userId);

    long countActiveLoans(String userId);

    List<NotificationResponse> getNotifications(String userId);

    void markNotificationAsRead(String loanId, String userId);

    void markAllNotificationsAsRead(String userId);

    List<NotificationResponse> getAdminNotifications();

    void markAdminNotificationAsRead(String notificationId);

    void markAllAdminNotificationsAsRead();

    void createBookNotification(String userId, String userName, String bookTitle);
}
