import { useEffect, useState } from 'react';

const emptyEvent = {
  titulo: '',
  data: '',
  cidade: '',
  descricao: '',
};

function EventForm({ editingEvent, onSubmit, onCancelEdit }) {
  const [formData, setFormData] = useState(emptyEvent);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        titulo: editingEvent.titulo,
        data: editingEvent.data,
        cidade: editingEvent.cidade,
        descricao: editingEvent.descricao || '',
      });
    }
  }, [editingEvent]);

  const errors = {
    titulo: submitted && !formData.titulo.trim(),
    data: submitted && !formData.data,
    cidade: submitted && !formData.cidade.trim(),
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);

    if (!formData.titulo.trim() || !formData.data || !formData.cidade.trim()) {
      return;
    }

    await onSubmit({
      ...formData,
      titulo: formData.titulo.trim(),
      cidade: formData.cidade.trim(),
      descricao: formData.descricao.trim(),
    });

    setFormData(emptyEvent);
    setSubmitted(false);
  }

  function handleCancelEdit() {
    setFormData(emptyEvent);
    setSubmitted(false);
    onCancelEdit();
  }

  return (
    <div className="events-form-wrapper">
      <h2>Criar Novo Evento</h2>
      <form className="event-form" id="eventForm" onSubmit={handleSubmit}>
        <div className={`form-group${errors.titulo ? ' has-error' : ''}`}>
          <label htmlFor="evento-titulo">Título do Evento</label>
          <input
            type="text"
            id="evento-titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
          <div className="error-message" id="error-evento-titulo">Título é obrigatório.</div>
        </div>
        <div className={`form-group${errors.data ? ' has-error' : ''}`}>
          <label htmlFor="evento-data">Data</label>
          <input
            type="date"
            id="evento-data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
          <div className="error-message" id="error-evento-data">Data é obrigatória.</div>
        </div>
        <div className={`form-group${errors.cidade ? ' has-error' : ''}`}>
          <label htmlFor="evento-cidade">Local</label>
          <input
            type="text"
            id="evento-cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            required
          />
          <div className="error-message" id="error-evento-cidade">Local é obrigatório.</div>
        </div>
        <div className="form-group">
          <label htmlFor="evento-descricao">Descrição</label>
          <textarea
            id="evento-descricao"
            name="descricao"
            rows="4"
            value={formData.descricao}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" id="btn-submit-evento">
          {editingEvent ? 'Atualizar Evento' : 'Adicionar Evento'}
        </button>
        {editingEvent && (
          <button type="button" className="btn" onClick={handleCancelEdit}>Cancelar edição</button>
        )}
      </form>
    </div>
  );
}

export default EventForm;
