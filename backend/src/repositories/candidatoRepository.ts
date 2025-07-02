import { PrismaClient } from '@prisma/client';
import { ICandidato, ICandidatoCreate, ICandidatoUpdate, ICandidatoFilters } from '../types/candidato';
import Database from '../config/database';
import logger from '../config/logger';

/**
 * Repositorio para operaciones de candidatos
 * Implementa el patrón Repository para abstraer el acceso a datos
 * Siguiendo principios SOLID y clean code
 */
export class CandidatoRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = Database.getInstance();
  }

  /**
   * Crea un nuevo candidato en la base de datos
   * @param candidatoData Datos del candidato a crear
   * @returns Candidato creado
   */
  async create(candidatoData: ICandidatoCreate): Promise<ICandidato> {
    try {
      logger.info('Creando nuevo candidato', { email: candidatoData.email });
      
      const candidato = await this.prisma.candidato.create({
        data: candidatoData
      });

      logger.info('Candidato creado exitosamente', { id: candidato.id });
      return candidato;
    } catch (error) {
      logger.error('Error al crear candidato', { error, email: candidatoData.email });
      throw error;
    }
  }

  /**
   * Obtiene todos los candidatos con filtros opcionales
   * @param filters Filtros de búsqueda
   * @returns Lista de candidatos
   */
  async findAll(filters: ICandidatoFilters = {}): Promise<ICandidato[]> {
    try {
      logger.info('Obteniendo candidatos', { filters });
      
      const where: any = {};
      
      if (filters.nombre) {
        where.nombre = { contains: filters.nombre, mode: 'insensitive' };
      }
      
      if (filters.apellido) {
        where.apellido = { contains: filters.apellido, mode: 'insensitive' };
      }
      
      if (filters.email) {
        where.email = { contains: filters.email, mode: 'insensitive' };
      }

      const candidatos = await this.prisma.candidato.findMany({
        where,
        take: filters.limit || 50,
        skip: filters.offset || 0,
        orderBy: { creadoEn: 'desc' }
      });

      logger.info('Candidatos obtenidos exitosamente', { count: candidatos.length });
      return candidatos;
    } catch (error) {
      logger.error('Error al obtener candidatos', { error });
      throw error;
    }
  }

  /**
   * Obtiene un candidato por su documento
   * @param documento Documento del candidato
   * @returns Candidato encontrado o null
   */
  async findByDocumento(documento: string): Promise<ICandidato | null> {
    try {
      logger.info('Buscando candidato por documento', { documento });
      
      const candidato = await this.prisma.candidato.findUnique({
        where: { documento }
      });

      if (candidato) {
        logger.info('Candidato encontrado', { documento });
      } else {
        logger.warn('Candidato no encontrado', { documento });
      }

      return candidato;
    } catch (error) {
      logger.error('Error al buscar candidato por documento', { error, documento });
      throw error;
    }
  }

  /**
   * Actualiza un candidato existente
   * @param documento Documento del candidato a actualizar
   * @param candidatoData Datos a actualizar
   * @returns Candidato actualizado
   */
  async update(documento: string, candidatoData: ICandidatoUpdate): Promise<ICandidato> {
    try {
      logger.info('Actualizando candidato', { documento });
      
      const candidato = await this.prisma.candidato.update({
        where: { documento },
        data: candidatoData
      });

      logger.info('Candidato actualizado exitosamente', { documento });
      return candidato;
    } catch (error) {
      logger.error('Error al actualizar candidato', { error, documento });
      throw error;
    }
  }

  /**
   * Elimina un candidato por su documento
   * @param documento Documento del candidato a eliminar
   * @returns true si se eliminó correctamente
   */
  async delete(documento: string): Promise<boolean> {
    try {
      logger.info('Eliminando candidato', { documento });
      
      await this.prisma.candidato.delete({
        where: { documento }
      });

      logger.info('Candidato eliminado exitosamente', { documento });
      return true;
    } catch (error) {
      logger.error('Error al eliminar candidato', { error, documento });
      throw error;
    }
  }

  /**
   * Verifica si existe un candidato con el email especificado
   * @param email Email a verificar
   * @param excludeDocumento Documento del candidato a excluir (para updates)
   * @returns true si existe, false en caso contrario
   */
  async emailExists(email: string, excludeDocumento?: string): Promise<boolean> {
    try {
      const where: any = { email };
      
      if (excludeDocumento) {
        where.documento = { not: excludeDocumento };
      }

      const count = await this.prisma.candidato.count({ where });
      return count > 0;
    } catch (error) {
      logger.error('Error al verificar existencia de email', { error, email });
      throw error;
    }
  }
} 