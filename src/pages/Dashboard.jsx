import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/client';
import { getCategoryMeta, getStatusMeta } from '../constants';
import Loader from '../components/Loader';
import './Dashboard.css';

const STATUS_KEYS = ['reported', 'verified', 'in_progress', 'resolved'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/issues/stats/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading impact data…" />;
  if (!stats) return <div className="dash__loading">Could not load dashboard.</div>;

  const statusData = STATUS_KEYS.map((key) => ({
    name: getStatusMeta(key).label,
    value: stats[key === 'in_progress' ? 'inProgress' : key] || 0,
    color: getStatusMeta(key).color,
  }));

  const categoryData = stats.byCategory.map((c) => ({
    name: getCategoryMeta(c._id).label,
    count: c.count,
    color: getCategoryMeta(c._id).color,
  }));

  return (
    <div className="dash">
      <div className="dash__header">
        <h1>Impact dashboard</h1>
        <p>How the community is doing at finding, confirming, and fixing local issues.</p>
      </div>

      <div className="dash__kpis">
        <div className="dash__kpi">
          <span className="dash__kpi-num">{stats.total}</span>
          <span className="dash__kpi-label">Total reports</span>
        </div>
        <div className="dash__kpi dash__kpi--good">
          <span className="dash__kpi-num">{stats.resolutionRate}%</span>
          <span className="dash__kpi-label">Resolution rate</span>
        </div>
        <div className="dash__kpi">
          <span className="dash__kpi-num">{stats.resolved}</span>
          <span className="dash__kpi-label">Resolved</span>
        </div>
        <div className="dash__kpi">
          <span className="dash__kpi-num">{stats.avgResolutionHours > 0 ? `${stats.avgResolutionHours}h` : '—'}</span>
          <span className="dash__kpi-label">Avg. time to resolve</span>
        </div>
      </div>

      <div className="dash__charts">
        <div className="dash__chart-card">
          <h3>Status breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {statusData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="dash__legend">
            {statusData.map((s) => (
              <span key={s.name} className="dash__legend-item">
                <span className="dash__legend-dot" style={{ background: s.color }} /> {s.name} ({s.value})
              </span>
            ))}
          </div>
        </div>

        <div className="dash__chart-card">
          <h3>Issues by category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-soft)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {categoryData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dash__leaderboard">
        <h3>Top contributors</h3>
        <div className="dash__leaderboard-list">
          {stats.topContributors?.map((c, idx) => (
            <div key={c._id} className="dash__leaderboard-item">
              <span className="dash__leaderboard-rank">#{idx + 1}</span>
              {c.avatarUrl ? (
                <img src={c.avatarUrl} alt={c.name} className="dash__leaderboard-avatar dash__leaderboard-avatar--photo" />
              ) : (
                <span className="dash__leaderboard-avatar" style={{ background: c.avatarColor }}>
                  {c.name[0]?.toUpperCase()}
                </span>
              )}
              <span className="dash__leaderboard-name">{c.name}</span>
              <span className="dash__leaderboard-stats">
                {c.reportsCount} reports · {c.verifiedCount} verified
              </span>
              <span className="dash__leaderboard-points">{c.points} pts</span>
            </div>
          ))}
          {(!stats.topContributors || stats.topContributors.length === 0) && (
            <p className="dash__empty">No contributors yet — be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
