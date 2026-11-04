import { useEffect, useState } from 'react';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import { geoJSON } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import MapBanner from '../../ui/MapBanner';

type BoundaryFeature = Feature<Polygon, { psgc: string; name: string }>;

const SOURCE_URL = 'https://data.humdata.org/dataset/cod-ab-phl';

/** Loaded on demand so the 49 KB of geometry stays out of the page bundle. */
const loadBoundaries = () =>
  import('../../../data/barangay-boundaries.json').then(
    m => m.default as unknown as FeatureCollection<BoundaryFeature['geometry']>
  );

interface BarangayLocationProps {
  /** 10-digit PSGC code, e.g. "0304903002". */
  psgcCode: string;
  label: string;
  caption: string;
}

export default function BarangayLocation({
  psgcCode,
  label,
  caption,
}: BarangayLocationProps) {
  // undefined = loading, null = no boundary for this code.
  // Callers key this component by psgcCode, so a new barangay starts fresh.
  const [feature, setFeature] = useState<BoundaryFeature | null>();
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let live = true;
    loadBoundaries()
      .then(fc => {
        const match = fc.features.find(f => f.properties?.psgc === psgcCode);
        if (live) setFeature((match as BoundaryFeature) ?? null);
      })
      .catch(() => live && setLoadFailed(true));
    return () => {
      live = false;
    };
  }, [psgcCode]);

  if (loadFailed) {
    return (
      <div
        role="status"
        className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-inset ring-gray-200"
      >
        The map of {label} couldn’t load. Check your connection and refresh the
        page.
      </div>
    );
  }

  if (feature === null) {
    return (
      <MapBanner className="mt-4" label={label} caption={caption} size="sm" />
    );
  }

  return (
    <section
      className="mt-4 overflow-hidden rounded-xl ring-1 ring-black/10"
      aria-label={`Map of ${label} boundary`}
    >
      {/* z-0 traps Leaflet's z-index 400+ panes below the sticky header. */}
      <div className="relative z-0 h-72 sm:h-80">
        {feature ? (
          <MapContainer
            bounds={geoJSON(feature).getBounds()}
            boundsOptions={{ padding: [24, 24] }}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
              data={feature}
              style={{
                color: '#0066eb',
                weight: 3,
                dashArray: '8 6',
                fillColor: '#0066eb',
                fillOpacity: 0.12,
              }}
            />
          </MapContainer>
        ) : (
          <div className="h-full bg-gray-100" role="status">
            <span className="sr-only">Loading map of {label}</span>
          </div>
        )}
      </div>
      <p className="bg-gray-50 px-4 py-3 text-xs text-gray-700">
        The dashed line shows roughly where {label} is. For exact boundaries,
        ask your barangay hall. Boundary data:{' '}
        <a
          className="underline"
          href={SOURCE_URL}
          target="_blank"
          rel="noreferrer"
        >
          NAMRIA and PSA via OCHA (CC BY-IGO)
        </a>
        .
      </p>
    </section>
  );
}
