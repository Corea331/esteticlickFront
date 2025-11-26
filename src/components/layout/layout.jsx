import Header from '../header/header'
import Footer from '../footer/footer'
import './layout.css'



function Layout({children}) {
  
  return (
    <div className="layout-container">
      <Header />
      <main className="layout-main">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
