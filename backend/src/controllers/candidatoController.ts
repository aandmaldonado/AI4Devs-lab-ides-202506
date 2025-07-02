import { Request, Response } from 'express';
import { CandidatoService } from '../services/candidatoService';
import { ICandidatoCreate, ICandidatoUpdate, ICandidatoFilters } from '../types/candidato';
import logger from '../config/logger';

/**
 * Controlador de candidatos
 * Maneja las peticiones HTTP y delega la lógica de negocio al servicio
 * Implementa principios SOLID y clean code
 */
export class CandidatoController {
  private candidatoService: CandidatoService;

  constructor() {
    this.candidatoService = new CandidatoService();
  }

  /**
   * Crea un nuevo candidato
   * POST /candidatos
   */
  async createCandidato(req: Request, res: Response): Promise<void> {
    try {
      const candidatoData: ICandidatoCreate = req.body;
      // Si se subió un archivo, agregarlo al candidatoData
      if (req.file) {
        candidatoData.cv = req.file.buffer;
        if (req.body.cvNombre) {
          candidatoData.cvNombre = req.body.cvNombre;
        }
      }
      logger.info('Petición para crear candidato recibida', { 
        email: candidatoData.email,
        ip: req.ip 
      });

      const result = await this.candidatoService.createCandidato(candidatoData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Error en controlador al crear candidato', { error });
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'Error interno'
      });
    }
  }

  /**
   * Obtiene todos los candidatos con filtros opcionales
   * GET /candidatos
   */
  async getCandidatos(req: Request, res: Response): Promise<void> {
    try {
      const filters: ICandidatoFilters = {
        nombre: req.query.nombre as string,
        apellido: req.query.apellido as string,
        email: req.query.email as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };

      logger.info('Petición para obtener candidatos recibida', { 
        filters,
        ip: req.ip 
      });

      const result = await this.candidatoService.getCandidatos(filters);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      logger.error('Error en controlador al obtener candidatos', { error });
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'Error interno'
      });
    }
  }

  /**
   * Obtiene un candidato por su documento
   * GET /candidatos/:documento
   */
  async getCandidatoByDocumento(req: Request, res: Response): Promise<void> {
    try {
      const documento = req.params.documento;
      if (!documento) {
        logger.warn('Documento de candidato inválido en petición', { documento });
        res.status(400).json({
          success: false,
          message: 'Documento de candidato inválido',
          error: 'Documento inválido'
        });
        return;
      }
      logger.info('Petición para obtener candidato por documento recibida', { documento, ip: req.ip });
      const result = await this.candidatoService.getCandidatoByDocumento(documento);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      logger.error('Error en controlador al obtener candidato por documento', { error });
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'Error interno'
      });
    }
  }

  /**
   * Actualiza un candidato existente
   * PUT /candidatos/:documento
   */
  async updateCandidato(req: Request, res: Response): Promise<void> {
    try {
      const documento = req.params.documento;
      if (!documento) {
        logger.warn('Documento de candidato inválido en petición de actualización', { documento });
        res.status(400).json({
          success: false,
          message: 'Documento de candidato inválido',
          error: 'Documento inválido'
        });
        return;
      }
      const candidatoData: ICandidatoUpdate = req.body;
      // Si se subió un archivo, agregarlo al candidatoData
      if (req.file) {
        candidatoData.cv = req.file.buffer;
        if (req.body.cvNombre) {
          candidatoData.cvNombre = req.body.cvNombre;
        }
      }
      logger.info('Petición para actualizar candidato recibida', { documento, email: candidatoData.email, ip: req.ip });
      const result = await this.candidatoService.updateCandidato(documento, candidatoData);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Error en controlador al actualizar candidato', { error });
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'Error interno'
      });
    }
  }

  /**
   * Elimina un candidato por su documento
   * DELETE /candidatos/:documento
   */
  async deleteCandidato(req: Request, res: Response): Promise<void> {
    try {
      const documento = req.params.documento;
      if (!documento) {
        logger.warn('Documento de candidato inválido en petición de eliminación', { documento });
        res.status(400).json({
          success: false,
          message: 'Documento de candidato inválido',
          error: 'Documento inválido'
        });
        return;
      }
      logger.info('Petición para eliminar candidato recibida', { documento, ip: req.ip });
      const result = await this.candidatoService.deleteCandidato(documento);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      logger.error('Error en controlador al eliminar candidato', { error });
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'Error interno'
      });
    }
  }

  /**
   * Descarga el CV de un candidato
   * GET /candidatos/:documento/cv
   */
  async downloadCV(req: Request, res: Response): Promise<void> {
    try {
      const documento = req.params.documento;
      if (!documento) {
        res.status(400).json({ success: false, message: 'Documento de candidato inválido' });
        return;
      }
      const result = await this.candidatoService.getCandidatoByDocumento(documento);
      if (!result.success || !result.data || !(result.data as any).cv) {
        res.status(404).json({ success: false, message: 'CV no encontrado para este candidato' });
        return;
      }
      const candidato = result.data as any;
      let buffer = candidato.cv;
      if (buffer && buffer.type === 'Buffer' && Array.isArray(buffer.data)) {
        buffer = Buffer.from(buffer.data);
      }
      const filename = candidato.cvNombre || 'cv.pdf';
      // Determinar el tipo MIME por extensión
      let mimeType = 'application/pdf';
      if (filename.endsWith('.doc') || filename.endsWith('.docx')) {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (filename.endsWith('.pdf')) {
        mimeType = 'application/pdf';
      }
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', mimeType);
      res.send(buffer);
    } catch (error) {
      logger.error('Error al descargar CV', { error });
      res.status(500).json({ success: false, message: 'Error interno al descargar el CV' });
    }
  }
} 