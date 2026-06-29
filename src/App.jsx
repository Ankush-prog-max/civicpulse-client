import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Report from './pages/Report';
import IssueDetail from './pages/IssueDetail';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AppRoutes() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function App() {
  // Only wrap with GoogleOAuthProvider if a real client ID is configured.
  // Without it, "Sign in with Google" buttons simply don't render (see GoogleSignInButton),
  // and email/password auth keeps working unaffected — same mock-first fallback pattern
  // used elsewhere in this app (Gemini AI, MongoDB).
  if (!GOOGLE_CLIENT_ID) return <AppRoutes />;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}
