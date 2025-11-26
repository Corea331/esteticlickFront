import Carousel from '../../components/presentationcarousel/presentationcarousel'
import './home.css'


function Home() {
  return(
    <section className='container-fluid py-5 px-4'>
      <div className='presentacion p-4'>
        <h1 className='pb-5'>Sistema Integral de Gestión para Estéticas</h1>
        <h3 className='pb-4'>Optimiza la administración de turnos, clientes y servicios; con nuestra plataforma profesional.</h3>
        <br />
        <h2 className='pb-4'>¿Por qué elegir nuestro sistema?</h2>
        <h4 className='pb-4'>Descubre las herramienteas diseñadas para potenciar el crecimiento de tu estética.</h4>
        <br />
        <div className='p-5'>
          <h3 className='pb-4'><i className="bi bi-calendar-week-fill"></i> Gestión de turnos</h3>
          <p>Gestionamos el ciclo completo de reservas, mediante un flujo automatizado que inicia con la solicitud del cliente, se consolida con confirmaciones instantáneas, permite reprogramaciones flexibles y facilita cancelaciones asistidas; todo respaldado por notificaciones automáticas bidireccionales.</p>
          <p>Experimenta la evolución en la administración de turnos con nuestra plataforma inteligente. Gestionamos el ciclo completo de reservas mediante un flujo automatizado que inicia con la solicitud del cliente, se consolida con confirmaciones instantáneas, permite reprogramaciones flexibles y facilita cancelaciones asistidas, todo respaldado por notificaciones automáticas bidireccionales.</p>
          <ul className=' list-group-numbered'>
            <li><i className="bi bi-calendar-plus-fill"></i> Agenda inteligente para asignación eficiente de horarios</li>
            <li><i className="bi bi-calendar-check-fill"></i> Notificaciones automáticas a clientes y a la estética en cada acción</li>
            <li><i className="bi bi-calendar-month-fill"></i> Reducción de tiempos muertos y optimización de la capacidad instalada</li>
          </ul>
        </div>
        <div className='p-5'>
          <h3 className='pb-4'><i className="bi bi-toggles2"></i> Control de Clientes</h3>
          <p>Manten un registro detallado de cada cliente.</p>
          <ul className=' list-group-numbered'>
            <li><i className="bi bi-menu-button-fill"></i> Historial completo de servicios realizados</li>
            <li><i className="bi bi-menu-button-fill"></i> Preferencias y observaciones personalizadas</li>
            <li><i className="bi bi-menu-button-fill"></i> Seguimiento de fidelización y recordatorios automáticos</li>
          </ul>
        </div>
        <div className='p-5'>
        <h3 className='pb-4'><i className="bi bi-question-octagon-fill"></i> ¿Cómo funciona nuestra gestión de turnos?</h3>
        <p>Proceso completo y automatizado</p>
          <div className='d-flex justify-content-center'>
            <Carousel />
          </div>
        </div>
        <div className='p-3'>
        <h3 className='pb-4'><i className="bi bi-hand-thumbs-up-fill"></i> Beneficios Clave</h3>
        <div className="row ">
            <div className="col-12 col-sm-12 col-md-6 col-xl-3">
                <div className="card border-0 shadow-sm h-100 text-center">
                    <div className="card-body p-4">
                        <div className="feature-icon bg-success bg-opacity-10 text-success mb-3">
                            <i className="bi bi-bell fs-2"></i>
                        </div>
                        <h5 className="fw-bold mb-3">Reducción de Ausentismo</h5>
                        <p className="text-muted">Recordatorios automáticos que disminuyen las inasistencias hasta en un 60%</p>
                    </div>
                </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-xl-3">
                <div className="card border-0 shadow-sm h-100 text-center">
                    <div className="card-body p-4">
                        <div className="feature-icon bg-primary bg-opacity-10 text-primary mb-3">
                            <i className="bi bi-calendar-week fs-2"></i>
                        </div>
                        <h5 className="fw-bold mb-3">Agenda Optimizada</h5>
                        <p className="text-muted">Asignación inteligente que maximiza la ocupación y reduce tiempos muertos</p>
                    </div>
                </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-xl-3">
                <div className="card border-0 shadow-sm h-100 text-center">
                    <div className="card-body p-4">
                        <div className="feature-icon bg-info bg-opacity-10 text-info mb-3">
                            <i className="bi bi-chat-heart fs-2"></i>
                        </div>
                        <h5 className="fw-bold mb-3">Experiencia Mejorada</h5>
                        <p className="text-muted">Comunicación constante que incrementa la satisfacción y fidelización</p>
                    </div>
                </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-xl-3">
                <div className="card border-0 shadow-sm h-100 text-center">
                    <div className="card-body p-4">
                        <div className="feature-icon bg-warning bg-opacity-10 text-warning mb-3">
                            <i className="bi bi-clock fs-2"></i>
                        </div>
                        <h5 className="fw-bold mb-3">Ahorro de Tiempo</h5>
                        <p className="text-muted">Automatización que reduce la administración manual en un 70%</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home;