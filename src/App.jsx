import { Outlet } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux';
import { setLogoutCallback } from './services/api';
import { logout } from './utils/AuthSlice';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  // Setup logout callback for API interceptor
  useEffect(() => {
    setLogoutCallback(() => {
      dispatch(logout());
    });
  }, [dispatch]);

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
