import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { esteticlickQueryClient } from './apis/queryclient.js'
import { AuthProvider } from './context/authcontext'
import { AlertProvider } from './context/alertcontext'
import AlertContainer from './components/ui/alert/alertcontainer'
import NavigationHandler from './components/navigationhandler'
import Layout from './components/layout/layout'
import Home from './screens/home/home'
import Login from './screens/login/login'
import BusinessesPage from './screens/business/businesspage'
import IntegratedDashoard from './screens/dashboard/integrateddashboard'
import PrivateRoute from './components/routes/privateroute'
import PublicOnlyRoute from './components/routes/publiconlyroute'
import Unauthorized from './screens/unauthorized/unauthorized'
import ServicesPage from './screens/services/servicespage.jsx'
import Profile from './screens/profile/profile.jsx'
import './app.css'


function App() {
  
  return (
    <QueryClientProvider client={esteticlickQueryClient}>
      <AlertProvider>
        <AuthProvider>
          <Router>
            <NavigationHandler />
            <AlertContainer />
            <Routes>
              {/* Rutas Públicas */}
              <Route path='/' element={<Layout><Home /></Layout>} />
              <Route path='/businesses' element={<Layout><BusinessesPage /></Layout>} />
              <Route path='/services' element={<Layout><ServicesPage /></Layout>} />
              
              {/* Rutas públicas para no autenticados */}
              <Route path='/login' element={<Layout><PublicOnlyRoute><Login /></PublicOnlyRoute></Layout>} />

              {/* Rutas privadas */}
              <Route path='/profile' element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
              
              <Route path='/dashboard' element={
                <PrivateRoute allowedRoles={['admin', 'owner', 'editor', 'staff']}>
                  <Layout><IntegratedDashoard /></Layout>
                </PrivateRoute>} />

              {/* Ruta para no autorizados */}
              <Route path='/unauthorized' element={<Layout><Unauthorized /></Layout>} />

              {/* 404 */}
              <Route path='*' element={<Layout><div>404 - No Encontrado</div></Layout>} />
            </Routes>
          </Router>
        </AuthProvider>
      </AlertProvider>
      
    </QueryClientProvider>
  )
}

export default App
