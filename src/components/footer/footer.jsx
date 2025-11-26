import ModalContacto from '../modalcontacto/modalcontacto'
import SocialSelector from '../socialselector/socialselector'
import { useState } from 'react'
import './footer.css'

function Footer() {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow= () => setShow(true)

  return(
    <footer className="container-fluid py-4">
      <div className="container text-center">
        <div className="row gap-3">
          <div className="col align-content-center align-items-center">
            <h4 className='mb-3 mt-3'>¿Desea promocionar su empresa? Solicite información</h4>

            <button type="button" className='btn boton' onClick={ handleShow }>Contacto</button>

            <ModalContacto show={ show } handleClose={ handleClose } />
          </div>
          
          <div className="col align-content-center align-items-center">
            <SocialSelector></SocialSelector>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;