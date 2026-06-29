import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { getCategoryMeta, getSeverityMeta, timeAgo } from '../constants';
import StatusStamp from '../components/StatusStamp';
import Loader from '../components/Loader';
import './IssueDetail.css';

export default function IssueDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const routerLocation = useLocation();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);
  const justSubmittedWithMockAI = routerLocation.state?.aiMock === true;

  const fetchIssue = async () => {
    try {
      const { data } = await api.get(`/issues/${id}`);
      setIssue(data.issue);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssue(); }, [id]);

  const handleUpvote = async () => {
    if (!user) return;
    const { data } = await api.post(`/issues/${id}/upvote`);
    setIssue(data.issue);
  };

  const handleVerify = async () => {
    if (!user) return;
    try {
      const { data } = await api.post(`/issues/${id}/verify`);
      setIssue(data.issue);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const { data } = await api.post(`/issues/${id}/comments`, { text: comment });
      setIssue(data.issue);
      setComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <Loader label="Loading record…" />;
  if (!issue) return <div className="detail__loading">Issue not found.</div>;

  const cat = getCategoryMeta(issue.category);
  const sev = getSeverityMeta(issue.aiSeverity);
  const hasUpvoted = issue.upvotes?.some((u) => (u._id || u) === user?.id);
  const hasVerified = issue.verifications?.some((v) => (v._id || v) === user?.id);

  return (
    <div className="detail">
      <Link to="/feed" className="detail__back">← Back to feed</Link>

      {justSubmittedWithMockAI && (
        <div className="detail__mock-banner">
          ℹ️ This report was categorized using the offline mock classifier (no Gemini API key configured, or the live call failed) — not live Gemini Vision. The category/severity above is a best-effort guess.
        </div>
      )}

      <div className="detail__grid">
        <div className="detail__main">
          <img src={issue.imageUrl} alt={issue.title} className="detail__image" />

          <div className="detail__title-row">
            <StatusStamp status={issue.status} size="lg" />
            <span className="detail__category" style={{ '--cat-color': cat.color }}>
              {cat.icon} {cat.label}
            </span>
          </div>

          <h1 className="detail__title">{issue.title}</h1>

          <div className="detail__meta-row">
            <span style={{ color: sev.color, fontWeight: 700 }}>● {sev.label} severity</span>
            <span className="detail__dot">·</span>
            <span>Reported {timeAgo(issue.createdAt)}</span>
            <span className="detail__dot">·</span>
            <span>by {issue.reporterName || issue.reportedBy?.name}</span>
          </div>

          {issue.aiSummary && (
            <div className="detail__ai-box">
              <strong>🤖 AI Analysis</strong>
              <p>{issue.aiSummary}</p>
              <span className="detail__ai-confidence">Confidence: {Math.round((issue.aiConfidence || 0) * 100)}%</span>
            </div>
          )}

          {issue.description && (
            <div className="detail__description">
              <strong>Description</strong>
              <p>{issue.description}</p>
            </div>
          )}

          {issue.location?.address && (
            <div className="detail__location">📍 {issue.location.address}</div>
          )}

          <div className="detail__actions">
            <button
              className={`detail__action-btn ${hasUpvoted ? 'detail__action-btn--active' : ''}`}
              onClick={handleUpvote}
            >
              ▲ Upvote ({issue.upvotes?.length || 0})
            </button>
            <button
              className={`detail__action-btn ${hasVerified ? 'detail__action-btn--active' : ''}`}
              onClick={handleVerify}
              disabled={hasVerified}
            >
              ✓ {hasVerified ? 'You verified this' : 'I see this too'} ({issue.verifications?.length || 0})
            </button>
          </div>

          {/* Comments */}
          <div className="detail__comments">
            <h3>Discussion ({issue.comments?.length || 0})</h3>

            {user && (
              <form className="detail__comment-form" onSubmit={handleComment}>
                <input
                  type="text"
                  placeholder="Add an update or note…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                />
                <button disabled={posting}>{posting ? '…' : 'Post'}</button>
              </form>
            )}

            <div className="detail__comment-list">
              {issue.comments?.length === 0 && <p className="detail__no-comments">No comments yet.</p>}
              {issue.comments?.slice().reverse().map((c) => (
                <div key={c._id} className="detail__comment">
                  <span className="detail__comment-author">{c.userName || c.user?.name}</span>
                  <p>{c.text}</p>
                  <span className="detail__comment-time">{timeAgo(c.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status timeline sidebar */}
        <aside className="detail__sidebar">
          <h3 className="detail__sidebar-title">Record timeline</h3>
          <div className="detail__timeline">
            {issue.statusHistory?.map((entry, idx) => (
              <div key={idx} className="detail__timeline-item">
                <span className="detail__timeline-dot" />
                <div>
                  <span className="detail__timeline-status">{entry.status.replace('_', ' ')}</span>
                  <span className="detail__timeline-time">{timeAgo(entry.changedAt)}</span>
                  {entry.note && <p className="detail__timeline-note">{entry.note}</p>}
                </div>
              </div>
            ))}
          </div>

          {issue.resolvedImageUrl && (
            <div className="detail__proof">
              <h4>Proof of resolution</h4>
              <img src={issue.resolvedImageUrl} alt="Resolved" />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
