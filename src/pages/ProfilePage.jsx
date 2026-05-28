import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteUser, getAllUsers, getProfile, parseApiError, updateProfile } from '../services/api.js';

function ProfilePage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout, updateUser } = useAuth();
  const [formData, setFormData] = useState({ nome: user?.nome || '', email: user?.email || '' });
  const [users, setUsers] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    async function loadProfile() {
      try {
        const data = await getProfile(token);
        updateUser(data.user);
        setFormData({ nome: data.user.nome, email: data.user.email });

        if (data.user.role === 'admin') {
          const usersData = await getAllUsers(token);
          setUsers(usersData.users);
        }
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [isAuthenticated, navigate, token]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const data = await updateProfile(token, {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
      });
      updateUser(data.user);
      setMessage('Perfil atualizado com sucesso.');
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  async function handleDeleteUser(id) {
    if (!confirm('Tem a certeza que deseja eliminar este utilizador?')) return;

    try {
      await deleteUser(token, id);
      setUsers((current) => current.filter((listedUser) => listedUser.id !== id));
      setMessage('Utilizador eliminado com sucesso.');
    } catch (err) {
      setError(parseApiError(err));
    }
  }

  if (!isAuthenticated) return null;

  return (
    <main className="page">
      <section className="contact">
        <div className="contact-form-wrapper">
          <h2>Perfil</h2>
          {loadingProfile ? (
            <p>A carregar perfil...</p>
          ) : (
            <form className="contact-form" onSubmit={handleSave} noValidate>
              <div className="form-group">
                <label htmlFor="profile-nome">Nome</label>
                <input
                  type="text"
                  id="profile-nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="profile-email">E-mail</label>
                <input
                  type="email"
                  id="profile-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {message && <div className="success-message"><span>{message}</span></div>}
              {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
              <button type="submit" className="btn btn-primary btn-submit" disabled={saving}>
                {saving ? 'A guardar...' : 'Guardar alterações'}
              </button>
              <button type="button" className="btn" onClick={handleLogout}>Terminar sessão</button>
            </form>
          )}
        </div>
      </section>

      {user?.role === 'admin' && (
        <section className="events">
          <div className="events-list-wrapper">
            <h2>Gestão de utilizadores</h2>
            <div className="events-grid">
              {users.map((listedUser) => (
                <article className="event-card" key={listedUser.id}>
                  <h3>{listedUser.nome}</h3>
                  <p><strong>Email: </strong>{listedUser.email}</p>
                  <p><strong>Role: </strong>{listedUser.role}</p>
                  <div className="event-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleDeleteUser(listedUser.id)}
                      disabled={listedUser.id === user.id}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default ProfilePage;
