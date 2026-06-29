import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';
import './Auth.css';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) navigate('/feed');
    else setError(res.message);
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <span className="auth__seal">CP</span>
        <h1 className="auth__title">Sign in to CivicPulse</h1>
        <p className="auth__sub">Pick up where you left off — your reports and points are waiting.</p>

        {error && <div className="auth__error">{error}</div>}

        <label className="auth__label">Email</label>
        <input
          className="auth__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />

        <label className="auth__label">Password</label>
        <input
          className="auth__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <button className="btn btn--primary auth__submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <GoogleSignInButton onSuccess={() => navigate('/feed')} onError={setError} />

        <p className="auth__switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className="auth__demo">Demo login: ankush@demo.com / demo1234</p>
      </form>
    </div>
  );
}
