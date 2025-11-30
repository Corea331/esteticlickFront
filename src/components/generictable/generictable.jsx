import { useState, useMemo } from "react"
import SearchBox from '../searchbox/searchbox'
import './generictable.css'

const GenericTable = ({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = 'No hay datos disponibles.',
  searchable = false,
  sortable = true,
  pagination = false,
  itemsPerPage = 10,
  className = '',
  rowClassName = '',
  onRowClick,
  actions = null,
}) => {
  const [tableState, setTableState] = useState({
    sortField: '',
    sortDirection: 'asc',
    currentPage: 1,
    searchTerm: '',
  });

  const {sortField, sortDirection, currentPage, searchTerm} = tableState;

  // Actualizar el estado de la tabla
  const updateTableState = (updates) => {
    setTableState(prev => ({ ...prev, ...updates }));
  }

  // Filtrar datos si se puede
  const filteredData = useMemo(() => {
    if(!searchable || !searchTerm ) return data;

    return data.filter(item => 
      columns.some(column =>
        String(item[column.key])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchable, columns]);

  // Ordernar los datos de la tabla
  const sortedData = useMemo(() => {
    if(!sortable || !sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if(sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredData, sortField, sortDirection, sortable]);

  // Paginación
  const paginatedData = useMemo(() => {
    if(!pagination) return sortedData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  // Cantidad total de paginas
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //  Manejo del ordenamiento
  const handleSort = (field) => {
    if(!sortable) return;

    if(sortField === field) {
      updateTableState({
        sortDirection: sortDirection === 'asc' ? 'desc' : 'asc'
      });
    } else {
      updateTableState({
        sortField: field,
        sortDirection: 'asc'
      });
    }
  };

  // Manejo del cambio de página
  const handlePageChange = (newPage) => {
    updateTableState({currentPage: newPage});
  }


  // Manejo de la busqueda
  const handleSearch = (term) => {
    updateTableState({
      searchTerm: term,
      currentPage: 1
    });
  };

  // Renderizar el icono de ordenamiento
  const renderSortIcon =(field) => {
    if(!sortable || sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '⬆️' : '⬇️';
  }

  const renderCellContent = (item, column) => {
    if(column.render) {
      return column.render(item[column.key], item);
    }

    const value = item[column.key];

    // Renderizado de columnas especiales
    if(column.type === 'rating' && typeof value === 'number') {
      return (
        <div className="rating-cell">
          <span className="rating-value">
            {value.toFixed(1)}
          </span>
          <span className="rating-stars">
            {'★'.repeat(Math.round(value))}
            {'☆'.repeat(5 - Math.round(value))}
          </span>
        </div>
      );
    }

    if(column.type === 'price' && typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }

    if(column.type === 'boolean') {
      return value ? '✅' : '❌';
    }

    if(column.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }

    if(column.type === 'array' && Array.isArray(value)) {
      return (
        <div className="array-cell">
          {value.slice(0, 3).map((item, index) => (
            <span key={index} className="array-item">
              {item.name || item}
            </span>
          ))}
          {value.length > 3 && (
            <span className="more-items">
              +{value.length - 3} más 
            </span>
          )}
        </div>
      );
    }

    if(column.type === 'link' && value) {
      return (
        <a 
          href={value} 
          target="_blank"
          rel="noopener noreferrer"
          className="link-cell"
          >
            {column.linkText || 'Visitar'}
          </a>
      );
    }

    return value || 'N/A';
  }

  if(loading) {
    return (
      <div className="generic-table-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className={`generic-table-container ${className}`}>
      {/* Barra de busqueda y acciones */}
      {(searchable || actions) && (
        <div className="table-header-actions">
          {searchable && (
            <div className="table-search-box">
              <SearchBox
                placeholder='Buscar...'
                onChange={handleSearch}
                className='compact'
                autoNavigate={false}
              />
            </div>
          )}
          {actions && (
            <div className="table-actions">
              {actions}
            </div>
          )}
        </div>
      )}
      {/* Resultados de la busqueda */}
      <div className="table-info">
        <p>Mostrando {paginatedData.length} de {filteredData.length} registros {searchTerm && `para "${searchTerm}"`}</p>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="generic-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  className={`
                    ${column.sortable !== false && sortable ? 'sortable' : ''}
                    ${sortField === column.key ? 'sorting-active' : ''}
                    ${column.className || ''}
                  `}
                  style={{ width: column.width }}
                >
                  <div className="th-content">
                    {column.title}
                    {column.sortable !== false && sortable && (
                      <span className="sort-icon">
                        {renderSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={`
                    ${rowClassName}
                    ${onRowClick ? 'clickable-row' : ''}
                  `}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) =>(
                    <td
                      key={column.key}
                    >
                      {renderCellContent(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            ): (
              <tr>
                <td colSpan={columns.length} className="no-data">{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      {pagination && totalPages > 1 && (
        <div className="table-pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Anterior
          </button>
          <span className="pagination-info">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default GenericTable;