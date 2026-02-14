import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import StudentLogin from './pages/StudentLogin'
import AdminLogin from './pages/AdminLogin'
import Students from './pages/Students'
import Admin from './pages/Admin'
import { AuthProvider } from './context/AuthContext'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <StudentLogin /> },
  { path: '/students', element: <Students /> },
  { path: '/admin', element: <AdminLogin /> },
  { path: '/admin-dashboard', element: <Admin /> }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
