package com.uts.biblioteca.repository;

import com.uts.biblioteca.model.entity.RefreshToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/** Repositorio para acceso a refresh tokens en MongoDB */
@Repository
public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {

    /** Busca refresh token por valor */
    @NonNull
    Optional<RefreshToken> findByToken(@NonNull String token);

    /** Busca refresh token válido (no revocado y no expirado) */
    @NonNull
    Optional<RefreshToken> findByTokenAndRevokedFalse(@NonNull String token);

    /** Elimina todos los refresh tokens de un usuario */
    void deleteByUserId(@NonNull String userId);

    /** Elimina refresh token específico */
    void deleteByToken(@NonNull String token);
}
