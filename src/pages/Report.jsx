import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import './Report.css';

export default function Report() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const [usingFallbackLocation, setUsingFallbackLocation] = useState(false);

  const detectLocation = () => {
    setLocating(true);
    setError('');
    setUsingFallbackLocation(false);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device. Please enable location access or try a different browser.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setError('Could not access your location. Please allow location permission and try again — accurate location is required so the right authority sees this report.');
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!imageFile) return setError('Please attach a photo of the issue.');
    if (!title.trim()) return setError('Please give the issue a short title.');
    if (!location) return setError('Please detect or set the location first.');

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('lat', location.lat);
      formData.append('lng', location.lng);
      formData.append('address', address);

      const { data } = await api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(`/issues/${data.issue._id}`, { state: { aiMock: data.aiMock } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report">
      <div className="report__header">
        <h1>File a report</h1>
        <p>A clear photo and pinned location are all the AI needs to start the record.</p>
      </div>

      <form className="report__form" onSubmit={handleSubmit}>
        {error && <div className="report__error">{error}</div>}

        <div className="report__section">
          <label className="report__label">1. Photo of the issue</label>
          <div
            className="report__dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="report__preview" />
            ) : (
              <div className="report__dropzone-empty">
                <span className="report__dropzone-icon">📷</span>
                <span>Tap to take or upload a photo</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            hidden
          />
        </div>

        <div className="report__section">
          <label className="report__label">2. Location</label>
          <button type="button" className="report__locate-btn" onClick={detectLocation} disabled={locating}>
            {locating ? 'Detecting…' : location ? `📍 ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : '📍 Use my current location'}
          </button>
          {!location && (
            <button
              type="button"
              className="report__manual-link"
              onClick={() => {
                setLocation({ lat: 28.6139, lng: 77.209 });
                setUsingFallbackLocation(true);
                setError('');
              }}
            >
              Can't access location? Use a default demo pin instead
            </button>
          )}
          {usingFallbackLocation && (
            <p className="report__fallback-note">⚠️ Using a default demo location, not your real position — fine for a demo, but a real report should use your actual location.</p>
          )}
          <input
            className="report__input"
            type="text"
            placeholder="Optional: add a landmark or address note"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="report__section">
          <label className="report__label">3. Title</label>
          <input
            className="report__input"
            type="text"
            placeholder="e.g. Deep pothole outside Sector 12 market"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
          />
        </div>

        <div className="report__section">
          <label className="report__label">4. Description (optional)</label>
          <textarea
            className="report__textarea"
            placeholder="Add any detail that helps — how long it's been there, who it affects, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={4}
          />
        </div>

        <p className="report__ai-note">
          🤖 Our AI will automatically detect the category and severity from your photo — no need to select it manually.
        </p>

        <button className="btn btn--primary report__submit" disabled={submitting}>
          {submitting ? 'Submitting & analyzing…' : 'Submit report'}
        </button>
      </form>
    </div>
  );
}
