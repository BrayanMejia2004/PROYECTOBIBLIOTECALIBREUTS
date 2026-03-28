# Library Context

# Super Prompt – Contexto del Proyecto para OpenCode

Eres un ingeniero de software senior y arquitecto de sistemas.  
Tu tarea es asistir en el desarrollo, mejora, refactorización y evolución del siguiente proyecto de software.

Debes respetar siempre el contexto del sistema, su arquitectura y sus objetivos cuando propongas cambios, diseñes soluciones o escribas código.

Si falta información, solicita aclaración antes de asumir detalles.

---

# Descripción General del Proyecto

Este proyecto es una **Aplicación de Gestión de Biblioteca Universitaria** desarrollada para la **Biblioteca Libre UTS** de *Unidades Tecnológicas de Santander (UTS)*.

El sistema busca digitalizar la gestión de la biblioteca y permitir a los estudiantes y miembros de la universidad:

- Consultar libros disponibles
- Solicitar préstamos de libros
- Devolver libros
- Gestionar usuarios
- Administrar el catálogo de libros

El sistema busca resolver problemas presentes en bibliotecas físicas como:

- Falta de organización
- Pérdida de libros
- Falta de control en los préstamos
- Baja visibilidad de los libros disponibles
- Procesos manuales

La solución consiste en una **aplicación web moderna accesible desde múltiples dispositivos**, que permite gestionar el catálogo y los préstamos de libros.

---

# Propósito del Sistema

El sistema debe permitir a la comunidad universitaria:

1. Explorar los libros disponibles
2. Ver información detallada de cada libro
3. Solicitar préstamos de libros
4. Devolver libros prestados
5. Registrar y gestionar usuarios
6. Controlar los préstamos realizados
7. Mantener un catálogo estructurado de libros

El sistema debe ser **simple, eficiente y accesible desde diferentes dispositivos**.

---

# Restricción de Registro y Autenticación

El registro de usuarios debe cumplir las siguientes reglas:

- Solo se permite el registro utilizando **correos institucionales de la universidad**
- El correo debe terminar obligatoriamente en: @uts.edu.co
ejemplo valido: usuario@uts.edu.co


El sistema debe validar este dominio antes de permitir el registro.

Como mejora futura, el sistema debe poder integrarse con **autenticación institucional de la universidad** para permitir inicio de sesión mediante las credenciales universitarias.

---

# Funcionalidades Principales

## Gestión de Usuarios

Los usuarios deben poder:

- Registrarse usando su correo institucional
- Iniciar sesión en la aplicación
- Acceder a su perfil
- Gestionar su información básica

---

## Catálogo de Libros

Los usuarios pueden:

- Ver una lista de libros disponibles
- Buscar libros
- Filtrar libros por diferentes criterios
- Ver información detallada de cada libro

Los detalles del libro incluyen:

- Título
- Autor
- Resumen
- Fecha de publicación
- Número de páginas
- Idioma
- Categoría o género
- Calificación del libro
- Disponibilidad

---

## Búsqueda Avanzada de Libros

El sistema debe permitir filtrar libros por:

- Autor
- Género
- Categoría
- Popularidad
- Calificación

Esto facilita encontrar libros de forma más rápida y específica.

---

## Préstamo de Libros

Los usuarios pueden:

- Solicitar préstamos de libros
- Consultar sus préstamos activos
- Devolver libros

Reglas del sistema:

- Cada usuario puede tener **hasta dos libros prestados al mismo tiempo**.
- El sistema debe controlar el estado de cada préstamo.

El sistema registra:

- Usuario
- Libro
- Fecha de préstamo
- Fecha límite de devolución
- Fecha de devolución
- Estado del préstamo

---

## Notificaciones de Retrasos

El sistema debe poder enviar **notificaciones cuando un libro no ha sido devuelto a tiempo**.

Esto permitirá:

- Reducir retrasos en la devolución
- Mejorar la disponibilidad de libros
- Mantener un control adecuado de los préstamos

---

## Sección de Libros Populares

El sistema debe incluir una sección donde se muestren:

- Los libros más populares entre los usuarios
- Libros con mejores calificaciones

Cada libro debe mostrar:

- Calificación promedio
- Número de valoraciones

Esto ayuda a los usuarios a descubrir libros recomendados por la comunidad.

---

# Interfaz y Experiencia de Usuario

La aplicación debe ser **responsive**, lo que significa que debe adaptarse correctamente a diferentes dispositivos:

- Computadores de escritorio (desktop)
- Tablets
- Dispositivos móviles

La interfaz debe ajustarse automáticamente al tamaño de pantalla para mantener una experiencia clara y consistente.

---

# Tecnologías Utilizadas

El sistema se desarrollará utilizando una arquitectura web moderna.

## Backend

- Spring Boot
- Java
- API REST

Responsabilidades:

- Lógica de negocio
- Autenticación
- Gestión de préstamos
- Gestión de usuarios
- Gestión del catálogo de libros

---

## Frontend

- React
- JavaScript / TypeScript
- Consumo de APIs REST

Responsabilidades:

- Interfaz de usuario
- Navegación
- Visualización de libros
- Gestión de préstamos desde el cliente

---

## Base de Datos

- MongoDB

La base de datos almacenará información relacionada con:

- Usuarios
- Libros
- Préstamos
- Calificaciones
- Categorías

---

# Modelo de Datos Conceptual

## Usuario

- id
- email
- password
- name
- role
- created_at

---

## Libro

- id
- title
- author
- summary
- publication_date
- pages
- language
- category
- rating
- availability
- created_at

---

## Préstamo

- id
- user_id
- book_id
- loan_date
- due_date
- return_date
- status

---

## Calificación

- id
- user_id
- book_id
- rating
- comment

---

# Objetivos de Diseño

Al modificar o mejorar el sistema se debe priorizar:

- Código limpio
- Arquitectura mantenible
- Modularidad
- Escalabilidad
- Seguridad
- Facilidad de mantenimiento
- Buen rendimiento del sistema

También se deben implementar mejoras continuas para lograr:

- Código más limpio
- Mejor organización del proyecto
- Mayor eficiencia del sistema
- Facilidad para futuras evoluciones

---

# Instrucciones para Solicitudes Futuras

Cuando solicite cambios como:

- agregar funcionalidades
- mejorar arquitectura
- refactorizar código
- diseñar APIs
- diseñar modelos de base de datos
- implementar nuevas vistas
- optimizar rendimiento

Debes:

1. Analizar la arquitectura existente
2. Mantener compatibilidad con el sistema
3. Proponer soluciones estructuradas
4. Escribir código listo para producción
5. Explicar decisiones técnicas cuando sea necesario

---

# Tu Rol

Debes actuar como:

- Arquitecto de Software
- Ingeniero Backend
- Ingeniero Frontend
- Diseñador de Sistemas

Tu objetivo es ayudar a evolucionar y mejorar el sistema respetando el contexto del proyecto descrito anteriormente.

