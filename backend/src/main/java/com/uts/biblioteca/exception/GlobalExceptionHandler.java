package com.uts.biblioteca.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

/** Manejador centralizado de excepciones con sanitización de errores */
@SuppressWarnings("unused")
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /** Maneja errores de rate limiting (429) */
    @ExceptionHandler(RateLimitException.class)
    public ResponseEntity<ApiError> handleRateLimit(RateLimitException ex) {
        log.warn("Rate limit exceeded: {}", ex.getMessage());
        
        ApiError apiError = ApiError.builder()
                .status(HttpStatus.TOO_MANY_REQUESTS.value())
                .error("Too Many Requests")
                .message(ex.getMessage())
                .retryAfter(ex.getRetryAfterSeconds())
                .timestamp(Instant.now())
                .build();
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Retry-After", String.valueOf(ex.getRetryAfterSeconds()));

        return new ResponseEntity<>(apiError, headers, HttpStatus.TOO_MANY_REQUESTS);
    }

    /** Maneja errores de validación de @Valid - Devuelve errores específicos por campo */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fieldError -> fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage() : "Valor inválido",
                        (existing, replacement) -> existing
                ));

        String firstError = fieldErrors.values().stream().findFirst().orElse("Error de validación");
        String errorMessage = fieldErrors.size() == 1 
                ? firstError 
                : "Hay errores en el formulario. Revisa los campos marcados.";

        log.warn("Validation error: {}", fieldErrors);
        
        ApiError apiError = ApiError.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Error")
                .message(errorMessage)
                .fieldErrors(fieldErrors)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.badRequest().body(apiError);
    }

    /** Maneja ResourceNotFoundException (404) */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        
        ApiError apiError = ApiError.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error("Not Found")
                .message("Recurso no encontrado")
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError);
    }

    /** Maneja BadRequestException (400) */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> handleBadRequest(BadRequestException ex) {
        log.warn("Bad request: {}", ex.getMessage());
        
        ApiError apiError = ApiError.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Bad Request")
                .message(ex.getMessage())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.badRequest().body(apiError);
    }

    /** Maneja credenciales inválidas (401) - No revela si es email o contraseña */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex) {
        log.warn("Failed login attempt detected");
        
        ApiError apiError = ApiError.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Unauthorized")
                .message("Correo o contraseña incorrectos")
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiError);
    }

    /** Maneja errores genéricos (500) - No expone detalles internos */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex) {
        log.error("Unexpected error occurred: {}", ex.getClass().getSimpleName(), ex);
        
        ApiError apiError = ApiError.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message("Ha ocurrido un error inesperado. Por favor intenta más tarde.")
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiError);
    }

    /** DTO para respuestas de error estructuradas */
    public static class ApiError {
        private int status;
        private String error;
        private String message;
        private Map<String, String> fieldErrors;
        private Integer retryAfter;
        private Instant timestamp;
        
        public ApiError() {}
        
        public ApiError(int status, String error, String message, Instant timestamp) {
            this.status = status;
            this.error = error;
            this.message = message;
            this.timestamp = timestamp;
        }
        
        public int getStatus() { return status; }
        public void setStatus(int status) { this.status = status; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Map<String, String> getFieldErrors() { return fieldErrors; }
        public void setFieldErrors(Map<String, String> fieldErrors) { this.fieldErrors = fieldErrors; }
        public Integer getRetryAfter() { return retryAfter; }
        public void setRetryAfter(Integer retryAfter) { this.retryAfter = retryAfter; }
        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
        
        public static Builder builder() { return new Builder(); }
        
        public static class Builder {
            private int status;
            private String error;
            private String message;
            private Map<String, String> fieldErrors;
            private Integer retryAfter;
            private Instant timestamp;
            
            public Builder status(int status) { this.status = status; return this; }
            public Builder error(String error) { this.error = error; return this; }
            public Builder message(String message) { this.message = message; return this; }
            public Builder fieldErrors(Map<String, String> fieldErrors) { this.fieldErrors = fieldErrors; return this; }
            public Builder retryAfter(Integer retryAfter) { this.retryAfter = retryAfter; return this; }
            public Builder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }
            public ApiError build() {
                ApiError apiError = new ApiError(status, error, message, timestamp);
                apiError.setFieldErrors(fieldErrors);
                apiError.setRetryAfter(retryAfter);
                return apiError;
            }
        }
    }
}
