# Sistema ATS (Applicant Tracking System)

Sistema completo de gestión de candidatos con React frontend y Express backend, usando Prisma ORM y PostgreSQL.

## 🚀 Características

- **Frontend**: React con TypeScript, Tailwind CSS, y validación en tiempo real
- **Backend**: Express.js con TypeScript, Prisma ORM, y validaciones robustas
- **Base de Datos**: PostgreSQL con migraciones automáticas
- **Validación**: Errores específicos por campo con feedback detallado al usuario
- **Testing**: Tests unitarios y de integración completos
- **Seguridad**: Middleware de seguridad y validación de entrada
- **Logging**: Sistema de logs estructurado

## 📋 Estado del Proyecto

✅ **Completado**:
- Backend con validaciones detalladas y manejo de errores específicos por campo
- Frontend con interfaz moderna y manejo robusto de errores
- Sistema de testing completo (backend: 3 tests, frontend: 12 tests)
- Base de datos con migraciones y seeding
- Documentación completa

## 🏁 Primeros pasos rápidos

1. **Clona el repositorio y entra al proyecto:**
   ```bash
   git clone <repository-url>
   cd AI4Devs-lab-ides
   ```
2. **Levanta la base de datos con Docker:**
   ```bash
   docker-compose up -d
   ```
3. **Instala dependencias:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. **Aplica migraciones y pobla la base de datos con datos realistas:**
   ```bash
   cd ../backend
   npx prisma migrate dev
   npx ts-node --transpile-only src/scripts/seedRealista.ts
   ```
5. **Arranca los servidores:**
   ```bash
   npm run dev      # backend (http://localhost:3010)
   cd ../frontend
   npm start        # frontend (http://localhost:3000)
   ```

## 📊 Documentación interactiva de la API (Swagger)

El backend expone la documentación y pruebas interactivas de la API en:

- [http://localhost:3010/api-docs](http://localhost:3010/api-docs)

Desde ahí puedes:
- Consultar todos los endpoints y sus parámetros
- Probar peticiones reales (GET, POST, descarga de CV, etc.)
- Ver ejemplos de request y response

> **Tip:** Si cambias el puerto del backend, actualiza la URL de Swagger.

## 🧑‍💻 Ejemplo de uso del script de seed realista

Al ejecutar:
```bash
npx ts-node --transpile-only src/scripts/seedRealista.ts
```
Verás una salida similar a:
```
[INFO] Borrando candidatos existentes...
[INFO] Insertando candidatos dummy realistas...
[INFO] Candidato María González creado con CV
[INFO] Candidato Juan Pérez creado con CV
[INFO] Candidato Laura Martínez creado sin CV
[INFO] Seed completado correctamente
```

Puedes personalizar los datos editando el archivo `backend/src/scripts/seedRealista.ts`.

## 📦 Flujo de desarrollo recomendado

1. Haz cambios en backend o frontend según la estructura del proyecto.
2. Usa el script de seed para tener datos de prueba realistas.
3. Consulta y prueba la API desde Swagger antes de conectar el frontend.
4. Ejecuta los tests para validar que todo sigue funcionando.
5. Usa los logs y mensajes de error para depurar rápidamente.

## ⚠️ Consejos y advertencias

- **Proxy del frontend:** El archivo `frontend/package.json` tiene configurado el proxy para que las peticiones `/api` vayan al backend automáticamente en desarrollo.
- **Descarga de CV:** El documento del candidato nunca se expone en la URL, ni para ver detalles ni para descargar el CV.
- **Variables de entorno:** Si necesitas cambiar puertos o credenciales, usa un archivo `.env` en `backend/`.
- **Swagger:** Mantén las anotaciones JSDoc actualizadas en las rutas para que la documentación sea precisa.

## 🛠️ Instalación

### Prerrequisitos
- Node.js v20.x o superior
- Docker y Docker Compose
- npm o yarn

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd AI4Devs-lab-ides
```

2. **Configurar base de datos**
```bash
docker-compose up -d
```

3. **Configurar backend**
```bash
cd backend
npm install
npx prisma migrate dev
npm run seed
```

4. **Configurar frontend**
```bash
cd frontend
npm install
```

## 🚀 Ejecución

### Desarrollo

**Backend:**
```bash
cd backend
npm run dev
```
Servidor disponible en: http://localhost:3010

**Frontend:**
```bash
cd frontend
npm start
```
Aplicación disponible en: http://localhost:3000

### Testing

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

## 📁 Estructura del Proyecto

```
AI4Devs-lab-ides/
├── backend/                 # Servidor Express
│   ├── src/
│   │   ├── controllers/     # Controladores de la API
│   │   ├── services/        # Lógica de negocio
│   │   ├── repositories/    # Acceso a datos
│   │   ├── middleware/      # Middleware personalizado
│   │   ├── routes/          # Rutas de la API
│   │   ├── validators/      # Validaciones de entrada
│   │   └── types/           # Tipos TypeScript
│   └── prisma/              # Esquema y migraciones de BD
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Servicios de API
│   │   ├── types/           # Tipos TypeScript
│   │   └── tests/           # Tests del frontend
└── docs/                    # Documentación
```

## 🔧 API Endpoints

### Candidatos
- `GET /api/candidatos` - Listar candidatos con filtros
- `GET /api/candidatos/:id` - Obtener candidato por ID
- `POST /api/candidatos` - Crear nuevo candidato
- `PUT /api/candidatos/:id` - Actualizar candidato
- `DELETE /api/candidatos/:id` - Eliminar candidato

### Validación
El sistema incluye validación robusta con errores específicos por campo:
- Validación de formato de email
- Validación de longitud de campos
- Validación de campos requeridos
- Feedback detallado al usuario

## 🧪 Testing

El proyecto incluye tests completos para validar:
- Funcionalidad de la API
- Manejo de errores de validación
- Componentes del frontend
- Servicios de API

**Ejecutar todos los tests:**
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## 📝 Historial de Desarrollo


Ver `prompts-iniciales.md` para el historial completo de desarrollo.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

### Poblar la base de datos con datos realistas

Para tener datos de ejemplo realistas en tu entorno de desarrollo, ejecuta el siguiente script:

```bash
cd backend
npx ts-node --transpile-only src/scripts/seedRealista.ts
```

Este script:
- Elimina los candidatos existentes para evitar duplicados.
- Inserta candidatos con datos variados y realistas (nombres, emails, experiencia, etc.).
- Asigna un CV de ejemplo (si existe `prisma/sample_cv.pdf`) a varios candidatos.
- Incluye comentarios detallados para facilitar su uso y personalización.

Puedes agregar más archivos PDF en la carpeta `prisma/` y ampliar el array de candidatos en el script para mayor variedad.

## 📬 Ejemplos de request y response

### Listar candidatos
**Request:**
```http
GET /api/candidatos
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "documento": "12345678A",
      "nombre": "María",
      "apellido": "González",
      "email": "maria.gonzalez@gmail.com",
      "telefono": "+34 612 345 678",
      "direccion": "Calle Mayor 123, Madrid, España",
      "educacion": "Ingeniería Informática",
      "experiencia": "3 años en desarrollo web",
      "cvNombre": "CV_Maria.pdf"
    }
  ]
}
```

### Detalle de candidato (sin exponer documento en URL)
**Request:**
```http
POST /api/candidatos/detalle
Content-Type: application/json

{
  "documento": "12345678A"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "documento": "12345678A",
    "nombre": "María",
    "apellido": "González",
    "email": "maria.gonzalez@gmail.com",
    "telefono": "+34 612 345 678",
    "direccion": "Calle Mayor 123, Madrid, España",
    "educacion": "Ingeniería Informática",
    "experiencia": "3 años en desarrollo web",
    "cvNombre": "CV_Maria.pdf"
  }
}
```

### Descargar CV (sin exponer documento en URL)
**Request:**
```http
POST /api/candidatos/descargar-cv
Content-Type: application/json

{
  "documento": "12345678A"
}
```
**Response:**
- Content-Type: application/pdf
- Descarga el archivo binario del CV

## 🌀 Comandos curl útiles

### Listar candidatos
```sh
curl -X GET http://localhost:3010/api/candidatos
```

### Obtener detalle de candidato
```sh
curl -X POST http://localhost:3010/api/candidatos/detalle \
  -H "Content-Type: application/json" \
  -d '{"documento": "12345678A"}'
```

### Descargar CV
```sh
curl -X POST http://localhost:3010/api/candidatos/descargar-cv \
  -H "Content-Type: application/json" \
  -d '{"documento": "12345678A"}' \
  -o cv_descargado.pdf
```
