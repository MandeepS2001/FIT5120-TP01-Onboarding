import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ParkingLocation } from '../types/parking';
import { GoogleMap, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

type Props = {
  locations: ParkingLocation[];
  height?: number | string;
  initialCenter?: [number, number];
  initialZoom?: number;
};

const ParkingMap: React.FC<Props> = ({
  locations,
  height = 420,
  initialCenter = [-37.8136, 144.9631], // Melbourne CBD
  initialZoom = 14,
}) => {
  const center = useMemo(() => ({ lat: initialCenter[0], lng: initialCenter[1] }), [initialCenter]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: ['marker'],
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<any[]>([]);

  // Create Advanced Markers when map or locations change
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !(window as any).google) return;

    // Clear existing markers
    markersRef.current.forEach((m) => {
      if (m && m.map) m.map = null;
    });
    markersRef.current = [];

    const g = (window as any).google as typeof google;
    const AdvancedMarker = (g.maps as any).marker?.AdvancedMarkerElement;
    if (!AdvancedMarker) return;

    locations.forEach((loc) => {
      const marker = new AdvancedMarker({
        map: mapRef.current,
        position: { lat: loc.latitude, lng: loc.longitude },
        title: loc.name,
      });
      // AdvancedMarker uses 'gmp-click'
      marker.addListener('gmp-click', () => setActiveId(loc.id));
      markersRef.current.push(marker);
    });
  }, [isLoaded, locations]);

  return (
    <Box sx={{ height, borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={initialZoom}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: true,
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
              { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
              { featureType: 'poi', stylers: [{ visibility: 'off' }] },
              { featureType: 'transit.station', stylers: [{ visibility: 'off' }] },
            ],
          }}
          onLoad={(map) => {
            mapRef.current = map;
            if (locations.length && (window as any).google) {
              const g = (window as any).google as typeof google;
              const b = new g.maps.LatLngBounds();
              locations.forEach((l) => b.extend({ lat: l.latitude, lng: l.longitude }));
              map.fitBounds(b, { top: 40, bottom: 40, left: 40, right: 40 } as any);
            }
          }}
        >
          {/* Advanced markers created imperatively below */}
          {locations.map(
            (loc) =>
              activeId === loc.id && (
                <InfoWindow
                  key={`iw-${loc.id}`}
                  position={{ lat: loc.latitude, lng: loc.longitude }}
                  onCloseClick={() => setActiveId(null)}
                >
                  <Box>
                    <Typography variant="subtitle2">{loc.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {loc.type === 'on_street' ? 'On-street' : 'Off-street'} · {loc.available} available
                      {loc.capacity ? ` / ${loc.capacity}` : ''}
                      {loc.pricePerHour ? ` · $${loc.pricePerHour.toFixed(2)}/hr` : ''}
                    </Typography>
                  </Box>
                </InfoWindow>
              )
          )}
        </GoogleMap>
      )}
    </Box>
  );
};

export default ParkingMap;


