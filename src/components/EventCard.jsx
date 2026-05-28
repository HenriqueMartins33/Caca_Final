import { useState } from 'react';
import { useWeather } from '../hooks/useWeather.js';
import EventMap from './EventMap.jsx';

function formatEventDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-PT');
}

function EventCard({ event, onEdit, onDelete }) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const { weather, loading, error } = useWeather(event.cidade, detailsVisible);
  const weatherId = `weather-event-${event.id}`;
  const mapId = `map-event-${event.id}`;

  function handleDelete() {
    if (confirm('Tem a certeza que deseja remover este evento?')) {
      onDelete(event.id);
    }
  }

  return (
    <article className="event-card" data-id={event.id}>
      <h3>{event.titulo}</h3>
      <p><strong>Data: </strong>{formatEventDate(event.data)}</p>
      <p><strong>Local: </strong>{event.cidade}</p>
      {event.descricao && <p>{event.descricao}</p>}

      <div className="event-actions">
        <button type="button" className="btn" onClick={() => onEdit(event)}>Editar</button>
        <button type="button" className="btn btn-primary" onClick={handleDelete}>Remover</button>
      </div>

      <button
        type="button"
        className="btn btn-ghost btn-ver-tempo"
        onClick={() => setDetailsVisible((current) => !current)}
      >
        <span className="material-symbols-outlined">
          {detailsVisible ? 'expand_less' : 'partly_cloudy_day'}
        </span>
        {detailsVisible ? ' Ocultar Tempo & Localização' : ' Ver Tempo & Localização'}
      </button>

      {detailsVisible && (
        <div id={weatherId}>
          {loading && <div className="weather-widget">A carregar meteorologia...</div>}
          {error && <div style={{ color: 'red', fontSize: '0.8em' }}>Dados meteorológicos indisponíveis</div>}
          {weather && (
            <div className="weather-widget">
              <strong>{weather.temperature}°C </strong>
              <span>- {weather.description}</span>
            </div>
          )}
        </div>
      )}

      <EventMap city={event.cidade} mapId={mapId} visible={detailsVisible} />
    </article>
  );
}

export default EventCard;
