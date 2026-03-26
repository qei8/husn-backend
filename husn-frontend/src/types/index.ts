export interface User {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  role: 'admin' | 'employee';
  isActive: boolean;
}

export interface UAVTelemetry {
  id: string;
  battery: number;
  signal: number;
  temperature: number;
  windSpeed: number;
  humidity: number;
  altitude: number;
  speed: number;
  lat: number;
  lon: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
  thumbnail?: string;
  description?: string;
}

export interface Incident {
  id: string;
  alertId: string;
  status: 'active' | 'resolved' | 'dismissed' | 'pending';
  startTime: string;
  endTime?: string;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  confidence: number;
  severity: number;
  description: string;
  media: string[];
  createdBy: string;
}

export interface UserSettings {
  mapView: 'satellite' | 'standard';
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
}
