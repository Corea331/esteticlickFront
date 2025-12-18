import { useState, useMemo } from 'react'
import SearchBox from '../../components/searchbox/searchbox'
import Accordion from '../../components/accordion/accordion'
import GenericTable from '../../components/generictable/generictable'
import { navigateTo } from '../../utils/navigation.js'
import { useServices } from '../../hooks'
import { useBusinesses } from '../../hooks'
import './servicespage.css'

const ServicesPage = () => {
  // Obtener servicios generales
  const { data: services, isLoading: loadingServices } = useServices();
  // Obtener negocios
  const { data: businesses, isLoading: loadingBusinesses } = useBusinesses();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState([]);
  
  const isLoading = loadingServices || loadingBusinesses;

  // Preparar items para el acordeón
  const accordionItems = useMemo(() => {
    if (!services || !businesses) return [];
    
    return services.map(service => {
      // Filtrar negocios que tienen esta especialidad
      const relatedBusinesses = businesses.filter(
        business => business.specialty === service.slug
      );
      
      const hasBusinesses = relatedBusinesses.length > 0;
      
      return {
        id: service.id.toString(),
        title: service.name,
        subtitle: service.description,
        hasContent: hasBusinesses,
        badge: {
          text: hasBusinesses ? `${relatedBusinesses.length} negocio(s)` : 'Sin negocios',
          type: hasBusinesses ? 'success' : 'warning'
        },
        // Contenido: si no tiene negocios, mensaje; si tiene, tabla
        content: hasBusinesses ? (
          <GenericTable
            data={relatedBusinesses}
            columns={[
              { key: 'business_name', title: 'Nombre del Negocio', sortable: true },
              { key: 'phone', title: 'Teléfono' },
              { key: 'address', title: 'Dirección' },
              { key: 'average_rating', title: 'Calificación', type: 'rating' },
              { key: 'total_reviews', title: 'Reseñas' }
            ]}
            searchable={true}
            pagination={true}
            itemsPerPage={5}
            emptyMessage="No se encontraron negocios para este servicio"
            onRowClick={(business) => {
              // Navegar a la página del negocio
              navigateTo(`/business/${business.id}`);
            }}
          />
        ) : (
          <div className="no-businesses-message">
            <div className="text-center py-4">
              <i className="bi bi-shop display-1 text-muted mb-3"></i>
              <h5>No hay negocios registrados para este servicio</h5>
              <p className="text-muted">
                Pronto habrá profesionales ofreciendo {service.name.toLowerCase()}.
              </p>
            </div>
          </div>
        )
      };
    });
  }, [services, businesses]);

  // Filtrar items basado en búsqueda
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return accordionItems;
    
    const term = searchTerm.toLowerCase().trim();
    
    return accordionItems.filter(item => {
      // Buscar en título
      if (item.title.toLowerCase().includes(term)) return true;
      
      // Buscar en subtítulo
      if (item.subtitle?.toLowerCase().includes(term)) return true;
      
      return false;
    });
  }, [accordionItems, searchTerm]);

  // Manejar búsqueda - abrir items que coincidan
  const handleSearch = (term) => {
    setSearchTerm(term);
    
    if (term.trim()) {
      // Encontrar items que coinciden con la búsqueda
      const matchingItemIds = accordionItems
        .filter(item => {
          const matchesTitle = item.title.toLowerCase().includes(term.toLowerCase());
          const matchesSubtitle = item.subtitle?.toLowerCase().includes(term.toLowerCase());
          return matchesTitle || matchesSubtitle;
        })
        .map(item => item.id);
      
      setOpenItems(matchingItemIds);
    } else {
      // Si no hay búsqueda, cerrar todos los que tienen contenido
      const itemsWithNoContent = accordionItems
        .filter(item => !item.hasContent)
        .map(item => item.id);
      setOpenItems(itemsWithNoContent);
    }
  };

  // Manejar clic en header (toggle manual)
  const handleToggle = (itemId) => {
    setOpenItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Por defecto, abrir items sin contenido
  useState(() => {
    if (accordionItems.length > 0) {
      const itemsWithNoContent = accordionItems
        .filter(item => !item.hasContent)
        .map(item => item.id);
      setOpenItems(itemsWithNoContent);
    }
  }, [accordionItems]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando servicios...</p>
      </div>
    );
  }

  return (
    <div className="services-page">
      <header className="services-header">
        <h1>Servicios Disponibles</h1>
        <p>Explora todos los servicios y encuentra los mejores profesionales</p>
      </header>

      <div className="services-search-container">
        <SearchBox
          placeholder="Buscar servicios..."
          onSearch={handleSearch}
          className="services-searchbox"
        />
        
        {searchTerm && (
          <div className="search-results-info">
            <p>
              {filteredItems.length} {filteredItems.length === 1 ? 'servicio encontrado' : 'servicios encontrados'} 
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>

      <Accordion
        items={filteredItems}
        openItems={openItems}
        onToggle={handleToggle}
        className="services-accordion"
      />
    </div>
  );
};

export default ServicesPage;