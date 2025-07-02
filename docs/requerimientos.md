# Requerimientos y Especificaciones Técnicas

## 1. Descripción General

El sistema ATS (Applicant Tracking System) permitirá a los reclutadores añadir y gestionar candidatos de manera eficiente. La solución será una aplicación full-stack compuesta por:
- **Frontend:** React (TypeScript, Create React App)
- **Backend:** Express (TypeScript)
- **Base de datos:** PostgreSQL gestionada con Prisma ORM

## 2. Requerimientos Funcionales

### 2.1. Añadir Candidato
- El usuario debe poder añadir un candidato desde el dashboard principal.
- El formulario debe incluir los siguientes campos:
  - Nombre (obligatorio, máximo 100 caracteres)
  - Apellido (obligatorio, máximo 100 caracteres)
  - Correo electrónico (obligatorio, formato válido, máximo 150 caracteres)
  - Teléfono (máximo 20 caracteres)
  - Dirección (máximo 200 caracteres)
  - Educación (autocompletable, máximo 200 caracteres)
  - Experiencia laboral (autocompletable, máximo 500 caracteres)
  - Carga de CV (PDF o DOCX, máximo 5MB)
- Validación de datos en frontend y backend, incluyendo longitud máxima de cada campo para consistencia con la base de datos.
- Mensajes claros de éxito y error.
- Accesibilidad y compatibilidad cross-browser y dispositivos.

### 2.2. Modificar y Eliminar Candidato
- El sistema debe permitir modificar los datos de un candidato existente mediante un endpoint `PUT /candidatos/:id`.
- El sistema debe permitir eliminar un candidato mediante un endpoint `DELETE /candidatos/:id`.
- Ambos endpoints deben validar la existencia del candidato y responder con mensajes claros de éxito o error.

## 3. Requerimientos No Funcionales

- Seguridad y privacidad de los datos personales.
- Interfaz intuitiva y fácil de usar.
- Escalabilidad para soportar crecimiento futuro.
- Cumplimiento de buenas prácticas de desarrollo y pruebas automatizadas.
- Aplicación de principios SOLID, DDD (Domain-Driven Design) y TDD (Test-Driven Development) en el desarrollo del backend y frontend.

## 4. Especificaciones Técnicas

### 4.1. Backend
- Node.js + Express con TypeScript.
- Prisma ORM para acceso a base de datos PostgreSQL.
- Endpoints RESTful:
  - `POST /candidatos` para crear un candidato.
  - `GET /candidatos` para listar candidatos.
  - `PUT /candidatos/:id` para modificar un candidato.
  - `DELETE /candidatos/:id` para eliminar un candidato.
- Validación de datos en los endpoints, incluyendo longitud máxima y formato de campos.
- Validación estricta de la extensión de archivos subidos (solo PDF o DOCX) y tamaño máximo permitido.
- Manejo de archivos para carga de CV (almacenamiento local o S3, a definir).
- Manejo de errores y respuestas estructuradas.
- Variables de entorno para configuración sensible.
- Pruebas unitarias y de integración (Jest, Supertest).
- Protección contra inyección SQL mediante el uso de Prisma ORM y validaciones adicionales.
- Aplicar principios de desarrollo seguro (validación/sanitización de entradas, manejo seguro de archivos, gestión de errores sin exponer información sensible).
- Seguir lineamientos de clean code: código modular, funciones pequeñas, nombres descriptivos, separación de responsabilidades y documentación clara.
- Aplicar principios SOLID y DDD en la arquitectura y diseño del backend.
- Aplicar TDD en el desarrollo de nuevas funcionalidades.

### 4.2. Frontend
- React con TypeScript (Create React App).
- Formulario de alta y edición de candidato con validaciones en tiempo real.
- Validar longitud máxima de cada campo para coincidir con las restricciones de la base de datos.
- Componente para carga de archivos (CV), validando extensión y tamaño antes de enviar al backend.
- Mensajes de feedback (éxito/error).
- Accesibilidad (uso de roles, etiquetas ARIA, navegación teclado).
- Autocompletado para educación y experiencia laboral (sugerencias desde backend).
- Pruebas unitarias y de integración (Testing Library, Jest).
- Seguir lineamientos de clean code en componentes y lógica de negocio.
- Aplicar principios SOLID y TDD en el desarrollo de componentes y lógica de negocio.
- La interfaz debe ser completamente responsiva y adaptarse a distintos tamaños de pantalla (desktop, tablet, móvil).
- Utilizar Tailwind CSS para el diseño y estilos.
- Seleccionar una paleta de colores apropiada para sistemas profesionales, priorizando tonos suaves y neutros que no fuercen la vista (por ejemplo, fondos claros, textos en gris oscuro, acentos en azul o verde suave).

### 4.3. Base de Datos
- PostgreSQL gestionado vía Docker Compose.
- Prisma para definición y migración de modelos.
- Modelo inicial `Candidato`:

```prisma
model Candidato {
  id           Int      @id @default(autoincrement())
  nombre       String   @db.VarChar(100)
  apellido     String   @db.VarChar(100)
  email        String   @unique @db.VarChar(150)
  telefono     String?  @db.VarChar(20)
  direccion    String?  @db.VarChar(200)
  educacion    String?  @db.VarChar(200)
  experiencia  String?  @db.VarChar(500)
  cvUrl        String?  @db.VarChar(300)
  creadoEn     DateTime @default(now())
}
```

- Crear y ejecutar migraciones iniciales.
- Configuración de variables de entorno para conexión segura.

## 5. Tareas Técnicas Detalladas

### 5.1. Backend
- Definir modelo Prisma para candidatos con restricciones de longitud.
- Crear migración inicial y aplicarla en PostgreSQL.
- Implementar endpoints RESTful para alta, modificación y eliminación de candidatos.
- Implementar lógica de validación y manejo seguro de archivos.
- Validar extensión y tamaño de archivos subidos.
- Pruebas unitarias y de integración.
- Aplicar validaciones y sanitización de entradas para prevenir inyección SQL.
- Seguir principios de clean code y desarrollo seguro.
- Aplicar principios SOLID, DDD y TDD en el desarrollo del backend.

### 5.2. Frontend
- Crear formulario de alta y edición de candidato.
- Implementar validaciones de longitud y formato de campos.
- Validar extensión y tamaño de archivos antes de enviar.
- Integrar carga de archivos.
- Consumir API del backend.
- Pruebas unitarias y de integración.
- Seguir lineamientos de clean code.
- Aplicar principios SOLID y TDD en el desarrollo de componentes y lógica de negocio.
- Implementar diseño responsivo usando Tailwind CSS y una paleta de colores amigable para la vista.

### 5.3. Base de Datos
- Configurar servicio PostgreSQL en Docker Compose.
- Definir y migrar modelo de datos con Prisma, incluyendo restricciones de longitud.
- Probar conexión y operaciones básicas desde backend.

## 6. Consideraciones de Seguridad y Privacidad
- Validar y sanitizar todos los datos recibidos.
- Proteger archivos subidos (CV) y restringir tipos y tamaño (solo PDF o DOCX, máximo 5MB).
- No exponer información sensible en respuestas o logs.
- Cumplir con normativas de protección de datos aplicables.
- Prevenir inyección SQL usando ORM y validaciones estrictas.
- Aplicar desarrollo seguro en todo el ciclo de vida.

## 7. Autenticación y Seguridad

### 7.1. Autenticación
- Implementar autenticación JWT (JSON Web Tokens) con refresh tokens.
- Utilizar bcrypt para el hash de contraseñas con salt rounds de 12.
- Implementar middleware de autenticación para proteger endpoints sensibles.
- Configurar CORS apropiadamente para el dominio del frontend.
- Implementar rate limiting (máximo 100 requests por minuto por IP).
- Utilizar helmet.js para configurar headers de seguridad HTTP.

### 7.2. Cifrado y Seguridad de Datos
- Implementar HTTPS en producción con certificados SSL/TLS válidos.
- Cifrar datos sensibles en tránsito usando TLS 1.3.
- Implementar validación de entrada con bibliotecas como Joi o Zod.
- Sanitizar todas las entradas de usuario para prevenir XSS.
- Implementar logging seguro sin exponer información sensible.
- Configurar variables de entorno para todas las configuraciones sensibles.

## 8. Datos de Prueba (Dummy Data)

### 8.1. Población de Base de Datos
- Crear script de seed con datos dummy realistas para testing y desarrollo.
- Incluir al menos 50 candidatos con datos variados y realistas:
  - Nombres y apellidos reales de diferentes orígenes.
  - Emails válidos con dominios reales (gmail.com, outlook.com, etc.).
  - Números de teléfono con formatos internacionales.
  - Direcciones reales de diferentes ciudades.
  - Educación variada (universidades, carreras, años de graduación).
  - Experiencia laboral diversa en diferentes industrias y roles.
- Utilizar bibliotecas como Faker.js para generar datos consistentes y realistas.
- Crear script npm para ejecutar la población de datos: `npm run seed`.

### 8.2. Estructura de Datos de Prueba
```typescript
// Ejemplo de datos dummy realistas
const candidatosDummy = [
  {
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@gmail.com",
    telefono: "+34 612 345 678",
    direccion: "Calle Mayor 123, Madrid, España",
    educacion: "Ingeniería Informática - Universidad Politécnica de Madrid (2018)",
    experiencia: "Desarrolladora Full Stack en TechCorp (2019-2023), Especializada en React y Node.js"
  },
  // ... más candidatos con datos variados
];
```

## 9. Arquitectura y Patrones de Diseño

### 9.1. Backend Architecture
- Implementar arquitectura en capas: Controllers → Services → Repositories → Database.
- Utilizar inyección de dependencias para facilitar testing.
- Implementar patrón Repository para abstraer acceso a datos.
- Crear middleware personalizado para logging, validación y manejo de errores.
- Implementar factory pattern para creación de instancias complejas.

### 9.2. Frontend Architecture
- Implementar arquitectura basada en componentes con separación de responsabilidades.
- Utilizar Context API o Redux para gestión de estado global.
- Implementar custom hooks para lógica reutilizable.
- Crear componentes de orden superior (HOCs) para funcionalidad compartida.
- Implementar lazy loading para optimización de rendimiento.

## 10. Testing Strategy

### 10.1. Backend Testing
- Unit tests para servicios y utilidades (cobertura mínima 80%).
- Integration tests para endpoints API.
- E2E tests para flujos completos de candidatos.
- Mock de servicios externos y base de datos para tests aislados.

### 10.2. Frontend Testing
- Unit tests para componentes y hooks (cobertura mínima 80%).
- Integration tests para formularios y flujos de usuario.
- E2E tests con Cypress o Playwright.
- Snapshot testing para componentes UI.

## 11. Deployment y DevOps

### 11.1. Configuración de Entornos
- Desarrollo: Docker Compose con hot reload.
- Staging: Contenedores Docker con datos de prueba.
- Producción: Contenedores Docker con configuración optimizada.

### 11.2. CI/CD Pipeline
- GitHub Actions o GitLab CI para automatización.
- Linting y formateo automático de código.
- Ejecución automática de tests en cada commit.
- Build y deployment automático a staging/producción.

## 12. Monitoreo y Logging

### 12.1. Logging
- Implementar logging estructurado con Winston o Pino.
- Niveles de log: error, warn, info, debug.
- Rotación de logs para evitar saturación de disco.
- Integración con servicios de monitoreo (Sentry, LogRocket).

### 12.2. Métricas y Health Checks
- Endpoint `/health` para verificar estado del servicio.
- Métricas de rendimiento con Prometheus.
- Dashboard de monitoreo con Grafana.
- Alertas automáticas para errores críticos.
