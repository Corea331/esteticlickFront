import { Carousel } from 'react-bootstrap'
import './presentationcarousel.css'

function PresentationCarousel() {
  return(
    <Carousel className='esteticlick-carousel' indicators interval={5000}>
    <Carousel.Item>
      <div className='carousel-card'>
        <h4 className='carousel-title'>
          <i className="bi bi-clock-fill"></i> 
          Solicitar Turnos
        </h4>
        <ul className='carousel-list'>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Reserva online 24/7 desde cualquier dispositivo</p>
          </li>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Visualización en tiempo real de horarios disponibles</p>
          </li>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Asignación automática según especialidad y disponibilidad</p>
          </li>
        </ul>
      </div>
    </Carousel.Item>
    
    <Carousel.Item>
      <div className='carousel-card'>
        <h4 className='carousel-title'>
          <i className="bi bi-calendar2-check-fill"></i> 
          Confirmación Automática
        </h4>
        <ul className='carousel-list'>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Notificaciones inmediatas vía email o SMS</p>
          </li>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Recordatorios programados previo a la cita</p>
          </li>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Confirmación con un solo clic por parte del cliente</p>
          </li>
        </ul>
      </div>
    </Carousel.Item>
    
    <Carousel.Item>
      <div className='carousel-card'>
        <h4 className='carousel-title'>
          <i className="bi bi-arrow-left-right"></i> 
          Modificación Flexible
        </h4>
        <ul className='carousel-list'>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Cambio de horarios sin complicaciones</p>
          </li>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Reagendamiento automático según nueva disponibilidad</p>
          </li>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Notificación instantánea de modificaciones</p>
          </li>
        </ul>
      </div>
    </Carousel.Item>
    
    <Carousel.Item>
      <div className='carousel-card'>
        <h4 className='carousel-title'>
          <i className="bi bi-x-circle-fill"></i> 
          Cancelación Controlada
        </h4>
        <ul className='carousel-list'>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Proceso simple y rápido en pocos clics</p>
          </li>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Liberación automática del horario para nuevos turnos</p>
          </li>
          <li className='carousel-list-item'>
            <p className='carousel-text'>Políticas personalizables de cancelación</p>
          </li>
        </ul>
      </div>
    </Carousel.Item>
  </Carousel>
  )
}

export default PresentationCarousel;