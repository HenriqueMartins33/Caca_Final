import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { loginUser, parseApiError } from '../services/api.js';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const errors = {
    email: submitted && !formData.email.trim(),
    password: submitted && !formData.password,
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    setError('');

    if (!formData.email.trim() || !formData.password) return;

    try {
      setLoading(true);
      const data = await loginUser(formData.email.trim(), formData.password);
      login(data.user, data.token);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="contact">
        <div className="contact-form-wrapper">
          <h2>Entrar</h2>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className={`form-group${errors.email ? ' has-error' : ''}`}>
              <label htmlFor="login-email">E-mail</label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemplo@email.com"
              />
              <div className="error-message">E-mail é obrigatório.</div>
            </div>
            <div className={`form-group${errors.password ? ' has-error' : ''}`}>
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="A sua password"
              />
              <div className="error-message">Password é obrigatória.</div>
            </div>
            {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
            <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
            <p>Ainda não tem conta? <Link to="/register">Criar conta</Link></p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
