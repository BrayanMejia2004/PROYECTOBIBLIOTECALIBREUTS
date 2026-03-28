package com.uts.biblioteca.exception;

/** Excepción para errores de rate limiting (429) */
public class RateLimitException extends RuntimeException {
    
    private final int retryAfterSeconds;
    
    public RateLimitException(String message, int retryAfterSeconds) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds;
    }
    
    public int getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
    
    public static RateLimitException forAuth(String message, int retryAfterSeconds) {
        return new RateLimitException(message, retryAfterSeconds);
    }
    
    public static RateLimitException forRegister(String message, int retryAfterSeconds) {
        return new RateLimitException(message, retryAfterSeconds);
    }
}
