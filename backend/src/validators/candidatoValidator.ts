import Joi from 'joi';
import { ICandidatoCreate, ICandidatoUpdate } from '../types/candidato';

/**
 * Esquemas de validación para candidatos usando Joi
 * Implementa validación estricta y sanitización de datos
 */

// Esquema base para validación de email
const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .max(150)
  .required()
  .messages({
    'string.email': 'El formato del email no es válido',
    'string.max': 'El email no puede exceder 150 caracteres',
    'any.required': 'El email es obligatorio'
  });

// Esquema para crear candidato
export const createCandidatoSchema = Joi.object<ICandidatoCreate>({
  documento: Joi.string()
    .min(5)
    .max(20)
    .required()
    .messages({
      'string.base': 'El número de documento debe ser un texto',
      'string.empty': 'El número de documento es obligatorio',
      'string.min': 'El número de documento debe tener al menos 5 caracteres',
      'string.max': 'El número de documento no puede exceder 20 caracteres',
      'any.required': 'El número de documento es obligatorio'
    }),
  nombre: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre no puede estar vacío',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
  apellido: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'El apellido no puede estar vacío',
      'string.max': 'El apellido no puede exceder 100 caracteres',
      'any.required': 'El apellido es obligatorio'
    }),
  email: emailSchema,
  telefono: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
  direccion: Joi.string()
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La dirección no puede exceder 200 caracteres'
    }),
  educacion: Joi.string()
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La educación no puede exceder 200 caracteres'
    }),
  experiencia: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La experiencia no puede exceder 500 caracteres'
    }),
  cv: Joi.binary()
    .optional()
    .messages({
      'binary.base': 'El campo CV debe ser un archivo PDF o DOCX',
    })
});

// Esquema para actualizar candidato (todos los campos opcionales)
export const updateCandidatoSchema = Joi.object<ICandidatoUpdate>({
  documento: Joi.string()
    .min(5)
    .max(20)
    .required()
    .messages({
      'string.base': 'El número de documento debe ser un texto',
      'string.empty': 'El número de documento es obligatorio',
      'string.min': 'El número de documento debe tener al menos 5 caracteres',
      'string.max': 'El número de documento no puede exceder 20 caracteres',
      'any.required': 'El número de documento es obligatorio'
    }),
  nombre: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'El nombre no puede estar vacío',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
  apellido: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'El apellido no puede estar vacío',
      'string.max': 'El apellido no puede exceder 100 caracteres'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(150)
    .optional()
    .messages({
      'string.email': 'El formato del email no es válido',
      'string.max': 'El email no puede exceder 150 caracteres'
    }),
  telefono: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
  direccion: Joi.string()
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La dirección no puede exceder 200 caracteres'
    }),
  educacion: Joi.string()
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La educación no puede exceder 200 caracteres'
    }),
  experiencia: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La experiencia no puede exceder 500 caracteres'
    }),
  cv: Joi.binary()
    .optional()
    .messages({
      'binary.base': 'El campo CV debe ser un archivo PDF o DOCX',
    }),
  cvNombre: Joi.string()
    .max(200)
    .optional()
    .messages({
      'string.max': 'El nombre del archivo CV no puede exceder 200 caracteres'
    })
}).unknown(false); // No permitir campos extra como id o creadoEn

/**
 * Valida los datos de un candidato a crear
 * @param data Datos del candidato
 * @returns Resultado de la validación
 */
export const validateCreateCandidato = (data: any) => {
  return createCandidatoSchema.validate(data, { abortEarly: false });
};

/**
 * Valida los datos de un candidato a actualizar
 * @param data Datos del candidato
 * @returns Resultado de la validación
 */
export const validateUpdateCandidato = (data: any) => {
  return updateCandidatoSchema.validate(data, { abortEarly: false });
};

/**
 * Traduce los mensajes técnicos de Joi a mensajes amigables para el usuario
 */
export function traducirMensajeCampo(field: string, message: string): string {
  const traducciones: { [key: string]: string } = {
    'cv': 'El campo CV',
    'id': 'El campo ID',
    'creadoEn': 'La fecha de creación',
  };
  let campo = traducciones[field] || field;
  // Si el mensaje es de no permitido
  if (message.includes('is not allowed')) {
    return `${campo} no se puede modificar.`;
  }
  // Si el mensaje es de tipo
  if (message.includes('must be a string')) {
    return `${campo} debe ser un texto.`;
  }
  // Por defecto, devolver el mensaje original
  return message.replace(field, campo);
} 