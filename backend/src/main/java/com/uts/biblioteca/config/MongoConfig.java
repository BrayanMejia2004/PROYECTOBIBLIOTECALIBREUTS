package com.uts.biblioteca.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.MongoTemplate;

@Slf4j
@Configuration
@EnableMongoAuditing
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    private final MongoDatabaseFactory mongoDatabaseFactory;
    private final MongoTemplate mongoTemplate;

    public MongoConfig(MongoDatabaseFactory mongoDatabaseFactory, MongoTemplate mongoTemplate) {
        this.mongoDatabaseFactory = mongoDatabaseFactory;
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void validateMongoConnection() {
        if (mongoUri == null || mongoUri.isBlank()) {
            throw new IllegalStateException(
                "MONGODB_URI no está definida. " +
                "Configura la variable de entorno antes de iniciar la aplicación."
            );
        }
        
        String maskedUri = maskSensitiveData(mongoUri);
        log.info("MongoDB: URI configurada: {}", maskedUri);
        
        try {
            String databaseName = mongoDatabaseFactory.getMongoDatabase().getName();
            mongoTemplate.getCollection("users").estimatedDocumentCount();
            log.info("MongoDB: Conexión exitosa a base de datos '{}'. Colecciones detectadas.", databaseName);
        } catch (Exception e) {
            log.error("MongoDB: Error al verificar conexión: {}", e.getMessage());
            throw new IllegalStateException(
                "No se pudo conectar a MongoDB con la URI proporcionada. Verifica las credenciales y conexión."
            );
        }
    }

    private String maskSensitiveData(String uri) {
        if (uri == null) return "null";
        return uri.replaceAll("mongodb(\\+srv)?://([^:]+):([^@]+)@", "mongodb$1://$2:***@");
    }
}
