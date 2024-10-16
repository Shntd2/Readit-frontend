import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
// import Login from './components/Login/Login';
// import ForgotPassword from './components/Login/ForgotPassword';
// import RecoverPassword from './components/Login/RecoverPassword';
// import MainPage from './pages/MainPage/MainPage';

// isAuthenticated -> authentication check will be in corrext context

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />; 
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
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

        {/* Redirect to login if no route matches */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
