import './accordion.css';

const Accordion = ({
  items = [],
  openItems = [], // IDs de items que deben estar abiertos
  onToggle,       // Función que se llama cuando el usuario hace clic en un header
  className = '',
}) => {
  if (items.length === 0) {
    return (
      <div className="accordion-empty">
        <p>No hay elementos para mostrar</p>
      </div>
    );
  }

  return (
    <div className={`accordion ${className}`}>
      {items.map((item, index) => {
        const itemId = item.id || `accordion-${index}`;
        const isOpen = openItems.includes(itemId);
        const hasContent = item.hasContent !== false; // Si es false, no tiene contenido
        
        return (
          <div className={`accordion-item ${!hasContent ? 'no-content' : ''}`} key={itemId}>
            {/* Header - clickeable solo si tiene contenido */}
            <div 
              className={`accordion-header ${hasContent ? 'clickable' : ''}`}
              onClick={() => hasContent && onToggle && onToggle(itemId)}
            >
              <div className="accordion-header-content">
                {item.title && (
                  <h3 className="accordion-title">{item.title}</h3>
                )}
                {item.subtitle && (
                  <p className="accordion-subtitle">{item.subtitle}</p>
                )}
                
                {/* Indicador (solo si tiene contenido) */}
                {hasContent && (
                  <span className="accordion-indicator">
                    {isOpen ? '▲' : '▼'}
                  </span>
                )}
              </div>
              
              {/* Badge de estado */}
              {item.badge && (
                <span className={`accordion-badge ${item.badge.type || 'info'}`}>
                  {item.badge.text}
                </span>
              )}
            </div>
            
            {/* Content - siempre visible si no tiene contenido, o si está abierto y tiene contenido */}
            {(!hasContent || isOpen) && (
              <div className="accordion-content">
                {item.content || (
                  <div className="no-content-message">
                    <p>No hay información disponible para esta categoría</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;