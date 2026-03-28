package com.uts.biblioteca.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO para estadísticas del dashboard */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalBooks;

    private long totalUsers;

    private long activeLoans;

    private long overdueLoans;

    private long returnedLoans;
}
