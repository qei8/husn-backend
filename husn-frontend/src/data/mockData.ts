import { Alert, UAVTelemetry, Incident } from '@/types';

export const mockTelemetry: UAVTelemetry = {
  id: 'UAV-001',
  battery: 78,
  signal: 92,
  temperature: 34,
  windSpeed: 12,
  humidity: 45,
  altitude: 150,
  speed: 25,
  lat: 24.7136,
  lon: 46.6753,
  timestamp: new Date().toISOString(),
};

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    location: { lat: 24.7256, lon: 46.6890, name: 'Al Malaz District - Sector 7' },
    confidence: 94,
    severity: 'critical',
    status: 'active',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    thumbnail: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?w=300&h=200&fit=crop',
    description: 'High intensity fire detected in vegetation area',
  },
  {
    id: 'ALT-002',
    location: { lat: 24.7100, lon: 46.6600, name: 'Industrial Zone - Block C' },
    confidence: 78,
    severity: 'high',
    status: 'pending',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    thumbnail: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=300&h=200&fit=crop',
    description: 'Smoke detected near warehouse facility',
  },
  {
    id: 'ALT-003',
    location: { lat: 24.7050, lon: 46.6950, name: 'Eastern Perimeter - Gate 4' },
    confidence: 65,
    severity: 'medium',
    status: 'resolved',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    description: 'Heat signature detected - confirmed as controlled burn',
  },
  {
    id: 'ALT-004',
    location: { lat: 24.7200, lon: 46.6700, name: 'Forest Reserve - North' },
    confidence: 88,
    severity: 'high',
    status: 'active',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    thumbnail: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=300&h=200&fit=crop',
    description: 'Active fire spreading in forested area',
  },
];

export const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    alertId: 'ALT-001',
    status: 'active',
    startTime: new Date(Date.now() - 5 * 60000).toISOString(),
    location: { lat: 24.7256, lon: 46.6890, name: 'Al Malaz District - Sector 7' },
    confidence: 94,
    severity: 5,
    description: 'High intensity fire detected in vegetation area. Emergency response dispatched.',
    media: [
      'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?w=800',
      'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800',
    ],
    createdBy: 'AI',
  },
];
