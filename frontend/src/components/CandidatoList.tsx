import React, { useState, useEffect } from 'react';
import { ICandidato, ICandidatoFilters } from '../types/candidato';
import { FaEye, FaEdit, FaTrash, FaDownload, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

/**
 * Props del componente CandidatoList
 */
interface CandidatoListProps {
  candidatos: ICandidato[];
  onEdit: (candidato: ICandidato) => void;
  onDelete: (documento: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

/**
 * Componente de lista de candidatos
 * Implementa búsqueda, filtrado y paginación
 */
const CandidatoList: React.FC<CandidatoListProps> = ({
  candidatos,
  onEdit,
  onDelete,
  onRefresh,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCandidatos, setFilteredCandidatos] = useState<ICandidato[]>(candidatos);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatosPerPage] = useState(10);
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<'documento' | 'nombre' | 'email' | 'telefono' | 'cvNombre' | 'ultimaModificacion'>('ultimaModificacion');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtrar candidatos cuando cambie la búsqueda o la lista
  useEffect(() => {
    const filtered = candidatos.filter(candidato =>
      candidato.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCandidatos(filtered);
    setCurrentPage(1); // Resetear a la primera página cuando se filtre
  }, [candidatos, searchTerm]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedCandidatos = [...filteredCandidatos].sort((a, b) => {
    let aValue: string | number = String(a[sortField] ?? '');
    let bValue: string | number = String(b[sortField] ?? '');
    if (sortField === 'ultimaModificacion') {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    } else {
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();
    }
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Calcular candidatos para la página actual
  const indexOfLastCandidato = currentPage * candidatosPerPage;
  const indexOfFirstCandidato = indexOfLastCandidato - candidatosPerPage;
  const currentCandidatos = sortedCandidatos.slice(indexOfFirstCandidato, indexOfLastCandidato);
  const totalPages = Math.ceil(sortedCandidatos.length / candidatosPerPage);

  /**
   * Formatea la fecha de creación
   */
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Trunca el texto si es muy largo
   */
  const truncateText = (text: string | undefined, maxLength: number): string => {
    if (!text) return 'N/A';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Descarga robusta del CV usando POST y blob
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
      alert('Error al descargar el CV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y botón de refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 max-w-md">
          <label htmlFor="search" className="sr-only">
            Buscar candidatos
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Buscar por documento, nombre o contacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn-secondary flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isLoading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Información de resultados */}
      <div className="text-sm text-secondary-600">
        Mostrando {currentCandidatos.length} de {filteredCandidatos.length} candidatos
        {searchTerm && ` para "${searchTerm}"`}
      </div>

      {/* Lista de candidatos */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : currentCandidatos.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-secondary-900">No se encontraron candidatos</h3>
          <p className="mt-1 text-sm text-secondary-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Comienza añadiendo un nuevo candidato.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow-soft rounded-lg">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('documento')}>
                  Número de documento (DNI/Pasaporte)
                  {sortField === 'documento' ? (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 text-secondary-300" />}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('nombre')}>
                  Nombre
                  {sortField === 'nombre' ? (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 text-secondary-300" />}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                  Contacto
                  {sortField === 'email' ? (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 text-secondary-300" />}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('cvNombre')}>
                  CV
                  {sortField === 'cvNombre' ? (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 text-secondary-300" />}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('ultimaModificacion')}>
                  Última modificación
                  {sortField === 'ultimaModificacion' ? (sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 text-secondary-300" />}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {currentCandidatos.map((candidato) => (
                <tr key={candidato.documento} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">{candidato.documento}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{candidato.nombre} {candidato.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900">{candidato.email}</div>
                    <div className="text-sm text-secondary-500">{candidato.telefono || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {candidato.cv && candidato.cvNombre ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaDownload
                          className="inline text-primary-600 hover:text-primary-800 cursor-pointer"
                          size={18}
                          onClick={() => handleDownloadCV(candidato.documento, candidato.cvNombre || 'cv.pdf')}
                          title="Descargar CV"
                        />
                        <span className="text-sm text-secondary-900">{candidato.cvNombre}</span>
                      </span>
                    ) : (
                      <span className="text-secondary-400">CV no cargado aun</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {candidato.ultimaModificacion
                      ? format(new Date(candidato.ultimaModificacion), 'dd-MM-yyyy HH:mm:ss')
                      : candidato.creadoEn
                        ? format(new Date(candidato.creadoEn), 'dd-MM-yyyy HH:mm:ss')
                        : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-row items-center justify-center gap-3">
                      <button onClick={() => navigate('/candidatos/detalle', { state: { documento: candidato.documento } })} title="Ver">
                        <FaEye className="text-blue-600 hover:text-blue-800" size={18} />
                      </button>
                      <button onClick={() => navigate(`/candidatos/${candidato.documento}/editar`)} title="Editar">
                        <FaEdit className="text-yellow-600 hover:text-yellow-800" size={18} />
                      </button>
                      <button onClick={() => onDelete(candidato.documento)} title="Eliminar">
                        <FaTrash className="text-red-600 hover:text-red-800" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary-700">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatoList; 