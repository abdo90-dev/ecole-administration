import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './environment';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      // Use Firebase Authentication to sign in
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      setIsAuthenticated(true); // Call onLogin if needed for additional logic
    } catch (error) {
      setErrors({
        general: 'Email ou mot de passe incorrect'
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          {isAuthenticated && <Navbar onLogout={handleLogout} />}
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/users" 
              element={
                isAuthenticated ? (
                  <UserList />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/profile" 
              element={
                isAuthenticated ? (
                  <Profile />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

function setErrors(arg0: { general: string; }) {
    throw new Error('Function not implemented.');
  }
