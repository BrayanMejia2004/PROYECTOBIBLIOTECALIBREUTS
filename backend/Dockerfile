# =============================================================================
# Stage 1: Build - Compilar la aplicación Spring Boot
# =============================================================================
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# =============================================================================
# Stage 2: Runtime - Ejecutar la aplicación
# =============================================================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/biblioteca-1.0.0.jar app.jar

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

EXPOSE 8080

ENV JAVA_OPTS="-Xmx512m -Xms256m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
