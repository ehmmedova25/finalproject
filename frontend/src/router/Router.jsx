import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import LoginPage from '../pages/loginpage/LoginPage';
import RegisterPage from '../pages/registerpage/RegisterPage';
import ProfilePage from '../pages/profilepage/ProfilePage';
import ProtectedRoute from '../components/ProtectedRoute';
  import OAuthSuccessPage from '../pages/oauthsuccespage/OAuthSuccessPage';
  import VerifyEmailPage from '../pages/verify/VerifyEmailPage';
function App() {
  return (
    <Router>
      <Routes>
        {/* Ana səhifə yönləndirilsin loginə */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth səhifələri */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Qorunan profil səhifəsi */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

      
    
  <Route path="/verify-email" element={<VerifyEmailPage />} />

  <Route path="/oauth-success" element={<OAuthSuccessPage />} />


      </Routes>
    </Router>
  );
}

export default App;
