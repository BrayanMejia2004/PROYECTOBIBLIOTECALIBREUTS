<div align="center">

# 📚 Biblioteca UTS

### Sistema de Gestión de Biblioteca Universitaria

[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.14-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Aplicación web moderna para la gestión digital de una biblioteca universitaria.**  
Desarrollada con React + Spring Boot, orientada a estudiantes y administradores de la UTS.

</div>

---

## 📋 Tabla de Contenidos

- [¿Qué es Biblioteca UTS?](#-qué-es-biblioteca-uts)
- [Características principales](#-características-principales)
- [Stack tecnológico](#-stack-tecnológico)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y configuración](#-instalación-y-configuración)
- [Scripts disponibles](#-scripts-disponibles)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Despliegue](#-despliegue)
- [Cómo contribuir](#-cómo-contribuir)
- [Licencia](#-licencia)
- [Contacto y soporte](#-contacto-y-soporte)

---

## 📖 ¿Qué es Biblioteca UTS?

**Biblioteca UTS** es una plataforma web que digitaliza y centraliza la gestión de la biblioteca universitaria. Permite a estudiantes explorar el catálogo, solicitar préstamos y calificar libros, mientras que los administradores disponen de un panel de control completo para gestionar recursos, usuarios y estadísticas en tiempo real.

### 👨‍🎓 Para Estudiantes

| Funcionalidad | Descripción |
|---|---|
| 🔍 Explorar catálogo | Busca y filtra libros por categoría o idioma |
| 🔐 Acceso seguro | Regístrate e inicia sesión con credenciales universitarias |
| 📬 Solicitar préstamos | Pide libros físicos directamente desde la plataforma |
| ⭐ Reseñar libros | Califica y comenta los libros que has leído |
| 👤 Gestionar perfil | Edita tu información y consulta tu historial de préstamos |

### 🛠️ Para Administradores

| Funcionalidad | Descripción |
|---|---|
| 📊 Panel de control | Estadísticas en tiempo real con gráficos interactivos |
| 📚 Gestión de libros | Agregar, editar y eliminar libros del catálogo |
| 👥 Gestión de usuarios | Administrar cuentas y roles de los usuarios |
| 🔔 Control de préstamos | Supervisar préstamos con notificaciones automáticas |

---

## ✨ Características principales

- 🎨 **Catálogo visual** con tarjetas de libros y filtros por categoría e idioma
- 🔍 **Búsqueda en tiempo real** con debounce para mejor rendimiento
- 📚 **Detalles completos** de cada libro con sistema de calificación por estrellas
- 👤 **Perfiles de usuario** con foto y datos personalizables
- 📋 **Sistema de préstamos** con fechas de vencimiento y alertas automáticas
- 🔒 **Autenticación JWT** con access token y refresh token
- 📊 **Panel de administración** con gráficos y estadísticas (Recharts)
- 🌐 **Soporte multiidioma** (Español / Inglés)
- 📱 **Diseño responsive** optimizado para dispositivos móviles
- ⚡ **Rate limiting** para protección contra ataques de fuerza bruta

---

## 🧰 Stack tecnológico

### Frontend

| Tecnología | Versión |
|---|---|
| React | 19.2.4 |
| Vite | 8.0.0 |
| TypeScript | ~5.9.3 |
| Tailwind CSS | 4.2.1 |
| TanStack Query | ^5.90.21 |
| React Router DOM | ^7.13.1 |
| Zod (validación) | ^4.3.6 |
| Recharts | ^3.8.0 |

### Backend

| Tecnología | Versión |
|---|---|
| Spring Boot | 3.5.14 |
| Java | 17 |
| Spring Data MongoDB | Incluido |
| JWT | 0.12.5 |

### Infraestructura

| Servicio | Uso |
|---|---|
| MongoDB Atlas | Base de datos en la nube |
| Vercel | Despliegue del frontend |
| Render | Despliegue del backend |


## 📁 Estructura del proyecto

```
biblioteca-uts/
├── frontend/                        # Aplicación React + Vite
│   ├── src/
│   │   ├── api/                     # Cliente HTTP y definición de endpoints
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── admin/               # Componentes del panel de administración
│   │   │   ├── books/               # Componentes de libros y catálogo
│   │   │   ├── common/              # Componentes base (Button, Input, etc.)
│   │   │   ├── layout/              # Navbar, Layout, rutas protegidas
│   │   │   └── users/               # Componentes de gestión de usuarios
│   │   ├── context/                 # Contextos globales (Auth, Theme, i18n)
│   │   ├── hooks/                   # Hooks personalizados
│   │   ├── i18n/                    # Traducciones (es / en)
│   │   ├── pages/                   # Páginas (Login, Home, Admin, etc.)
│   │   ├── types/                   # Tipos e interfaces TypeScript
│   │   ├── utils/                   # Utilidades (JWT, validación)
│   │   ├── App.tsx                  # Configuración de rutas
│   │   ├── main.tsx                 # Punto de entrada de la aplicación
│   │   └── index.css                # Estilos globales y configuración del tema
│   ├── public/                      # Archivos estáticos (favicon, etc.)
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                         # API REST con Spring Boot
│   ├── src/main/java/com/uts/biblioteca/
│   │   ├── config/                  # Configuraciones (Security, MongoDB, CORS)
│   │   ├── controller/              # Controladores REST
│   │   ├── dto/
│   │   │   ├── request/             # DTOs de entrada
│   │   │   └── response/            # DTOs de salida
│   │   ├── exception/               # Manejo global de excepciones
│   │   ├── model/
│   │   │   ├── entity/              # Entidades MongoDB
│   │   │   └── enums/               # Enumeraciones del dominio
│   │   ├── repository/              # Repositorios MongoDB
│   │   ├── security/                # JWT, filtros de autenticación
│   │   └── service/
│   │       ├── impl/                # Implementaciones de servicios
│   │       └── interfaces/          # Interfaces de servicio
│   ├── src/main/resources/
│   │   ├── application.yml          # Configuración base
│   │   ├── application-dev.yml      # Perfil de desarrollo
│   │   └── application-prod.yml     # Perfil de producción
│   ├── .env.example                 # Plantilla de variables de entorno
│   └── pom.xml
│
├── .gitignore
└── README.md
```

---

<div align="center">

Desarrollado con ❤️ para la comunidad universitaria de la UTS

</div>
