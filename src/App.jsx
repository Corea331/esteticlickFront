import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { esteticlickQueryClient } from './apis/queryclient.js'
import Layout from './components/layout/layout'
import Home from './screens/home/home'
import Login from './screens/login/login'
import BusinessesPage from './screens/business/businesspage'
import './app.css'


function App() {
  
  return (
    <QueryClientProvider client={esteticlickQueryClient}>
      <Router>
        <Routes>
          <Route path='/' element={<Layout><Home /></Layout>} />
          <Route path='/login' element={<Layout><Login /></Layout>} />
          <Route path='/businesses' element={<Layout><BusinessesPage /></Layout>} />
          <Route path='*' element={<Layout><div>404 - No Encontrado</div></Layout>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
