import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './GoogleSignInButton.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function GoogleSignInButton({ onSuccess, onError }) {
  const { loginWithGoogle } = useAuth();
  const { theme } = useTheme();

  // No client ID configured -> don't render anything. Email/password still works.
  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="google-signin">
      <div className="google-signin__divider">
        <span>or continue with</span>
      </div>
      <div className="google-signin__button-wrap">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const result = await loginWithGoogle(credentialResponse.credential);
            if (result.success) onSuccess?.();
            else onError?.(result.message);
          }}
          onError={() => onError?.('Google sign-in was cancelled or failed. Please try again.')}
          theme={theme === 'dark' ? 'filled_black' : 'outline'}
          shape="pill"
          width="100%"
        />
      </div>
    </div>
  );
}
