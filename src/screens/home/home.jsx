import Carousel from '../../components/presentationcarousel/presentationcarousel'
import './home.css'


function Home() {
  return(
    <section className='esteticlick-home'>
      <div className='container'>
        {/* Header Principal */}
        <div className='home-header'>
          <h1 className='home-title'>Sistema Integral de Gestión para Estéticas</h1>
          <h3 className='home-subtitle'>Optimiza la administración de turnos, clientes y servicios con nuestra plataforma profesional</h3>
          <p className='home-lead'>
            Descubre las herramientas diseñadas específicamente para potenciar el crecimiento 
            y la eficiencia de tu centro de estética.
          </p>
        </div>

        {/* Sección Por qué elegirnos */}
        <div className='home-section'>
          <h2 className='section-title'>
            <i className="bi bi-star-fill"></i>
            ¿Por qué elegir nuestro sistema?
          </h2>
          <h4 className='section-subtitle'>
            Soluciones completas para la gestión moderna de tu estética
          </h4>
        </div>

        {/* Gestión de Turnos */}
        <div className='home-section'>
          <div className='row align-items-center'>
            <div className='col-lg-8'>
              <h3 className='section-title'>
                <i className="bi bi-calendar-week-fill"></i>
                Gestión de Turnos Inteligente
              </h3>
              <p className='home-text'>
                Gestionamos el ciclo completo de reservas mediante un flujo automatizado que inicia 
                con la solicitud del cliente, se consolida con confirmaciones instantáneas, permite 
                reprogramaciones flexibles y facilita cancelaciones asistidas.
              </p>
              <p className='home-text'>
                Todo el proceso está respaldado por notificaciones automáticas bidireccionales que 
                mantienen informados tanto a tus clientes como a tu equipo en todo momento.
              </p>
              <ul className='home-list'>
                <li>
                  <i className="bi bi-calendar-plus-fill"></i>
                  Agenda inteligente para asignación eficiente de horarios
                </li>
                <li>
                  <i className="bi bi-calendar-check-fill"></i>
                  Notificaciones automáticas a clientes y a la estética en cada acción
                </li>
                <li>
                  <i className="bi bi-calendar-month-fill"></i>
                  Reducción de tiempos muertos y optimización de la capacidad instalada
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Control de Clientes */}
        <div className='home-section'>
          <h3 className='section-title'>
            <i className="bi bi-people-fill"></i>
            Control Integral de Clientes
          </h3>
          <p className='home-text'>
            Mantén un registro detallado y organizado de cada cliente que visita tu estética. 
            Nuestro sistema te permite ofrecer un servicio personalizado y de alta calidad.
          </p>
          <ul className='home-list'>
            <li>
              <i className="bi bi-clock-history"></i>
              Historial completo de servicios realizados
            </li>
            <li>
              <i className="bi bi-heart-fill"></i>
              Preferencias y observaciones personalizadas
            </li>
            <li>
              <i className="bi bi-bell-fill"></i>
              Seguimiento de fidelización y recordatorios automáticos
            </li>
          </ul>
        </div>

        {/* Carrusel - Cómo funciona */}
        <div className='home-section'>
          <h3 className='section-title'>
            <i className="bi bi-play-circle-fill"></i>
            ¿Cómo funciona nuestra gestión de turnos?
          </h3>
          <p className='home-text text-center mb-4'>
            Descubre el proceso completo y automatizado de nuestra solución
          </p>
          <div className='carousel-container'>
            <Carousel />
          </div>
        </div>

        {/* Beneficios Clave */}
        <div className='home-section'>
          <h3 className='section-title'>
            <i className="bi bi-award-fill"></i>
            Beneficios Clave
          </h3>
          <div className='benefits-grid'>
            <div className='benefit-card'>
              <div className='feature-icon'>
                <i className="bi bi-bell-fill"></i>
              </div>
              <h5>Reducción de Ausentismo</h5>
              <p>Recordatorios automáticos que disminuyen las inasistencias hasta en un 60%</p>
            </div>
            
            <div className='benefit-card'>
              <div className='feature-icon'>
                <i className="bi bi-calendar-week"></i>
              </div>
              <h5>Agenda Optimizada</h5>
              <p>Asignación inteligente que maximiza la ocupación y reduce tiempos muertos</p>
            </div>
            
            <div className='benefit-card'>
              <div className='feature-icon'>
                <i className="bi bi-chat-heart"></i>
              </div>
              <h5>Experiencia Mejorada</h5>
              <p>Comunicación constante que incrementa la satisfacción y fidelización</p>
            </div>
            
            <div className='benefit-card'>
              <div className='feature-icon'>
                <i className="bi bi-graph-up"></i>
              </div>
              <h5>Ahorro de Tiempo</h5>
              <p>Automatización que reduce la administración manual en un 70%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home;