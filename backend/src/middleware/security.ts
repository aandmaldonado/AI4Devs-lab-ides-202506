import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import logger from '../config/logger';

/**
 * Configuración de CORS para permitir acceso desde el frontend
 */
export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

/**
 * Rate limiting para prevenir ataques de fuerza bruta
 * Máximo 100 requests por minuto por IP
 */
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // máximo 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, inténtalo de nuevo en 1 minuto',
    error: 'Rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', { 
      ip: req.ip, 
      userAgent: req.get('User-Agent') 
    });
    res.status(429).json({
      success: false,
      message: 'Demasiadas peticiones desde esta IP, inténtalo de nuevo en 1 minuto',
      error: 'Rate limit exceeded'
    });
  }
});

/**
 * Middleware para logging de peticiones
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

/**
 * Middleware para manejo de errores no capturados
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error no manejado', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? 'Error interno' : err.message
  });
};

/**
 * Middleware para validar que el body sea JSON válido
 */
export const validateJson = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof SyntaxError && 'body' in err) {
    logger.warn('JSON inválido en request', { 
      url: req.url, 
      ip: req.ip 
    });
    
    res.status(400).json({
      success: false,
      message: 'JSON inválido en el body de la petición',
      error: 'Invalid JSON'
    });
    return;
  }
  next();
};

/**
 * Middleware para sanitizar headers de seguridad
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

/**
 * Middleware para verificar que la aplicación esté funcionando
 */
export const healthCheck = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'Servicio funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}; 