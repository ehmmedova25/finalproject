import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import LoginPage from '../pages/loginpage/LoginPage';
import RegisterPage from '../pages/registerpage/RegisterPage';
import ProfilePage from '../pages/profilepage/ProfilePage';
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
