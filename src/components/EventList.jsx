import EventCard from './EventCard.jsx';

function EventList({ events, loading, error, onEdit, onDelete }) {
  if (loading) {
    return <div className="events-grid" id="events-grid"><p className="eventos-empty">A carregar eventos...</p></div>;
  }

  if (error) {
    return <div className="events-grid" id="events-grid"><p className="eventos-empty">Erro ao carregar eventos.</p></div>;
  }

  if (events.length === 0) {
    return <div className="events-grid" id="events-grid"><p className="eventos-empty">Ainda não foram criados eventos.</p></div>;
  }

  return (
    <div className="events-grid" id="events-grid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default EventList;
