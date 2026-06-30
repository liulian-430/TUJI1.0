import React, { useEffect } from 'react'
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import CreateTripModal from './components/CreateTripModal'
import UpdateModal from './components/UpdateModal'
import Toast from './components/common/Toast'
import Loading from './components/common/Loading'
import ErrorBoundary from './components/common/ErrorBoundary'
import Home from './pages/Home'
import AI from './pages/AI'
import MapPage from './pages/Map'
import My from './pages/My'
import Search from './pages/Search'
import POIDetail from './pages/POIDetail'
import TripDetail from './pages/TripDetail'
import Budget from './pages/Budget'
import useUIStore from './store/useUIStore'
import useUserStore from './store/useUserStore'

const AppContent = () => {
  const location = useLocation()
  const { theme } = useUIStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const hideNavBarRoutes = ['/map']
  const shouldShowNavBar = !hideNavBarRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      {shouldShowNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/my" element={<My />} />
        <Route path="/search" element={<Search />} />
        <Route path="/poi/:id" element={<POIDetail />} />
        <Route path="/trip/:id" element={<TripDetail />} />
        <Route path="/budget" element={<Budget />} />
      </Routes>
      <CreateTripModal />
      <UpdateModal />
      <Toast />
      <Loading />
    </div>
  )
}

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

export default App
