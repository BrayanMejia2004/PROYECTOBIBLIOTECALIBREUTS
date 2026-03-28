# Docker - Biblioteca UTS

## Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `backend/Dockerfile` | Multi-stage build para Spring Boot |
| `frontend/Dockerfile` | Multi-stage build para React + Nginx |
| `frontend/nginx.conf` | Configuración de Nginx con proxy al API |
| `docker-compose.yml` | Orquestación de servicios |
| `.env.docker` | Variables de entorno para Docker |

## Requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Cuenta de MongoDB Atlas

## Configuración

1. Copia `.env.docker` a `.env`:
   ```bash
   cp .env.docker .env
   ```

2. Edita `.env` con tus credenciales:
   - `MONGODB_URI`: Tu URI de MongoDB Atlas
   - `JWT_SECRET`: Clave secreta para JWT (mínimo 256 bits)

## Construcción y Ejecución

### Desarrollo rápido
```bash
docker-compose up --build
```

### Producción
```bash
docker-compose -f docker-compose.yml up --build -d
```

## Puertos

| Servicio | Puerto |
|----------|--------|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |

## Comandos Útiles

```bash
# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir sin caché
docker-compose build --no-cache

# Escalar servicios
docker-compose up -d --scale backend=2
```
