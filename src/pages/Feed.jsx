import { useEffect, useState, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import Loader from '../components/Loader';
import { CATEGORIES, STATUSES } from '../constants';
import './Feed.css';

export default function Feed() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('recent');

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (status) params.status = status;
      if (sort === 'top') params.sort = 'top';
      const { data } = await api.get('/issues', { params });
      setIssues(data.issues);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, status, sort]);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  const handleUpvote = async (id) => {
    if (!user) return;
    const { data } = await api.post(`/issues/${id}/upvote`);
    setIssues((prev) => prev.map((i) => (i._id === id ? data.issue : i)));
  };

  const handleVerify = async (id) => {
    if (!user) return;
    try {
      const { data } = await api.post(`/issues/${id}/verify`);
      setIssues((prev) => prev.map((i) => (i._id === id ? data.issue : i)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="feed">
      <div className="feed__header">
        <h1>Community feed</h1>
        <p>Every report, every seal of verification, every fix — logged in public.</p>
      </div>

      <div className="feed__filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="feed__select">
          <option value="">All categories</option>
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <option key={key} value={key}>{c.icon} {c.label}</option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="feed__select">
          <option value="">All statuses</option>
          {Object.entries(STATUSES).map(([key, s]) => (
            <option key={key} value={key}>{s.label}</option>
          ))}
        </select>

        <div className="feed__sort">
          <button
            className={sort === 'recent' ? 'feed__sort-btn feed__sort-btn--active' : 'feed__sort-btn'}
            onClick={() => setSort('recent')}
          >
            Most recent
          </button>
          <button
            className={sort === 'top' ? 'feed__sort-btn feed__sort-btn--active' : 'feed__sort-btn'}
            onClick={() => setSort('top')}
          >
            Most upvoted
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading reports…" />
      ) : issues.length === 0 ? (
        <div className="feed__empty">
          <span className="feed__empty-icon">📋</span>
          <p>No issues match these filters yet.</p>
          <p className="feed__empty-sub">Be the first to report one in this category.</p>
        </div>
      ) : (
        <div className="feed__grid">
          {issues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onUpvote={handleUpvote}
              onVerify={handleVerify}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
