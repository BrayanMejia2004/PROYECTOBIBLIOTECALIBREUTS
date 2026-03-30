package com.uts.biblioteca.security;

import com.uts.biblioteca.exception.RateLimitException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/** Filtro de rate limiting para prevenir ataques de fuerza bruta */
@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Map<String, RateLimitEntry>> requestCounts = new ConcurrentHashMap<>();
    
    @Value("${rate-limit.auth.max-attempts:5}")
    private int authMaxAttempts;
    
    @Value("${rate-limit.auth.window-minutes:15}")
    private int authWindowMinutes;
    
    @Value("${rate-limit.register.max-attempts:3}")
    private int registerMaxAttempts;
    
    @Value("${rate-limit.register.window-minutes:60}")
    private int registerWindowMinutes;
    
    @Value("${rate-limit.general.max-requests:100}")
    private int generalMaxRequests;
    
    @Value("${rate-limit.general.window-minutes:1}")
    private int generalWindowMinutes;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        
        String clientIp = getClientIp(request);
        String path = request.getRequestURI();
        
        try {
            if (isAuthEndpoint(path)) {
                if (!checkRateLimit(clientIp, "auth", authMaxAttempts, authWindowMinutes)) {
                    throw RateLimitException.forAuth(
                            "Límite de intentos de inicio de sesión agotado. Por favor, espera " + authWindowMinutes + " minutos antes de intentar nuevamente.",
                            authWindowMinutes * 60
                    );
                }
            } else if (isRegisterEndpoint(path)) {
                if (!checkRateLimit(clientIp, "register", registerMaxAttempts, registerWindowMinutes)) {
                    throw RateLimitException.forRegister(
                            "Límite de intentos de registro agotado. Por favor, espera " + registerWindowMinutes + " minutos antes de intentar nuevamente.",
                            registerWindowMinutes * 60
                    );
                }
            } else {
                if (!checkRateLimit(clientIp, "general", generalMaxRequests, generalWindowMinutes)) {
                    throw RateLimitException.forAuth(
                            "Demasiadas solicitudes. Por favor, espera un momento antes de continuar.",
                            generalWindowMinutes * 60
                    );
                }
            }
        } catch (RateLimitException e) {
            log.warn("Rate limit exceeded for IP {}: {}", clientIp, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error in rate limit filter: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
    
    private boolean checkRateLimit(String clientIp, String endpoint, int maxRequests, int windowMinutes) {
        long now = System.currentTimeMillis();
        long windowMs = windowMinutes * 60 * 1000L;
        
        requestCounts.computeIfAbsent(clientIp, k -> new ConcurrentHashMap<>());
        Map<String, RateLimitEntry> endpointCounts = requestCounts.get(clientIp);
        
        RateLimitEntry entry = endpointCounts.computeIfAbsent(endpoint, k -> new RateLimitEntry());
        
        synchronized (entry) {
            if (now - entry.windowStart > windowMs) {
                entry.count.set(1);
                entry.windowStart = now;
                return true;
            }
            
            if (entry.count.incrementAndGet() > maxRequests) {
                return false;
            }
            return true;
        }
    }
    
    private boolean isAuthEndpoint(String path) {
        return path.contains("/api/auth/login");
    }
    
    private boolean isRegisterEndpoint(String path) {
        return path.contains("/api/auth/register");
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
    
    private static class RateLimitEntry {
        AtomicInteger count = new AtomicInteger(0);
        long windowStart = System.currentTimeMillis();
    }
}
