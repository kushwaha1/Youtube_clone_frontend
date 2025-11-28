import { Outlet } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px 20px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Outlet />
    </div>
  )
}

export default App
