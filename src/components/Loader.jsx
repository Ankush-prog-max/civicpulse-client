import './Loader.css';

export default function Loader({ label = 'Loading…', size = 'md' }) {
  return (
    <div className={`loader loader--${size}`} role="status" aria-live="polite">
      <span className="loader__spinner" />
      <span className="loader__label">{label}</span>
    </div>
  );
}
