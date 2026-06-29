import { getStatusMeta } from '../constants';
import './StatusStamp.css';

/**
 * Signature element of CivicPulse: a circular "official seal" stamp.
 * Rotated slightly off-axis like a real rubber stamp, with a dashed
 * inner ring to evoke an authenticating mark on a civic record.
 */
export default function StatusStamp({ status, size = 'md' }) {
  const meta = getStatusMeta(status);
  return (
    <div className={`stamp stamp--${size}`} style={{ '--stamp-color': meta.color }}>
      <span className="stamp__ring" />
      <span className="stamp__label">{meta.label}</span>
    </div>
  );
}
