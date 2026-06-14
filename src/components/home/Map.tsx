import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { cityHallLocation, siteConfig } from '../../lib/siteConfig';
import { Link } from 'react-router-dom';

const cityHallMarkerIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Map() {
  const position: [number, number] = [
    cityHallLocation.latitude,
    cityHallLocation.longitude,
  ];

  return (
    <Section className="bg-gray-50">
      <div className="text-center mb-8">
        <Heading level={2}>Visit City Hall</Heading>
        <p className="text-gray-600 mt-2 flex items-center justify-center gap-2 max-w-2xl mx-auto">
          <MapPin className="w-4 h-4 shrink-0" />
          <Link
            className="hover:underline text-primary-600"
            to="https://maps.google.com/maps?vet=10CAAQoqAOahcKEwjY-rLh1YSVAxUAAAAAHQAAAAAQFw..i&sca_esv=9773526fc95a52cb&pvq=CgwvZy8xaGMydGh6Y3I&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=ph&sa=X&ftid=0x339728f23e83546d:0xfa3d267b6c7aa1c1"
          >
            {cityHallLocation.address}
          </Link>
        </p>
      </div>

      <div className="relative isolate z-0 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer
          center={position}
          zoom={cityHallLocation.zoom}
          scrollWheelZoom={false}
          className="relative z-0"
          style={{ height: '400px', width: '100%' }}
        >
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
      </div>
    </Section>
  );
}
