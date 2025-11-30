import GenericTable from '../../components/generictable/generictable'
import { useBusinesses } from '../../hooks/apihooks'
import './businesspage.css'

const BusinessesPage = () => {
  const { data: businesses, isLoading, error } = useBusinesses();

  const columns = [
    {
      key: 'business_name',
      title: 'Nombre del Negocio',
      sortable: true,
      width: '20%',
    },

    {
      key: 'specialty',
      title: 'Especialidad',
      sortable: true,
      width: '15%',
    },

    {
      key: 'avarage_rating',
      title: 'Calificación',
      sortable: false,
      type: 'rating',
      width: '15%',
    },

    {
      key: 'total_reviews',
      title: 'Reseñas',
      sortable: true,
      width: '10%',
    },

    {
      key: 'phone',
      title: 'Telefono',
      width: '15%',
    },

    {
      key: 'address',
      title: 'Dirección',
      width: '25%',
    },
  ]

  // Manejo de errores
  if(error){
    return (
      <div className="error-container">
        <h2>Error al cargar los negocios</h2>
        <p>{ error.message }</p>
        <button onClick={() => window.location.reload()}>
          <i className="bi bi-arrow-clockwise"></i> Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="businesses-page">
      <header>
        <h1>Negocios Registrados</h1>
        <p>Descubre y conecta con los mejores profesionales de belleza y bienestar cerca de ti</p>
      </header>
      <GenericTable
        data={businesses || []}
        columns={columns}
        loading={isLoading}
        searchable={true}
        sortable={true}
        pagination={true}
        itemsPerPage={10}
        emptyMessage='No se encontraron negocios registrados'
        className='businesses-table'
        onRowClick={(business) => {console.log('Negocio clickeado: ', business)}}
      />
    </div>
  )
}

export default BusinessesPage;