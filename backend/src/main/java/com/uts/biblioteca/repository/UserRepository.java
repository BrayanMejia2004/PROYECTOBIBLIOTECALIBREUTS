package com.uts.biblioteca.repository;

import com.uts.biblioteca.model.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/** Repositorio para acceso a documentos de usuarios en MongoDB */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /** Busca usuario por email */
    Optional<User> findByEmail(String email);

    /** Verifica si existe usuario con el email */
    boolean existsByEmail(String email);
}
