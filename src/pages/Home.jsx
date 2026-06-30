import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/issues/stats/dashboard').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            Hyperlocal civic reporting, sealed by your community
          </div>

          <h1 className="hero__title">
            See a problem on your street?
            <br />
            <span className="hero__title-accent">Report it. Stamp it. Track it.</span>
          </h1>

          <p className="hero__sub">
            CivicPulse turns a phone photo into an accountable civic record — AI categorizes the issue,
            your neighbors verify it, and the status seal moves from <em>Reported</em> to <em>Resolved</em>
            in front of everyone.
          </p>

          <div className="hero__cta">
            {user ? (
              <Link to="/report" className="btn btn--primary btn--lg">File a report →</Link>
            ) : (
              <Link to="/register" className="btn btn--primary btn--lg">Start reporting →</Link>
            )}
            <Link to="/feed" className="btn btn--ghost btn--lg">Browse open issues</Link>
          </div>

          {stats && (
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-num">{stats.total}</span>
                <span className="hero__stat-label">Issues logged</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-num">{stats.resolutionRate}%</span>
                <span className="hero__stat-label">Resolution rate</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-num">{stats.verified + stats.inProgress}</span>
                <span className="hero__stat-label">Being acted on</span>
              </div>
            </div>
          )}
        </div>

        {/* Decorative ledger card stack */}
        <div className="hero__visual" aria-hidden="true">
          <div className="ledger-card ledger-card--1">
            <span className="ledger-card__stamp" style={{ '--c': '#3D8361' }}>Resolved</span>
            <span className="ledger-card__line" />
            <span className="ledger-card__line short" />
          </div>
          <div className="ledger-card ledger-card--2">
            <span className="ledger-card__stamp" style={{ '--c': '#F2A93B' }}>In Progress</span>
            <span className="ledger-card__line" />
            <span className="ledger-card__line short" />
          </div>
          <div className="ledger-card ledger-card--3">
            <span className="ledger-card__stamp" style={{ '--c': '#4A90A4' }}>Verified</span>
            <span className="ledger-card__line" />
            <span className="ledger-card__line short" />
          </div>
        </div>
      </section>

      {/* How it works - process as a real sequence (numbered markers justified) */}
      <section className="how">
        <h2 className="how__title">The path from pothole to proof</h2>
        <div className="how__steps">
          <div className="how__step">
            <span className="how__num">01</span>
            <h3>Snap & pin</h3>
            <p>Photograph the issue. CivicPulse geo-tags it to the exact spot automatically.</p>
          </div>
          <div className="how__step">
            <span className="how__num">02</span>
            <h3>AI reads it</h3>
            <p>Gemini Vision classifies the issue type and severity in seconds — no manual form-filling.</p>
          </div>
          <div className="how__step">
            <span className="how__num">03</span>
            <h3>Neighbors confirm</h3>
            <p>Once 3 nearby citizens verify it, the record is sealed <strong>Verified</strong> — no fake reports.</p>
          </div>
          <div className="how__step">
            <span className="how__num">04</span>
            <h3>Track to resolution</h3>
            <p>Every status change is logged publicly, from report to repair — full transparency.</p>
          </div>
        </div>
      </section>

      {/* Categories preview */}
      <section className="categories">
        <h2 className="categories__title">What gets reported</h2>
        <div className="categories__grid">
          {[
            ['🕳️', 'Potholes'], ['💡', 'Streetlights'], ['🗑️', 'Garbage'],
            ['💧', 'Water Leaks'], ['🌊', 'Sewage & Drains'], ['🛣️', 'Road Damage'],
            ['🚛', 'Illegal Dumping'], ['🌳', 'Fallen Trees'],
          ].map(([icon, label]) => (
            <Link key={label} to="/report" className="categories__chip">
              <span>{icon}</span> {label}
            </Link>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <p>CivicPulse — built for the Vibe2Ship hackathon · Community Hero track</p>
      </footer>
    </div>
  );
}