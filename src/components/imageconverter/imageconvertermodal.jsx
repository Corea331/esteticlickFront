import { useState } from 'react';
import { 
  X, Check, Download, RotateCw, ZoomIn, 
  ZoomOut, Settings, FileImage, Image as ImageIcon
} from 'lucide-react';
import './imageconvertermodal.css';

const ImageConverterModal = ({ converter, title = "Optimizar Imagen" }) => {
  const { 
    conversionResult, 
    originalFile, 
    previewUrl,
    conversionOptions,
    isConverting,
    isOpen,
    updateOptions,
    acceptConversion,
    closeConverter
  } = converter;

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');

  if (!isOpen) return null;

  // Calcular estadísticas
  const stats = conversionResult ? {
    originalSize: conversionResult.original.sizeMB,
    convertedSize: conversionResult.converted.sizeMB,
    reduction: conversionResult.converted.reduction,
    format: conversionOptions.format.toUpperCase(),
    dimensions: `${conversionOptions.maxWidth}×${conversionOptions.maxHeight}px`
  } : null;

  const handleAccept = () => {
    acceptConversion();
  };

  const handleCancel = () => {
    closeConverter();
  };

  return (
    <div className="image-converter-modal-overlay">
      <div className="image-converter-modal">
        <div className="image-converter-modal-content border-0 shadow-lg" style={{ maxWidth: '95%', width: '1200px' }}>
          
          {/* Header */}
          <div className="image-converter-modal-header px-4 py-3">
            <h5 className="modal-title d-flex align-items-center mb-0">
              <ImageIcon size={20} className="me-2" />
              {title}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={handleCancel}
              disabled={isConverting}
              aria-label="Cerrar"
            />
          </div>

          {/* Body */}
          <div className="image-converter-modal-body">
            <div className="row g-0 h-100">
              
              {/* Panel izquierdo - Preview */}
              <div className="col-md-7 border-end d-flex flex-column">
                <div className="p-3 flex-grow-1 d-flex flex-column">
                  {/* Controles de vista */}
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <div className="btn-group btn-group-sm flex-shrink-0">
                      <button 
                        className={`btn ${activeTab === 'preview' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('preview')}
                        disabled={isConverting}
                      >
                        <ZoomIn size={14} className="me-1" /> Vista previa
                      </button>
                      <button 
                        className={`btn ${activeTab === 'compare' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('compare')}
                        disabled={isConverting}
                      >
                        <FileImage size={14} className="me-1" /> Comparar
                      </button>
                    </div>
                    
                    <div className="btn-group btn-group-sm flex-shrink-0">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                        disabled={zoom <= 0.5 || isConverting}
                        aria-label="Zoom out"
                      >
                        <ZoomOut size={14} />
                      </button>
                      <button className="btn btn-outline-secondary disabled px-3" disabled>
                        {Math.round(zoom * 100)}%
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
                        disabled={zoom >= 3 || isConverting}
                        aria-label="Zoom in"
                      >
                        <ZoomIn size={14} />
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setRotation(prev => (prev + 90) % 360)}
                        disabled={isConverting}
                        aria-label="Rotar"
                      >
                        <RotateCw size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Preview de imagen */}
                  <div className="image-preview-container flex-grow-1 mb-3">
                    {activeTab === 'preview' ? (
                      conversionResult?.preview ? (
                        <div className="h-100 d-flex align-items-center justify-content-center">
                          <img 
                            src={conversionResult.preview}
                            alt="Imagen convertida"
                            className="img-fluid preview-image"
                            style={{ 
                              transform: `scale(${zoom}) rotate(${rotation}deg)`,
                              maxHeight: '400px',
                              maxWidth: '100%'
                            }}
                          />
                        </div>
                      ) : previewUrl ? (
                        <div className="text-center p-5 h-100 d-flex flex-column align-items-center justify-content-center">
                          <div className="spinner-border text-primary mb-3"></div>
                          <p className="text-muted">Procesando imagen...</p>
                        </div>
                      ) : null
                    ) : (
                      <div className="row g-3 h-100">
                        <div className="col-6 d-flex flex-column">
                          <h6 className="text-center small text-muted mb-2">Original</h6>
                          <div className="flex-grow-1 d-flex flex-column">
                            {previewUrl && (
                              <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                                <img 
                                  src={previewUrl}
                                  alt="Original"
                                  className="img-fluid border rounded comparison-image"
                                  style={{ maxHeight: '300px', maxWidth: '100%' }}
                                />
                              </div>
                            )}
                            {originalFile && (
                              <div className="text-center mt-2">
                                <small className="text-muted d-block text-truncate">
                                  {originalFile.name}
                                </small>
                                <small className="text-muted">
                                  {stats?.originalSize} MB
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-6 d-flex flex-column">
                          <h6 className="text-center small text-muted mb-2">Optimizado ({conversionOptions.format.toUpperCase()})</h6>
                          <div className="flex-grow-1 d-flex flex-column">
                            {conversionResult?.preview ? (
                              <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                                <img 
                                  src={conversionResult.preview}
                                  alt="Convertida"
                                  className="img-fluid border rounded comparison-image"
                                  style={{ maxHeight: '300px', maxWidth: '100%' }}
                                />
                              </div>
                            ) : (
                              <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="spinner-border spinner-border-sm"></div>
                              </div>
                            )}
                            {conversionResult && (
                              <div className="text-center mt-2">
                                <small className="text-success d-block fw-bold">
                                  {stats?.convertedSize} MB
                                </small>
                                <small className="text-success">
                                  ↓ {stats?.reduction}% menos
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Información del archivo */}
                  {originalFile && (
                    <div className="file-info-container mt-auto">
                      <h6 className="mb-2 d-flex align-items-center">
                        <FileImage size={16} className="me-2" />
                        Información del archivo
                      </h6>
                      <div className="row small">
                        <div className="col-6">
                          <div className="text-muted">Nombre:</div>
                          <div className="text-truncate">{originalFile.name}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Formato original:</div>
                          <div>{originalFile.type.split('/')[1]?.toUpperCase() || 'Desconocido'}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel derecho - Configuración */}
              <div className="col-md-5 d-flex flex-column">
                <div className="p-3 flex-grow-1 d-flex flex-column">
                  <h6 className="mb-3 d-flex align-items-center">
                    <Settings size={18} className="me-2" />
                    Configuración
                  </h6>

                  <div className="flex-grow-1 overflow-auto">
                    {/* Formato */}
                    <div className="mb-4">
                      <label className="form-label small fw-bold mb-2">Formato de salida</label>
                      <div className="btn-group w-100" role="group">
                        {['webp', 'jpeg', 'png'].map(format => (
                          <button
                            key={format}
                            type="button"
                            className={`btn btn-sm ${conversionOptions.format === format ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => updateOptions({ format })}
                            disabled={isConverting}
                          >
                            {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <small className="text-muted mt-1 d-block">
                        {conversionOptions.format === 'webp' && '✅ Mejor compresión (recomendado)'}
                        {conversionOptions.format === 'jpeg' && '✅ Amplia compatibilidad'}
                        {conversionOptions.format === 'png' && '✅ Calidad sin pérdida'}
                      </small>
                    </div>

                    {/* Calidad */}
                    <div className="mb-4">
                      <label className="form-label small fw-bold d-flex justify-content-between mb-2">
                        <span>Calidad: {conversionOptions.quality}%</span>
                        <span className={`fw-bold ${conversionOptions.quality > 80 ? 'text-success' : conversionOptions.quality > 60 ? 'text-warning' : 'text-danger'}`}>
                          {conversionOptions.quality > 80 ? 'Alta' : conversionOptions.quality > 60 ? 'Media' : 'Baja'}
                        </span>
                      </label>
                      <input
                        type="range"
                        className="form-range quality-slider w-100"
                        min="10"
                        max="100"
                        step="5"
                        value={conversionOptions.quality}
                        onChange={(e) => updateOptions({ quality: parseInt(e.target.value) })}
                        disabled={isConverting}
                      />
                      <div className="d-flex justify-content-between small text-muted mt-1">
                        <span>Peor calidad</span>
                        <span>Mejor calidad</span>
                      </div>
                    </div>

                    {/* Dimensiones */}
                    <div className="mb-4">
                      <label className="form-label small fw-bold mb-2">
                        Dimensiones máximas: {conversionOptions.maxWidth}×{conversionOptions.maxHeight}px
                      </label>
                      <div className="btn-group w-100 mb-2 flex-wrap" role="group">
                        {[
                          { label: 'Pequeño', width: 800, height: 800 },
                          { label: 'Mediano', width: 1200, height: 1200 },
                          { label: 'Grande', width: 1920, height: 1080 },
                          { label: 'Original', width: 9999, height: 9999 }
                        ].map(size => (
                          <button
                            key={size.label}
                            type="button"
                            className={`btn btn-sm ${conversionOptions.maxWidth === size.width ? 'btn-primary' : 'btn-outline-secondary'} flex-grow-1`}
                            onClick={() => updateOptions({ maxWidth: size.width, maxHeight: size.height })}
                            disabled={isConverting}
                            style={{ minWidth: '80px', margin: '2px' }}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Opciones adicionales */}
                    <div className="mb-4">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="keepOriginal"
                          checked={conversionOptions.keepOriginal}
                          onChange={(e) => updateOptions({ keepOriginal: e.target.checked })}
                          disabled={isConverting}
                        />
                        <label className="form-check-label small ms-2" htmlFor="keepOriginal">
                          Mantener archivo original
                        </label>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    {stats && (
                      <div className="alert alert-info stats-container mb-3">
                        <h6 className="mb-2">Resumen de optimización</h6>
                        <div className="row small">
                          <div className="col-6">
                            <div className="text-muted">Original:</div>
                            <div className="fw-bold">{stats.originalSize} MB</div>
                          </div>
                          <div className="col-6">
                            <div className="text-muted">Optimizado:</div>
                            <div className="fw-bold text-success">{stats.convertedSize} MB</div>
                          </div>
                          <div className="col-12 mt-2">
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                role="progressbar" 
                                style={{ width: `${100 - parseFloat(stats.reduction)}%` }}
                              />
                            </div>
                            <div className="text-center small text-success mt-2">
                              Ahorro de <strong>{stats.reduction}%</strong> en espacio
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tiempo estimado */}
                    {isConverting && (
                      <div className="alert alert-warning">
                        <div className="d-flex align-items-center">
                          <div className="spinner-border spinner-border-sm me-2"></div>
                          <span>Procesando imagen...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="image-converter-modal-footer px-4 py-3">
            <div className="d-flex justify-content-between align-items-center w-100 flex-wrap gap-2">
              <div>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancel}
                  disabled={isConverting}
                >
                  <X size={16} className="me-1" />
                  Cancelar
                </button>
              </div>
              
              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    // Descargar preview
                    if (conversionResult?.preview) {
                      const link = document.createElement('a');
                      link.href = conversionResult.preview;
                      link.download = `optimizada.${conversionOptions.format}`;
                      link.click();
                    }
                  }}
                  disabled={!conversionResult || isConverting}
                >
                  <Download size={16} className="me-1" />
                  Descargar preview
                </button>
                
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleAccept}
                  disabled={!conversionResult || isConverting}
                >
                  <Check size={16} className="me-1" />
                  Aceptar y continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageConverterModal;