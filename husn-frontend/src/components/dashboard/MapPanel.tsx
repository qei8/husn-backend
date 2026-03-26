import { useMemo, useState, useEffect, useRef } from 'react';
import { getCurrentWeather } from "@/lib/weatherApi";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  MapPin,
} from 'lucide-react';
import { UAVTelemetry, Alert } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface MapPanelProps {
  telemetry: UAVTelemetry;
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const MapPanel = ({ telemetry, alerts, onAlertClick }: MapPanelProps) => {
  const { t } = useLanguage();
  const [mapType, setMapType] = useState<'satellite' | 'standard'>('standard');
  const [zoom, setZoom] = useState(12);
  const [weather, setWeather] = useState<any>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const activeAlerts = alerts.filter((a) => a.status === 'active' || a.status === 'pending');

  const center = useMemo(
    () => ({ 
      lat: telemetry.lat !== 0 ? telemetry.lat : 18.2465, 
      lng: telemetry.lon !== 0 ? telemetry.lon : 42.5117 
    }),
    [telemetry.lat, telemetry.lon]
  );

  useEffect(() => {
    if (mapRef.current && telemetry.lat !== 0 && telemetry.lon !== 0) {
      mapRef.current.panTo({ lat: telemetry.lat, lng: telemetry.lon });
    }
  }, [telemetry.lat, telemetry.lon]);

  useEffect(() => {
    if (telemetry.lat && telemetry.lon) {
      getCurrentWeather(telemetry.lat, telemetry.lon)
        .then(setWeather)
        .catch(console.error);
    }
  }, [telemetry.lat, telemetry.lon]);

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.panTo(center);
      setZoom(15);
    }
  };

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="panel-title">{t('surveillanceMap')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={mapType === 'satellite' ? 'default' : 'ghost'}
            className="h-7 text-xs"
            onClick={() => setMapType('satellite')}
          >
            {t('satellite')}
          </Button>
          <Button
            size="sm"
            variant={mapType === 'standard' ? 'default' : 'ghost'}
            className="h-7 text-xs"
            onClick={() => setMapType('standard')}
          >
            {t('standard')}
          </Button>
        </div>
      </div>

      <div className="relative flex-1 bg-muted/30 overflow-hidden">
        {weather && (
          <div className="absolute top-4 left-4 z-30 bg-background/90 border border-border rounded-lg px-4 py-2 shadow-lg text-left">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t('weatherConditions')}</div>
              <div className="text-sm font-bold text-foreground">{weather.main?.temp}°C</div>
              <div className="text-[10px] text-muted-foreground uppercase">{weather.weather?.[0]?.description}</div>
          </div>
        )}

        {mapsApiKey ? (
          <LoadScript googleMapsApiKey={mapsApiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={zoom}
              mapTypeId={mapType === 'satellite' ? 'satellite' : 'roadmap'}
              options={{ 
                streetViewControl: false, 
                fullscreenControl: false,
                mapTypeControl: false,
              }}
              onLoad={(map) => { mapRef.current = map; }}
            >
              <Marker 
                position={center} 
                title={telemetry.id}
                icon={telemetry.lat !== 0 ? {
                  path: 0, 
                  scale: 6,
                  fillColor: "#f97316", 
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#ffffff",
                  rotation: 0, 
                  } : undefined}
              />

              {activeAlerts.map((alert) => (
                <Marker
                  key={alert.id}
                  position={{ lat: alert.location.lat, lng: alert.location.lon }}
                  title={alert.location.name}
                  onClick={() => onAlertClick?.(alert)}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
             <p className="text-xs text-muted-foreground">Google Maps API Key Missing</p>
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-1 z-30">
          <Button size="icon" variant="tactical" className="h-8 w-8" onClick={() => setZoom((z) => Math.min(z + 1, 20))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="tactical" className="h-8 w-8" onClick={() => setZoom((z) => Math.max(z - 1, 1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="tactical" className="h-8 w-8" onClick={handleRecenter}>
            <Crosshair className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 bg-background/80 border border-border rounded px-3 py-2 z-30">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div><span className="text-muted-foreground">LAT: </span>{telemetry.lat.toFixed(4)}</div>
            <div><span className="text-muted-foreground">LON: </span>{telemetry.lon.toFixed(4)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;