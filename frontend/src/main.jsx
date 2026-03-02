import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import './index.css'
import App from './App'
import StudentLogin from './pages/StudentLogin'
import AdminLogin from './pages/AdminLogin'
import Students from './pages/Students'
import Admin from './pages/Admin'
import { AuthProvider } from './context/AuthContext'

const link = new HttpLink({ uri: 'http://localhost:4000' })

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <StudentLogin /> },
  { path: '/students', element: <Students /> },
  { path: '/admin', element: <AdminLogin /> },
  { path: '/admin-dashboard', element: <Admin /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
)
