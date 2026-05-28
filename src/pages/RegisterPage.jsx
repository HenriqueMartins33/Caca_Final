import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { parseApiError, registerUser } from '../services/api.js';

const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
const NAME_PATTERN = /^[a-zA-ZÀ-ÖØ-öø-ÿçñ\s'-]+$/;

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    nome: '', email: '', password: '', confirmPassword: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  const validation = {
    nome: {
      missing: submitted && !formData.nome.trim(),
      short: submitted && formData.nome.trim().length < 2,
      invalid: submitted && formData.nome.trim().length >= 2 && !NAME_PATTERN.test(formData.nome.trim()),
    },
    email: {
      missing: submitted && !formData.email.trim(),
      format: submitted && formData.email.trim() && !EMAIL_PATTERN.test(formData.email.trim()),
    },
    password: {
      missing: submitted && !formData.password,
      short: submitted && formData.password && formData.password.length < 8,
    },
    confirmPassword: {
      missing: submitted && !formData.confirmPassword,
      mismatch: submitted && formData.confirmPassword && formData.password !== formData.confirmPassword,
    },
  };

  const hasErrors =
    validation.nome.missing || validation.nome.short || validation.nome.invalid ||
    validation.email.missing || validation.email.format ||
    validation.password.missing || validation.password.short ||
    validation.confirmPassword.missing || validation.confirmPassword.mismatch;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    setError('');
    if (hasErrors) return;

    try {
      setLoading(true);
      const data = await registerUser(formData.nome.trim(), formData.email.trim(), formData.password);
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
          <h2>Criar conta</h2>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>

            {/* NOME */}
            <div className={`form-group${(validation.nome.missing || validation.nome.short || validation.nome.invalid) ? ' has-error' : ''}`}>
              <label htmlFor="register-nome">Nome</label>
              <input type="text" id="register-nome" name="nome"
                value={formData.nome} onChange={handleChange}
                placeholder="O seu nome completo" />
              {validation.nome.missing && <div className="error-message" style={{display:'block'}}>Nome é obrigatório.</div>}
              {validation.nome.short && !validation.nome.missing && <div className="error-message" style={{display:'block'}}>Nome deve ter pelo menos 2 caracteres.</div>}
              {validation.nome.invalid && <div className="error-message" style={{display:'block'}}>Nome deve conter apenas letras e espaços.</div>}
            </div>

            {/* EMAIL */}
            <div className={`form-group${(validation.email.missing || validation.email.format) ? ' has-error' : ''}`}>
              <label htmlFor="register-email">E-mail</label>
              <input type="email" id="register-email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="exemplo@email.com" />
              {validation.email.missing && <div className="error-message" style={{display:'block'}}>E-mail é obrigatório.</div>}
              {validation.email.format && !validation.email.missing && <div className="error-message" style={{display:'block'}}>Por favor, insira um e-mail válido.</div>}
            </div>

            {/* PASSWORD */}
            <div className={`form-group${(validation.password.missing || validation.password.short) ? ' has-error' : ''}`}>
              <label htmlFor="register-password">Password</label>
              <input type="password" id="register-password" name="password"
                value={formData.password} onChange={handleChange}
                placeholder="Mínimo 8 caracteres" />
              {validation.password.missing && <div className="error-message" style={{display:'block'}}>Password é obrigatória.</div>}
              {validation.password.short && !validation.password.missing && <div className="error-message" style={{display:'block'}}>Password deve ter pelo menos 8 caracteres.</div>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className={`form-group${(validation.confirmPassword.missing || validation.confirmPassword.mismatch) ? ' has-error' : ''}`}>
              <label htmlFor="register-confirm-password">Confirmar password</label>
              <input type="password" id="register-confirm-password" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="Repita a password" />
              {validation.confirmPassword.missing && <div className="error-message" style={{display:'block'}}>Confirmação é obrigatória.</div>}
              {validation.confirmPassword.mismatch && !validation.confirmPassword.missing && <div className="error-message" style={{display:'block'}}>As passwords não coincidem.</div>}
            </div>

            {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
            <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
              {loading ? 'A criar conta...' : 'Criar conta'}
            </button>
            <p>Já tem conta? <Link to="/login">Entrar</Link></p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;