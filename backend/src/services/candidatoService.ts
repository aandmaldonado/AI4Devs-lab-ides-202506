import { CandidatoRepository } from '../repositories/candidatoRepository';
import { ICandidato, ICandidatoCreate, ICandidatoUpdate, ICandidatoFilters, ICandidatoResponse } from '../types/candidato';
import { validateCreateCandidato, validateUpdateCandidato, traducirMensajeCampo } from '../validators/candidatoValidator';
import logger from '../config/logger';

/**
 * Servicio de candidatos
 * Implementa la lógica de negocio siguiendo principios SOLID
 * Separa la lógica de negocio del acceso a datos
 */
export class CandidatoService {
  private candidatoRepository: CandidatoRepository;

  constructor() {
    this.candidatoRepository = new CandidatoRepository();
  }

  /**
   * Crea un nuevo candidato con validación
   * @param candidatoData Datos del candidato
   * @returns Respuesta con el candidato creado
   */
  async createCandidato(candidatoData: ICandidatoCreate): Promise<ICandidatoResponse> {
    try {
      // Validar datos de entrada
      const validation = validateCreateCandidato(candidatoData);
      if (validation.error) {
        logger.warn('Validación fallida al crear candidato', { 
          errors: validation.error.details,
          email: candidatoData.email 
        });
        
        // Crear un objeto con errores específicos por campo
        const fieldErrors: { [key: string]: string } = {};
        validation.error.details.forEach(detail => {
          const field = detail.path[0] as string;
          fieldErrors[field] = detail.message;
        });
        
        return {
          success: false,
          message: 'Datos de entrada inválidos',
          error: 'Validación fallida',
          fieldErrors: fieldErrors
        };
      }

      // Verificar si el documento ya existe
      const existingDoc = await this.candidatoRepository.findByDocumento(candidatoData.documento);
      if (existingDoc) {
        logger.warn('Intento de crear candidato con documento duplicado', { documento: candidatoData.documento });
        return {
          success: false,
          message: 'Ya existe un candidato con este número de documento',
          error: 'Documento duplicado',
          fieldErrors: { documento: 'Ya existe un candidato con este número de documento' }
        };
      }

      // Verificar si el email ya existe
      const emailExists = await this.candidatoRepository.emailExists(candidatoData.email);
      if (emailExists) {
        logger.warn('Intento de crear candidato con email duplicado', { email: candidatoData.email });
        return {
          success: false,
          message: 'Ya existe un candidato con este email',
          error: 'Email duplicado',
          fieldErrors: { email: 'Ya existe un candidato con este email' }
        };
      }

      // Crear candidato
      const candidato = await this.candidatoRepository.create(candidatoData);
      
      logger.info('Candidato creado exitosamente', { documento: candidato.documento });
      return {
        success: true,
        message: 'Candidato creado exitosamente',
        data: candidato
      };
    } catch (error) {
      logger.error('Error en servicio al crear candidato', { error });
      return {
        success: false,
        message: 'Error interno del servidor',
        error: 'Error interno'
      };
    }
  }

  /**
   * Obtiene todos los candidatos con filtros opcionales
   * @param filters Filtros de búsqueda
   * @returns Respuesta con la lista de candidatos
   */
  async getCandidatos(filters: ICandidatoFilters = {}): Promise<ICandidatoResponse> {
    try {
      const candidatos = await this.candidatoRepository.findAll(filters);
      
      logger.info('Candidatos obtenidos exitosamente', { count: candidatos.length });
      return {
        success: true,
        message: 'Candidatos obtenidos exitosamente',
        data: candidatos
      };
    } catch (error) {
      logger.error('Error en servicio al obtener candidatos', { error });
      return {
        success: false,
        message: 'Error interno del servidor',
        error: 'Error interno'
      };
    }
  }

  /**
   * Obtiene un candidato por su documento
   * @param documento Documento del candidato
   * @returns Respuesta con el candidato encontrado
   */
  async getCandidatoByDocumento(documento: string): Promise<ICandidatoResponse> {
    try {
      const candidato = await this.candidatoRepository.findByDocumento(documento);
      
      if (!candidato) {
        logger.warn('Candidato no encontrado', { documento });
        return {
          success: false,
          message: 'Candidato no encontrado',
          error: 'Candidato no encontrado'
        };
      }

      // Asegurar que el buffer del CV es un Buffer real
      const cvAny = candidato.cv as any;
      if (cvAny && cvAny.type === 'Buffer' && Array.isArray(cvAny.data)) {
        candidato.cv = Buffer.from(cvAny.data);
      }

      logger.info('Candidato obtenido exitosamente', { documento });
      return {
        success: true,
        message: 'Candidato obtenido exitosamente',
        data: candidato
      };
    } catch (error) {
      logger.error('Error en servicio al obtener candidato por documento', { error, documento });
      return {
        success: false,
        message: 'Error interno del servidor',
        error: 'Error interno'
      };
    }
  }

  /**
   * Actualiza un candidato existente
   * @param documento Documento del candidato
   * @param candidatoData Datos a actualizar
   * @returns Respuesta con el candidato actualizado
   */
  async updateCandidato(documento: string, candidatoData: ICandidatoUpdate): Promise<ICandidatoResponse> {
    try {
      // Validar datos de entrada
      const validation = validateUpdateCandidato(candidatoData);
      if (validation.error) {
        logger.warn('Validación fallida al actualizar candidato', { 
          errors: validation.error.details,
          documento 
        });
        
        // Crear un objeto con errores específicos por campo, traducidos
        const fieldErrors: { [key: string]: string } = {};
        validation.error.details.forEach(detail => {
          const field = detail.path[0] as string;
          fieldErrors[field] = traducirMensajeCampo(field, detail.message);
        });
        
        return {
          success: false,
          message: 'Datos de entrada inválidos',
          error: 'Validación fallida',
          fieldErrors: fieldErrors
        };
      }

      // Verificar si el candidato existe
      const existingCandidato = await this.candidatoRepository.findByDocumento(documento);
      if (!existingCandidato) {
        logger.warn('Intento de actualizar candidato inexistente', { documento });
        return {
          success: false,
          message: 'Candidato no encontrado',
          error: 'Candidato no encontrado'
        };
      }

      // Si se está actualizando el email, verificar que no exista
      if (candidatoData.email) {
        const emailExists = await this.candidatoRepository.emailExists(candidatoData.email, documento);
        if (emailExists) {
          logger.warn('Intento de actualizar candidato con email duplicado', { documento, email: candidatoData.email });
          return {
            success: false,
            message: 'Ya existe otro candidato con este email',
            error: 'Email duplicado',
            fieldErrors: { email: 'Ya existe otro candidato con este email' }
          };
        }
      }

      // Actualizar candidato
      const candidato = await this.candidatoRepository.update(documento, candidatoData);
      
      logger.info('Candidato actualizado exitosamente', { documento });
      return {
        success: true,
        message: 'Candidato actualizado exitosamente',
        data: candidato
      };
    } catch (error) {
      logger.error('Error en servicio al actualizar candidato', { error, documento });
      return {
        success: false,
        message: 'Error interno del servidor',
        error: 'Error interno'
      };
    }
  }

  /**
   * Elimina un candidato por su documento
   * @param documento Documento del candidato
   * @returns Respuesta de confirmación
   */
  async deleteCandidato(documento: string): Promise<ICandidatoResponse> {
    try {
      // Verificar si el candidato existe
      const existingCandidato = await this.candidatoRepository.findByDocumento(documento);
      if (!existingCandidato) {
        logger.warn('Intento de eliminar candidato inexistente', { documento });
        return {
          success: false,
          message: 'Candidato no encontrado',
          error: 'Candidato no encontrado'
        };
      }

      // Eliminar candidato
      await this.candidatoRepository.delete(documento);
      
      logger.info('Candidato eliminado exitosamente', { documento });
      return {
        success: true,
        message: 'Candidato eliminado exitosamente'
      };
    } catch (error) {
      logger.error('Error en servicio al eliminar candidato', { error, documento });
      return {
        success: false,
        message: 'Error interno del servidor',
        error: 'Error interno'
      };
    }
  }
} 