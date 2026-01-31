import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import Navbar from './components/common/Navbar.jsx'
import Sidebar from './components/common/Sidebar.jsx'
import { appRoutes } from './routes.jsx'

function App() {
  const visibleRoutes = appRoutes.filter((route) => route.showInNav)

  return (
    <BrowserRouter>
      <Box className="app-shell">
        <Container maxWidth="xl" disableGutters sx={{ pt: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}>
          <Navbar routes={visibleRoutes} />
          <Box className="app-body">
            <Box className="sidebar-wrapper">
              <Sidebar />
            </Box>
            <Box component="main" className="main-content">
              <Routes>
                {appRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Box>
          </Box>
        </Container>
      </Box>
    </BrowserRouter>
  )
}

export default App
