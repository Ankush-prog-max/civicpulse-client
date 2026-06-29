import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { getCategoryMeta, getStatusMeta } from '../constants';
import Loader from '../components/Loader';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

const DEFAULT_CENTER = [28.6139, 77.209]; // Delhi — adjust to your demo city

export default function MapView() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/issues').then((res) => setIssues(res.data.issues)).finally(() => setLoading(false));
  }, []);

  const center = issues.length > 0
    ? [issues[0].location.lat, issues[0].location.lng]
    : DEFAULT_CENTER;

  return (
    <div className="mapview">
      <div className="mapview__header">
        <h1>Issue map</h1>
        <p>Every pin is a reported issue, colored by current status.</p>
        <div className="mapview__legend">
          {['reported', 'verified', 'in_progress', 'resolved'].map((s) => {
            const meta = getStatusMeta(s);
            return (
              <span key={s} className="mapview__legend-item">
                <span className="mapview__legend-dot" style={{ background: meta.color }} /> {meta.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mapview__map-wrap">
        {loading ? (
          <Loader label="Plotting issues on the map…" />
        ) : (
          <MapContainer center={center} zoom={13} className="mapview__map" scrollWheelZoom>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {issues.map((issue) => {
              const statusMeta = getStatusMeta(issue.status);
              const catMeta = getCategoryMeta(issue.category);
              return (
                <CircleMarker
                  key={issue._id}
                  center={[issue.location.lat, issue.location.lng]}
                  radius={9}
                  pathOptions={{
                    color: statusMeta.color,
                    fillColor: statusMeta.color,
                    fillOpacity: 0.7,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="mapview__popup">
                      <strong>{catMeta.icon} {issue.title}</strong>
                      <p>{statusMeta.label}</p>
                      <Link to={`/issues/${issue._id}`}>View full report →</Link>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
