import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICandidato, ICandidatoCreate, ICandidatoUpdate, IFormErrors } from '../types/candidato';

/**
 * Props del componente CandidatoForm
 */
interface CandidatoFormProps {
  candidato?: ICandidato;
  onSubmit: (data: ICandidatoCreate | ICandidatoUpdate) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Componente de formulario para crear/editar candidatos
 * Implementa validaciones en tiempo real y manejo de archivos
 */
const CandidatoForm: React.FC<CandidatoFormProps> = ({
  candidato,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
    reset
  } = useForm<ICandidatoCreate>({
    defaultValues: candidato ? {
      nombre: candidato.nombre || '',
      apellido: candidato.apellido || '',
      email: candidato.email || '',
      telefono: candidato.telefono || '',
      direccion: candidato.direccion || '',
      educacion: candidato.educacion || '',
      experiencia: candidato.experiencia || '',
      cv: undefined
    } : {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      educacion: '',
      experiencia: '',
      cv: undefined
    },
    mode: 'onChange'
  });

  /**
   * Valida el archivo CV antes de subirlo
   */
  const validateCVFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setCvError('Solo se permiten archivos PDF o DOCX');
      return false;
    }

    if (file.size > maxSize) {
      setCvError('El archivo no puede superar 5MB');
      return false;
    }

    setCvError('');
    return true;
  };

  /**
   * Maneja el cambio de archivo CV
   */
  const handleCVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateCVFile(file)) {
      setCvFile(file);
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleFormSubmit = async (data: ICandidatoCreate) => {
    try {
      let payload: any;
      if (candidato && candidato.documento) {
        // Edición: solo enviar campos editables y el documento
        payload = {
          ...data,
          documento: candidato.documento,
          cv: cvFile || undefined
        };
      } else {
        // Creación: enviar todo
        payload = {
          ...data,
          cv: cvFile || undefined
        };
      }
      await onSubmit(payload);
      reset();
      setCvFile(null);
    } catch (error: any) {
      // Mostrar errores de validación del backend
      if (error?.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          console.error(`${field}: ${message}`);
        });
      }
      // No hacer reset()
    }
  };

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
        {candidato ? 'Editar Candidato' : 'Añadir Nuevo Candidato'}
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Documento */}
        <div>
          <label htmlFor="documento" className="form-label">
            Número de documento (DNI/Pasaporte) *
          </label>
          <input
            id="documento"
            type="text"
            placeholder="Ej: 12345678A o X1234567"
            {...register('documento', {
              required: 'El número de documento es obligatorio',
              maxLength: {
                value: 20,
                message: 'El documento no puede exceder 20 caracteres'
              }
            })}
            className={`input-field ${errors.documento ? 'border-error-300' : ''}`}
            maxLength={20}
            readOnly={!!candidato?.documento}
            disabled={!!candidato?.documento}
            defaultValue={candidato?.documento || ''}
          />
          {errors.documento && (
            <p className="form-error">{errors.documento.message}</p>
          )}
        </div>

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="form-label">
              Nombre *
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej: Juan Carlos"
              {...register('nombre', {
                required: 'El nombre es obligatorio',
                maxLength: {
                  value: 100,
                  message: 'El nombre no puede exceder 100 caracteres'
                }
              })}
              className={`input-field ${errors.nombre ? 'border-error-300' : ''}`}
              maxLength={100}
            />
            {errors.nombre && (
              <p className="form-error">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="apellido" className="form-label">
              Apellido *
            </label>
            <input
              id="apellido"
              type="text"
              placeholder="Ej: González López"
              {...register('apellido', {
                required: 'El apellido es obligatorio',
                maxLength: {
                  value: 100,
                  message: 'El apellido no puede exceder 100 caracteres'
                }
              })}
              className={`input-field ${errors.apellido ? 'border-error-300' : ''}`}
              maxLength={100}
            />
            {errors.apellido && (
              <p className="form-error">{errors.apellido.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="form-label">
            Correo Electrónico *
          </label>
          <input
            id="email"
            type="email"
            placeholder="Ej: juan.gonzalez@empresa.com"
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'El formato del email no es válido'
              },
              maxLength: {
                value: 150,
                message: 'El email no puede exceder 150 caracteres'
              }
            })}
            className={`input-field ${errors.email ? 'border-error-300' : ''}`}
            maxLength={150}
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className="form-label">
            Teléfono
          </label>
          <input
            id="telefono"
            type="tel"
            placeholder="Ej: +34 612 345 678"
            {...register('telefono', {
              maxLength: {
                value: 20,
                message: 'El teléfono no puede exceder 20 caracteres'
              }
            })}
            className={`input-field ${errors.telefono ? 'border-error-300' : ''}`}
            maxLength={20}
          />
          {errors.telefono && (
            <p className="form-error">{errors.telefono.message}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="direccion" className="form-label">
            Dirección
          </label>
          <input
            id="direccion"
            type="text"
            placeholder="Ej: Calle Mayor 123, Madrid, España"
            {...register('direccion', {
              maxLength: {
                value: 200,
                message: 'La dirección no puede exceder 200 caracteres'
              }
            })}
            className={`input-field ${errors.direccion ? 'border-error-300' : ''}`}
            maxLength={200}
          />
          {errors.direccion && (
            <p className="form-error">{errors.direccion.message}</p>
          )}
        </div>

        {/* Educación */}
        <div>
          <label htmlFor="educacion" className="form-label">
            Educación
          </label>
          <textarea
            id="educacion"
            {...register('educacion', {
              maxLength: {
                value: 1000,
                message: 'La educación no puede exceder 1000 caracteres'
              }
            })}
            className={`input-field h-24 resize-y ${errors.educacion ? 'border-error-300' : ''}`}
            placeholder="Ej: Grado en Psicología - Universidad Complutense de Madrid (2015-2019)\nMáster en RRHH - Universidad Autónoma de Madrid (2020-2021)"
          />
          {errors.educacion && (
            <p className="form-error">{errors.educacion.message}</p>
          )}
        </div>

        {/* Experiencia */}
        <div>
          <label htmlFor="experiencia" className="form-label">
            Experiencia
          </label>
          <textarea
            id="experiencia"
            placeholder="Ej: Desarrollador Full Stack en TechCorp (2019-2023), Especializado en React y Node.js"
            {...register('experiencia', {
              maxLength: {
                value: 500,
                message: 'La experiencia no puede exceder 500 caracteres'
              }
            })}
            className={`input-field min-h-[100px] resize-vertical ${errors.experiencia ? 'border-error-300' : ''}`}
            maxLength={500}
          />
          {errors.experiencia && (
            <p className="form-error">{errors.experiencia.message}</p>
          )}
        </div>

        {/* CV Upload */}
        <div>
          <label htmlFor="cv" className="form-label">
            CV (PDF o DOCX)
          </label>
          <input
            id="cv"
            type="file"
            accept=".pdf,.docx"
            onChange={handleCVChange}
            className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          {cvError && (
            <p className="form-error">{cvError}</p>
          )}
          {cvFile && (
            <p className="form-help">Archivo seleccionado: {cvFile.name}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? 'Guardando...' : candidato ? 'Actualizar' : 'Crear Candidato'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidatoForm; 