import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="hero" id="inicio" aria-label="Cabeçalho e introdução">
      <div className="hero-carousel" aria-hidden="true">
        <img
          src="/assets/images/caca-1.avif"
          srcSet="/assets/images/caca-1-sm.avif 640w, /assets/images/caca-1-md.avif 1024w, /assets/images/caca-1-lg.avif 1297w, /assets/images/caca-1.avif 2752w"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          alt=""
          className="active"
          fetchPriority="high"
        />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-topbar">
        <div className="hero-container topbar-inner">
          <a href="#inicio" className="brand" aria-label="Centro Académico Clínico dos Açores — Voltar ao início">
            <img
              src="/assets/images/logo-caduceus.png"
              alt="Logótipo do CACA — Símbolo de saúde e academia"
              className="brand-logo"
              width="32"
              height="32"
            />
            <span className="brand-caca">CACA</span>
            <span className="brand-divider"></span>
            <span className="brand-full">CENTRO ACADÉMICO CLÍNICO DOS AÇORES</span>
          </a>
          <input type="checkbox" id="menu-toggle" className="menu-checkbox" aria-hidden="true" />
          <label htmlFor="menu-toggle" className="menu-button" aria-label="Abrir menu">
            <span className="hamburger"></span>
          </label>
          <nav className="hero-nav" aria-label="Navegação principal">
            <a href="#missao">Sobre</a>
            <a href="#areas">Investigação</a>
            <a href="#parceiros">Parceiros</a>
            <a href="#noticias">Notícias</a>
            <a href="#eventos">Eventos</a>
            <a href="#newsletter">Newsletter</a>
            <a href="#contactos">Contactos</a>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile">{user?.nome}</Link>
                <button type="button" className="btn btn-primary nav-contact" onClick={handleLogout}>Sair</button>
              </>
            ) : (
              <>
                <Link to="/login">Entrar</Link>
                <Link to="/register" className="btn btn-primary nav-contact">Registar</Link>
              </>
            )}
          </nav>
        </div>
      </div>
      <div className="hero-container hero-content">
        <h1>Centro Académico Clínico <span>dos Açores</span></h1>
        <p>Um consórcio que pretende, pelas sinergias entre os seus membros, desenvolver e consolidar um centro de excelência, reconhecido a nível nacional e internacional, na formação pré e pós-graduada de profissionais de saúde, no desenvolvimento de estratégias de investigação inovadoras.</p>
        <div className="hero-actions">
          <a href="#missao" className="btn btn-primary">Conhecer o CACA</a>
          <a href="#areas" className="btn btn-ghost">Saber mais</a>
        </div>
      </div>
    </header>
  );
}

export default Header;