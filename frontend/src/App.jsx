import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import { useAuthStore } from './store/authStore';
import { useUiStore } from './store/uiStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isDarkMode = useUiStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/*" 
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
