import { useState, useEffect } from "react"
import './socialselector.css'



function SocialSelector() {
  const [socialNetworks, setSocialNetworks] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchSocialNetworks = async () => {
      // Datos de ejemplo que vendrían de tu API
      const apiData = [
        {
          id: 1,
          name: 'facebook',
          url: 'https://facebook.com/tu-perfil',
          available: true,
          color: '#1877F2',
          iconClass: 'bi bi-facebook'
        },
        {
          id: 2,
          name: 'instagram',
          url: 'https://instagram.com/tu-perfil',
          available: true,
          color: '#E4405F',
          iconClass: 'bi bi-instagram'
        },
        {
          id: 3,
          name: 'twitter',
          url: 'https://twitter.com/tu-perfil',
          available: true,
          color: '#1DA1F2',
          iconClass: 'bi bi-twitter-x'
        },
        {
          id: 4,
          name: 'youtube',
          url: 'https://youtube.com/c/tu-canal',
          available: true,
          color: '#FF0000',
          iconClass: 'bi bi-youtube'
        },
        {
          id: 5,
          name: 'tiktok',
          url: 'https://tiktok.com/@tu-usuario',
          available: false,
          color: '#000000',
          iconClass: 'bi bi-tiktok'
        },
        {
          id: 6,
          name: 'whatsapp',
          url: 'https://wa.me/123456789',
          available: false,
          color: '#25D366',
          iconClass: 'bi bi-whatsapp'
        },
        {
          id: 7,
          name: 'pinterest',
          url: 'https://pinterest.com/tu-perfil',
          available: true,
          color: '#BD081C',
          iconClass: 'bi bi-pinterest'
        },
        {
          id: 8,
          name: 'snapchat',
          url: 'https://snapchat.com/add/tu-usuario',
          available: true,
          color: '#FFFC00',
          iconClass: 'bi bi-snapchat'
        }
      ];

      // Filtrar solo las redes disponibles
      const availableNetworks = apiData.filter(network => network.available);
      setSocialNetworks(availableNetworks);
    };

    fetchSocialNetworks();
  }, []);


  return(
    <div className="social-container">
      <div 
      className={`social-flip-card ${isFlipped ? 'flipped' : ''}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      >
        <div className="social-flip-card-inner">
          
          <div className="social-flip-card-front">
            <div className="social-front-content">
              {!isFlipped && (
              <div className="social-text">
                REDES <br /> SOCIALES
              </div>
              )}
            </div>
          </div>

          <div className="social-flip-card-back">
            <div className="social-grid">
              {socialNetworks.map((network, index) =>(
                <a
                key={network.id}
                href={network.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`social-card card-${index + 1}`}
                style={{ '--social-color': network.color }}
                >
                  <i className={`${network.iconClass} social-icon`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialSelector;