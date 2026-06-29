import { Link } from 'react-router-dom';
import { getCategoryMeta, getSeverityMeta, timeAgo } from '../constants';
import StatusStamp from './StatusStamp';
import './IssueCard.css';

export default function IssueCard({ issue, onUpvote, onVerify, currentUserId }) {
  const cat = getCategoryMeta(issue.category);
  const sev = getSeverityMeta(issue.aiSeverity);
  const hasUpvoted = issue.upvotes?.some((id) => (id._id || id) === currentUserId);
  const hasVerified = issue.verifications?.some((id) => (id._id || id) === currentUserId);

  return (
    <article className="issue-card">
      <Link to={`/issues/${issue._id}`} className="issue-card__image-wrap">
        <img src={issue.imageUrl} alt={issue.title} className="issue-card__image" />
        <span className="issue-card__category" style={{ '--cat-color': cat.color }}>
          {cat.icon} {cat.label}
        </span>
      </Link>

      <div className="issue-card__body">
        <div className="issue-card__top">
          <StatusStamp status={issue.status} size="sm" />
          <span className="issue-card__severity" style={{ color: sev.color }}>
            ● {sev.label} severity
          </span>
        </div>

        <Link to={`/issues/${issue._id}`}>
          <h3 className="issue-card__title">{issue.title}</h3>
        </Link>

        {issue.aiSummary && <p className="issue-card__ai-note">🤖 {issue.aiSummary}</p>}

        <div className="issue-card__meta">
          <span>{issue.location?.address || 'Location pinned on map'}</span>
          <span className="issue-card__dot">·</span>
          <span>{timeAgo(issue.createdAt)}</span>
          <span className="issue-card__dot">·</span>
          <span>by {issue.reporterName || issue.reportedBy?.name || 'Citizen'}</span>
        </div>

        <div className="issue-card__actions">
          <button
            className={`issue-card__action ${hasUpvoted ? 'issue-card__action--active' : ''}`}
            onClick={() => onUpvote?.(issue._id)}
          >
            ▲ {issue.upvotes?.length || 0}
          </button>
          <button
            className={`issue-card__action ${hasVerified ? 'issue-card__action--active' : ''}`}
            onClick={() => !hasVerified && onVerify?.(issue._id)}
            disabled={hasVerified}
          >
            ✓ {issue.verifications?.length || 0} verified
          </button>
          <Link to={`/issues/${issue._id}`} className="issue-card__action issue-card__action--link">
            💬 {issue.comments?.length || 0}
          </Link>
        </div>
      </div>
    </article>
  );
}
