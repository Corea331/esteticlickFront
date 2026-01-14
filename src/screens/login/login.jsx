import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLogin } from '../../hooks'
import { useAuth } from '../../context/authcontext'
import { showSuccess, showError } from '../../utils/notifications'
import { processApiError } from '../../utils/alerthandler.js'
import {
  Container,
  Card,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
  Group,
  Stack,
  Box,
  Alert,
  Loader
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle,
  LogIn 
} from 'lucide-react'

function Login() {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    rememberMe: false 
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState(null)
  const loginMutation = useLogin()
  const navigate = useNavigate()
  const { login } = useAuth()
  const emailInputRef = useRef(null)
  const isMobile = useMediaQuery('(max-width: 576px)')
  const isTablet = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.email || !formData.password) {
      setFormError('Por favor, completa todos los campos')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setFormError('Por favor, ingresa un email válido')
      return
    }

    try {
      const data = await loginMutation.mutateAsync(formData)
      const { access_token: token, user } = data
      
      login(user, token)

      showSuccess(`¡Bienvenido/a ${user.name || user.email}!`)

      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      navigate('/')
    } catch (error) {
      const alertData = processApiError(error)
      const errorMessage = alertData.message || alertData || 'Error al iniciar sesión'
      setFormError(errorMessage)
      showError(errorMessage)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (formError) setFormError(null)
  }

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }))
    }
  }, [])

  return (
    <Box 
      className="login-container"
      style={{ 
        backgroundColor: 'var(--color-fondo)',
        minHeight: '100vh'
      }}
      display="flex"
      align="center"
      justify="center"
      p={isMobile ? 'md' : isTablet ? 'lg' : 'xl'}
    >
      <Container 
        size={isMobile ? '100%' : 'xs'} 
        p={0}
      >
        <Card
          className="login-card"
          p={isMobile ? 'lg' : 'xl'}
          radius="lg"
          style={{
            background: 'linear-gradient(135deg, var(--color-header) 0%, #7a957c 100%)',
            border: 'none',
            boxShadow: 'var(--sombra-media)'
          }}
        >
          <Title 
            order={2} 
            className="login-title"
            ta="center"
            mb="xl"
            c="var(--color-blanco)"
            fw={600}
            size={isMobile ? 'h3' : 'h2'}
          >
            Iniciar Sesión
          </Title>
          
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              {formError && (
                <Alert 
                  icon={<AlertCircle size={18} />}
                  title="Error"
                  color="red"
                  variant="light"
                  className="alert-danger"
                  style={{
                    background: 'rgba(220, 53, 69, 0.1)',
                    border: '1px solid var(--color-botones)',
                    borderRadius: 'var(--border-radius)',
                    color: '#dc3545',
                    fontWeight: 500
                  }}
                >
                  {formError}
                </Alert>
              )}
              
              <TextInput
                ref={emailInputRef}
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                leftSection={<Mail size={18} />}
                className="login-input"
                styles={{
                  input: {
                    border: '2px solid transparent',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'var(--transicion-suave)',
                    '&:focus': {
                      borderColor: 'var(--color-botones)',
                      boxShadow: '0 0 0 0.2rem rgba(232, 169, 156, 0.25)',
                      backgroundColor: 'var(--color-blanco)'
                    }
                  }
                }}
                error={formError && formData.email === '' ? 'Campo requerido' : null}
                disabled={loginMutation.isLoading}
                size={isMobile ? 'md' : 'lg'}
              />
              
              <PasswordInput
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                leftSection={<Lock size={18} />}
                className="login-input"
                visibilityToggleButtonProps={{
                  'aria-label': 'Mostrar/ocultar contraseña',
                  children: showPassword ? <EyeOff size={18} /> : <Eye size={18} />
                }}
                visible={showPassword}
                onVisibilityChange={setShowPassword}
                styles={{
                  input: {
                    border: '2px solid transparent',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'var(--transicion-suave)',
                    '&:focus': {
                      borderColor: 'var(--color-botones)',
                      boxShadow: '0 0 0 0.2rem rgba(232, 169, 156, 0.25)',
                      backgroundColor: 'var(--color-blanco)'
                    }
                  }
                }}
                error={formError && formData.password === '' ? 'Campo requerido' : null}
                disabled={loginMutation.isLoading}
                size={isMobile ? 'md' : 'lg'}
              />
              
              <Group justify="space-between" mt="xs">
                <Checkbox
                  label="Recordarme"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  icon={Check}
                  className="form-label"
                  styles={{
                    label: {
                      color: 'var(--color-blanco)',
                      fontWeight: 500
                    },
                    icon: {
                      color: 'var(--color-blanco)'
                    }
                  }}
                  disabled={loginMutation.isLoading}
                  size={isMobile ? 'sm' : 'md'}
                />
              </Group>
              
              <Button
                type="submit"
                className="login-btn"
                leftSection={loginMutation.isLoading ? null : <LogIn size={18} />}
                disabled={loginMutation.isLoading}
                loading={loginMutation.isLoading}
                loaderProps={{
                  type: 'dots',
                  color: 'white'
                }}
                fullWidth
                size={isMobile ? 'md' : 'lg'}
                mt="md"
                style={{
                  background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  color: 'var(--color-texto-primario)',
                  fontWeight: 600,
                  padding: isMobile ? '0.75rem' : '0.875rem 1.5rem',
                  transition: 'var(--transicion-suave)',
                  boxShadow: 'var(--sombra-suave)',
                  '&:hover:not(:disabled)': {
                    background: 'linear-gradient(135deg, var(--color-botones-hover) 0%, #c98778 100%)',
                    color: 'var(--color-blanco)',
                    transform: 'translateY(-2px)',
                    boxShadow: 'var(--sombra-media)'
                  },
                  '&:disabled': {
                    opacity: 0.6,
                    cursor: 'not-allowed',
                    transform: 'none'
                  }
                }}
              >
                {loginMutation.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Stack>
          </form>
          
          {isMobile && (
            <Group justify="center" mt="xl">
              <Button
                variant="subtle"
                size="sm"
                color="gray"
                onClick={() => navigate('/register')}
                style={{
                  color: 'var(--color-blanco)',
                  opacity: 0.8
                }}
              >
                ¿No tienes cuenta? Regístrate
              </Button>
            </Group>
          )}
        </Card>
      </Container>
    </Box>
  )
}

export default Login