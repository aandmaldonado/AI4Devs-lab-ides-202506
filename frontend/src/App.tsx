import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import CandidatoForm from './components/CandidatoForm';
import CandidatoList from './components/CandidatoList';
import { ICandidato, ICandidatoCreate, ICandidatoUpdate } from './types/candidato';
import apiService from './services/api';
import { format } from 'date-fns';

/**
 * Componente principal de la aplicación ATS
 * Maneja el estado global y la lógica de negocio
 */
function App() {
  const [candidatos, setCandidatos] = useState<ICandidato[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidato, setEditingCandidato] = useState<ICandidato | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  /**
   * Carga los candidatos desde la API
   */
  const loadCandidatos = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getCandidatos();
      if (response.success && response.data) {
        setCandidatos(response.data);
      } else {
        toast.error(response.message || 'Error al cargar candidatos');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Crea un nuevo candidato
   */
  const handleCreateCandidato = async (data: ICandidatoCreate) => {
    setIsSubmitting(true);
    try {
      const response = await apiService.createCandidato(data);
      if (response.success) {
        toast.success('Candidato creado exitosamente');
        setShowForm(false);
        loadCandidatos(); // Recargar la lista
      } else {
        // Mostrar errores específicos por campo si están disponibles
        if (response.fieldErrors) {
          Object.entries(response.fieldErrors).forEach(([field, error]) => {
            toast.error(`${field}: ${error}`);
          });
        } else {
          toast.error(response.message || 'Error al crear candidato');
        }
      }
    } catch (error: any) {
      // Manejar errores con fieldErrors
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, errorMsg]) => {
          toast.error(`${field}: ${errorMsg}`);
        });
      } else {
        toast.error(error.message || 'Error al crear candidato');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Actualiza un candidato existente
   */
  const handleUpdateCandidato = async (data: ICandidatoUpdate) => {
    if (!editingCandidato?.documento) return;
    try {
      const updatePayload: ICandidatoUpdate = {
        ...data,
      };
      const response = await apiService.updateCandidato(editingCandidato.documento, updatePayload);
      if (response.success) {
        toast.success('Candidato actualizado exitosamente');
        setEditingCandidato(null);
        loadCandidatos();
      } else {
        toast.error(response.message || 'Error al actualizar candidato');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar candidato');
    }
  };

  /**
   * Elimina un candidato
   */
  const handleDeleteCandidato = async (documento: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este candidato?')) {
      return;
    }
    try {
      const response = await apiService.deleteCandidato(documento);
      if (response.success) {
        toast.success('Candidato eliminado exitosamente');
        loadCandidatos();
      } else {
        toast.error(response.message || 'Error al eliminar candidato');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar candidato');
    }
  };

  /**
   * Maneja la edición de un candidato
   */
  const handleEditCandidato = (candidato: ICandidato) => {
    setEditingCandidato(candidato);
  };

  /**
   * Maneja la cancelación del formulario
   */
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCandidato(null);
  };

  /**
   * Maneja el envío del formulario (crear o actualizar)
   */
  const handleFormSubmit = async (data: ICandidatoCreate | ICandidatoUpdate) => {
    if (editingCandidato) {
      await handleUpdateCandidato(data as ICandidatoUpdate);
    } else {
      await handleCreateCandidato(data as ICandidatoCreate);
    }
  };

  // Cargar candidatos al montar el componente
  useEffect(() => {
    loadCandidatos();
  }, []);

  // Recargar candidatos automáticamente al volver a la ruta principal
  useEffect(() => {
    if (location.pathname === '/') {
      loadCandidatos();
    }
  }, [location.pathname]);

  // Placeholder para página de detalle
  const CandidatoDetalle: React.FC = () => {
    const location = useLocation();
    const documento = location.state?.documento;
    const [candidato, setCandidato] = useState<ICandidato | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchCandidato = async () => {
        if (!documento) return;
        setLoading(true);
        try {
          const response = await apiService.getCandidatoByDocumento(documento);
          if (response.success && response.data) {
            setCandidato(response.data as ICandidato);
          } else {
            toast.error(response.message || 'No se pudo cargar el candidato');
          }
        } catch (error: any) {
          toast.error(error.message || 'Error de conexión');
        } finally {
          setLoading(false);
        }
      };
      fetchCandidato();
    }, [documento]);

    const handleDownloadCV = async (documento: string, cvNombre: string) => {
      try {
        const response = await fetch('/api/candidatos/descargar-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documento })
        });
        if (!response.ok) throw new Error('No se pudo descargar el archivo');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = cvNombre;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        toast.error('Error al descargar el CV');
      }
    };

    if (!documento) return <div className="card p-6">No se proporcionó documento.</div>;
    if (loading) return <div className="card p-6">Cargando...</div>;
    if (!candidato) return <div className="card p-6">Candidato no encontrado</div>;

    return (
      <div className="card p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Detalle del Candidato</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><b>Número de documento:</b> {candidato.documento}</div>
          <div><b>Nombre:</b> {candidato.nombre} {candidato.apellido}</div>
          <div><b>Email:</b> {candidato.email}</div>
          <div><b>Teléfono:</b> {candidato.telefono || '-'}</div>
          <div><b>Dirección:</b> {candidato.direccion || '-'}</div>
          <div><b>Educación:</b> {candidato.educacion || '-'}</div>
          <div><b>Experiencia:</b> {candidato.experiencia || '-'}</div>
          <div>{candidato.cv && candidato.cvNombre ? (
            <button className="btn-primary" onClick={() => handleDownloadCV(candidato.documento, candidato.cvNombre || 'cv.pdf')}>Descargar CV</button>
          ) : 'CV no cargado aun'}</div>
          <div><b>Fecha de creación:</b> {candidato.creadoEn ? new Date(candidato.creadoEn).toLocaleDateString() : '-'}</div>
          <div><b>Última modificación:</b> {candidato.ultimaModificacion ? format(new Date(candidato.ultimaModificacion), 'dd-MM-yyyy HH:mm:ss') : candidato.creadoEn ? format(new Date(candidato.creadoEn), 'dd-MM-yyyy HH:mm:ss') : '-'}</div>
        </div>
        <div className="flex gap-4 mt-4">
          <button className="btn-primary" onClick={() => navigate(`/candidatos/${candidato.documento}/editar`)}>Editar</button>
          <button className="btn-secondary" onClick={() => navigate('/')}>Volver</button>
        </div>
      </div>
    );
  };

  // Página de edición de candidato
  const CandidatoEditar: React.FC = () => {
    const { documento } = useParams<{ documento: string }>();
    const [candidato, setCandidato] = useState<ICandidato | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchCandidato = async () => {
        if (!documento) return;
        setLoading(true);
        try {
          const response = await apiService.getCandidatoByDocumento(documento);
          if (response.success && response.data) {
            setCandidato(response.data as ICandidato);
          } else {
            toast.error(response.message || 'No se pudo cargar el candidato');
          }
        } catch (error: any) {
          toast.error(error.message || 'Error de conexión');
        } finally {
          setLoading(false);
        }
      };
      fetchCandidato();
    }, [documento]);

    const handleUpdate = async (data: ICandidatoUpdate) => {
      if (!documento) return;
      setIsSubmitting(true);
      try {
        const response = await apiService.updateCandidato(documento, data);
        if (response.success) {
          toast.success('Candidato actualizado exitosamente');
          navigate(`/candidatos/${documento}`);
        } else {
          toast.error(response.message || 'Error al actualizar candidato');
        }
      } catch (error: any) {
        toast.error(error.message || 'Error al actualizar candidato');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (loading) return <div className="card p-6">Cargando...</div>;
    if (!candidato) return <div className="card p-6">Candidato no encontrado</div>;

    return (
      <div className="card p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Editar Candidato</h2>
        <CandidatoForm
          candidato={candidato}
          onSubmit={handleUpdate}
          onCancel={() => navigate('/')}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Sistema ATS - LTI
              </h1>
              <p className="text-secondary-600">
                Gestión de Candidatos
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Añadir Candidato
              </button>
            )}
          </div>
        </div>
      </header>
      {/* Main Content con rutas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={showForm ? (
            <CandidatoForm
              candidato={editingCandidato || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          ) : (
            <CandidatoList
              candidatos={candidatos}
              onEdit={handleEditCandidato}
              onDelete={handleDeleteCandidato}
              onRefresh={loadCandidatos}
              isLoading={isLoading}
            />
          )} />
          <Route path="/candidatos/detalle" element={<CandidatoDetalle />} />
          <Route path="/candidatos/:documento/editar" element={<CandidatoEditar />} />
        </Routes>
      </main>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
