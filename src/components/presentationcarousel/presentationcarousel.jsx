import { Carousel } from 'react-bootstrap'
import { Card } from 'react-bootstrap'
import './presentationcarousel.css'

function PresentationCarousel() {
  return(
  <Carousel className='w-100'>
    <Carousel.Item>
      <Card style={{ width: 'auto', justifyContent: 'center' }}>
        <Card.Body style={{ backgroundColor: '#88a18a' }}>
          <Card.Title className='text-center'><i className="bi bi-clock-fill"></i> Solicitar Turnos</Card.Title>
          <ul className="list-group list-group-numbered" style={{ padding: '15px 80px 15px 80px' }}>
            <li className='list-group-item list-group-item-success'><Card.Text>Reserva online 24/7.</Card.Text></li>
            <li className='list-group-item list-group-item-success'><Card.Text>Visualización en tiempo real de horarios disponibles.</Card.Text></li>
            <li className='list-group-item list-group-item-success'><Card.Text>Asignación automática según especialidad y disponibilidad.</Card.Text></li>
          </ul>
          <br />
        </Card.Body>
      </Card>
    </Carousel.Item >
    <Carousel.Item >
    <Card style={{ width: 'auto' }}>
        <Card.Body style={{ backgroundColor: '#88a18a'  }}>
          <Card.Title className='text-center my-3'><i className="bi bi-calendar2-check-fill"></i> Confirmación Automática</Card.Title>
          <ul className="list-group list-group-numbered" style={{ padding: '15px 80px 15px 80px' }}>
            <li className='list-group-item list-group-item-success'><Card.Text>Notificaciones inmediatas vía email o SMS.</Card.Text></li>
            <li className='list-group-item list-group-item-success'><Card.Text>Recordatorios programados previo a la cita.</Card.Text></li>
            <li className='list-group-item list-group-item-success'><Card.Text>Confirmación con un solo clic por parte del cliente.</Card.Text></li>
          </ul>
          <br />
        </Card.Body>
      </Card>
    </Carousel.Item >
    <Carousel.Item>
    <Card style={{ width: 'auto' }}>
        <Card.Body style={{ backgroundColor: '#88a18a' }}>
          <Card.Title className='text-center'><i className="bi bi-chat-text-fill"></i> Modificación Flexible</Card.Title>
            <ul className="list-group list-group-numbered" style={{ padding: '15px 80px 15px 80px' }}>
            <li className='list-group-item list-group-item-success'><Card.Text>Cambio de horarios sin complicaciones.</Card.Text></li>
            <li className='list-group-item list-group-item-success'><Card.Text>Reagendamiento automático según nueva disponibilidad.</Card.Text></li>
            <li className='list-group-item list-group-item-success'><Card.Text>Notificación instantánea de modificaciones.</Card.Text></li>
            </ul>
          <br />
        </Card.Body>
      </Card>
    </Carousel.Item >
    <Carousel.Item>
    <Card style={{ width: 'auto' }}>
        <Card.Body style={{ backgroundColor: '#88a18a' }}>
          <Card.Title className='text-center'><i className="bi bi-x-octagon-fill"></i> Cancelación Controlada</Card.Title>
          <ul className="list-group list-group-numbered" style={{ padding: '15px 80px 15px 80px' }}>
          <li className='list-group-item list-group-item-success'><Card.Text>Proceso simple y rápido.</Card.Text></li>
            <li className='list-group-item list-group-item-success'><Card.Text>Liberación automática del horario para nuevos turnos.</Card.Text></li>
            <li className='list-group-item list-group-item-success'><Card.Text>Políticas personalizables de cancelación.</Card.Text></li>
          </ul>
          <br />
        </Card.Body>
      </Card>
    </Carousel.Item >
  </Carousel>
  )
}

export default PresentationCarousel;