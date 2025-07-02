import { Request, Response, NextFunction } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import candidatoRoutes from './routes/candidatoRoutes';
import { 
  corsOptions, 
  rateLimiter, 
  requestLogger, 
  errorHandler, 
  validateJson, 
  securityHeaders,
  healthCheck 
} from './middleware/security';
import logger from './config/logger';
import Database from './config/database';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
export const app = express();
const port = process.env.PORT || 3010;

// Middleware de seguridad y logging
app.use(securityHeaders);
app.use(rateLimiter);
app.use(requestLogger);
app.use(validateJson);

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurar CORS
app.use(cors(corsOptions));

// Ruta de health check
app.get('/health', healthCheck);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del Sistema ATS funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/candidatos', candidatoRoutes);

// Configuración de Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ATS API',
    version: '1.0.0',
    description: 'Documentación de la API del Sistema ATS',
  },
  servers: [
    { url: `http://localhost:${process.env.PORT || 3010}` }
  ],
};
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Documentar rutas con JSDoc
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware para manejo de rutas no encontradas
app.use('*', (req: Request, res: Response) => {
  logger.warn('Ruta no encontrada', { 
    method: req.method, 
    url: req.originalUrl,
    ip: req.ip 
  });
  
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    error: 'Not Found'
  });
});

// Middleware para manejo de errores
app.use(errorHandler);

// Función para iniciar el servidor
async function startServer() {
  try {
    // Verificar conexión a la base de datos
    const prisma = Database.getInstance();
    await prisma.$connect();
    logger.info('Conexión a la base de datos establecida correctamente');

    // Iniciar servidor
    app.listen(port, () => {
      logger.info(`Servidor iniciado correctamente en el puerto ${port}`);
      logger.info(`Health check disponible en: http://localhost:${port}/health`);
      logger.info(`API de candidatos disponible en: http://localhost:${port}/api/candidatos`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales para cierre limpio
process.on('SIGINT', async () => {
  logger.info('Recibida señal SIGINT, cerrando servidor...');
  await Database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Recibida señal SIGTERM, cerrando servidor...');
  await Database.disconnect();
  process.exit(0);
});

// Iniciar servidor si el archivo se ejecuta directamente
if (require.main === module) {
  startServer();
}

export default app;
