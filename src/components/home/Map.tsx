import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { cityHallLocation, siteConfig } from '../../lib/siteConfig';
import { useTranslation } from 'react-i18next';

export const MAP_PANEL_HEIGHT = 400;

const cityHallMarkerIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${cityHallLocation.latitude},${cityHallLocation.longitude}`;

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const resize = () => map.invalidateSize();
    resize();
    const timeoutId = window.setTimeout(resize, 150);
    window.addEventListener('resize', resize);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', resize);
    };
  }, [map]);

  return null;
}

export default function Map() {
  const { t } = useTranslation('common');
  const [isMounted, setIsMounted] = useState(false);
  const position: [number, number] = [
    cityHallLocation.latitude,
    cityHallLocation.longitude,
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Section className="h-full !py-8">
      <div className="text-center mb-4">
        <Heading level={2} className="text-balance">
          {t('map.title')}
        </Heading>
        <p className="text-gray-600 mt-2 flex items-center justify-center gap-2 max-w-2xl mx-auto text-sm text-pretty">
          <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
          <a
            className="inline-flex min-h-[44px] items-center hover:underline text-primary-600 transition-colors duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {cityHallLocation.address}
          </a>
        </p>
      </div>

      <div
        className="relative z-0 rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06] bg-gray-100"
        style={{ height: MAP_PANEL_HEIGHT }}
      >
        {isMounted ? (
          <MapContainer
            center={position}
            zoom={cityHallLocation.zoom}
            scrollWheelZoom={false}
            className="h-full w-full z-0 outline outline-1 outline-black/10"
            style={{ height: MAP_PANEL_HEIGHT, width: '100%' }}
          >
            <MapResizeHandler />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={cityHallMarkerIcon}>
              <Popup>
                <strong>{siteConfig.governmentName}</strong>
                <br />
                {cityHallLocation.address}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div
            className="h-full w-full animate-pulse bg-gray-200"
            aria-hidden="true"
          />
        )}
      </div>
    </Section>
  );
}
