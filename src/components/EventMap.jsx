import { useEffect, useRef, useState } from 'react';

function EventMap({ city, mapId, visible }) {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visible || !city || mapRef.current) return undefined;

    let cancelled = false;

    async function initMap() {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (cancelled) return;
        if (!data.length) throw new Error('Cidade não encontrada');
        if (!window.L) throw new Error('Leaflet indisponível');

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        mapRef.current = window.L.map(mapId).setView([lat, lon], 13);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(mapRef.current);
        window.L.marker([lat, lon]).addTo(mapRef.current);
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      }
    }

    initMap();

    return () => {
      cancelled = true;
    };
  }, [city, mapId, visible]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  if (error) {
    return <div id={mapId} style={{ color: 'red', fontSize: '0.8em' }}>Mapa indisponível</div>;
  }

  return <div id={mapId} style={{ display: visible ? 'block' : 'none' }}></div>;
}

export default EventMap;
