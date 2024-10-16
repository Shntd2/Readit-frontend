import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login';
// import ForgotPassword from './components/Login/ForgotPassword';
// import RecoverPassword from './components/Login/RecoverPassword';
// import MainPage from './pages/MainPage/MainPage';
import { AuthProvider, AuthContext } from "./contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/readit-login" replace />; 
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/readit-login" element={<Login />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/recover-password" element={<RecoverPassword />} /> */}

          {/* Protected Routes */}
          <Route 
            path="/readit"
            element={
              <ProtectedRoute>
                {/* <MainPage /> */}
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/readit-login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
