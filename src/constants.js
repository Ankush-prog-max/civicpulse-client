export const CATEGORIES = {
  pothole: { label: 'Pothole', icon: '🕳️', color: '#D6753E' },
  streetlight: { label: 'Streetlight', icon: '💡', color: '#E0A458' },
  garbage: { label: 'Garbage', icon: '🗑️', color: '#8AA399' },
  water_leakage: { label: 'Water Leakage', icon: '💧', color: '#4A90A4' },
  sewage: { label: 'Sewage / Drain', icon: '🌊', color: '#5C7A8A' },
  road_damage: { label: 'Road Damage', icon: '🛣️', color: '#9B7653' },
  illegal_dumping: { label: 'Illegal Dumping', icon: '🚛', color: '#A65D57' },
  public_property_damage: { label: 'Property Damage', icon: '🏛️', color: '#7C6FA8' },
  tree_fallen: { label: 'Fallen Tree', icon: '🌳', color: '#5B8C5A' },
  other: { label: 'Other', icon: '📍', color: '#6B7785' },
};

export const STATUSES = {
  reported: { label: 'Reported', color: '#6B7785', order: 0 },
  verified: { label: 'Verified', color: '#4A90A4', order: 1 },
  in_progress: { label: 'In Progress', color: '#F2A93B', order: 2 },
  resolved: { label: 'Resolved', color: '#3D8361', order: 3 },
  rejected: { label: 'Rejected', color: '#C44536', order: 4 },
};

export const SEVERITIES = {
  low: { label: 'Low', color: '#8AA399' },
  medium: { label: 'Medium', color: '#E0A458' },
  high: { label: 'High', color: '#D6753E' },
  critical: { label: 'Critical', color: '#C44536' },
};

export function getCategoryMeta(key) {
  return CATEGORIES[key] || CATEGORIES.other;
}
export function getStatusMeta(key) {
  return STATUSES[key] || STATUSES.reported;
}
export function getSeverityMeta(key) {
  return SEVERITIES[key] || SEVERITIES.medium;
}

export function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hr', 3600],
    ['min', 60],
  ];
  for (const [name, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${name === 'hr' || name === 'min' ? name : name[0]} ago`;
  }
  return 'just now';
}
