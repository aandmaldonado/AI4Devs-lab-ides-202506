/**
 * Tipos y interfaces para el dominio de Candidatos
 * Siguiendo principios de Domain-Driven Design (DDD)
 */

export interface ICandidato {
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string | null;
  direccion?: string | null;
  educacion?: string | null;
  experiencia?: string | null;
  cv?: Buffer | null;
  creadoEn?: Date;
}

export interface ICandidatoCreate {
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  educacion?: string;
  experiencia?: string;
  cv?: Buffer;
  cvNombre?: string;
}

export interface ICandidatoUpdate {
  documento: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  educacion?: string;
  experiencia?: string;
  cv?: Buffer;
  cvNombre?: string;
}

/**
 * Respuesta estándar para operaciones de candidatos
 */
export interface ICandidatoResponse {
  success: boolean;
  message: string;
  data?: ICandidato | ICandidato[];
  error?: string;
  fieldErrors?: { [key: string]: string };
}

/**
 * Filtros para búsqueda de candidatos
 */
export interface ICandidatoFilters {
  nombre?: string;
  apellido?: string;
  email?: string;
  limit?: number;
  offset?: number;
} 