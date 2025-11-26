import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from '../../hooks/apihooks.js';
import './login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const loginMutation = useLogin()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await loginMutation.mutateAsync(formData)
      navigate('/')
    }catch(error) {
      console.error('Error al iniciar sesión:', error)
      
      if(error.message){
        setError(error.message)
      } else  if(error.response?.data?.message){
        setError(error.response.data.message)
      } else {
        setError('Error al iniciar sesión. Verifique sus credenciales.')
      }
    }
  }

  return (
    <div className="login-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                <button type="button" className="btn btn-close" data-bs-dismiss="alert" aria-label="close"></button>
              </div>
            )}
            <div className="card login-card">
              <div className="card-body p-4">
                <h2 className="login-title">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                  
                  <div className="mb-3">
                    <input 
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