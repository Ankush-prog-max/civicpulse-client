import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';
import './Auth.css';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password);
    if (res.success) navigate('/feed');
    else setError(res.message);
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <span className="auth__seal">CP</span>
        <h1 className="auth__title">Join CivicPulse</h1>
        <p className="auth__sub">Report your first issue and start building a more accountable neighborhood.</p>

        {error && <div className="auth__error">{error}</div>}

        <label className="auth__label">Full name</label>
        <input
          className="auth__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
        />

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
          minLength={6}
          placeholder="At least 6 characters"
        />

        <button className="btn btn--primary auth__submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <GoogleSignInButton onSuccess={() => navigate('/feed')} onError={setError} />

        <p className="auth__switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
