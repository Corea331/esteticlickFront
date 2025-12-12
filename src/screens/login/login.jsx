import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLogin } from '../../hooks/apihooks.js'
import { useAuth } from '../../context/authcontext'
import { useAlert } from '../../context/alertcontext'
import { processApiError } from '../../utils/alerthandler.js'
import { API_BASE_URL } from '../../apis/api'
import './login.css'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const loginMutation = useLogin()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showError, showSuccess } = useAlert()
  const emailInputRef = useRef(null)

  useEffect(() => {
    if(emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Debug: Ver qué datos se están enviando
    console.log('Enviando datos de login:', {
      email: formData.email,
      passwordLength: formData.password?.length || 0
    });

    try {
      const data = await loginMutation.mutateAsync(formData)
      console.log('Login response:', JSON.stringify(data, null, 2));

      const { access_token: token, user, expires_in } = data;
      
      login(user, token, expires_in || 7200);

      showSuccess(`¡Bienvenido/a ${user.name} ` || ` ${user.email}!`)

      navigate('/')
    }catch(error) {
      const alertData = processApiError(error)
      showError(alertData)
    }
  }

  return (
    <div className="login-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card login-card">
              <div className="card-body p-4">
                <h2 className="login-title">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                  
                  <div className="mb-3">
                    <input 
                    ref={emailInputRef}
                    type="email"
                    className="form-control login-input"
                    placeholder="Email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value})}
                    required
                    />
                  </div>
                  <div className="mb-3">
                    <input 
                    type="password"
                    className="form-control login-input"
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                    required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn login-btn w-100"
                    disabled={loginMutation.isLoading}>
                    <i className="bi bi-box-arrow-in-right"></i> {loginMutation.isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;