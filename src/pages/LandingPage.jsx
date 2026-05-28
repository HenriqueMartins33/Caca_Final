import { useEffect, useState } from 'react';
import { HeroCarousel } from '../../js/modules/HeroCarousel.js';
import { ScrollManager } from '../../js/modules/ScrollManager.js';
import { TiltEffect } from '../../js/modules/TiltEffect.js';
import { ContactForm } from '../../js/modules/ContactForm.js';
import { NewsletterManager } from '../../js/modules/NewsletterManager.js';
import { AnimationManager } from '../../js/modules/Animations.js';
import { ChartManager } from '../../js/modules/ChartManager.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import StatCard from '../components/StatCard.jsx';
import AreaCard from '../components/AreaCard.jsx';
import OppCard from '../components/OppCard.jsx';
import NewsCard from '../components/NewsCard.jsx';
import EventForm from '../components/EventForm.jsx';
import EventList from '../components/EventList.jsx';
import { useNews } from '../hooks/useNews.js';
import { useEvents } from '../hooks/useEvents.js';

const stats = [
  { number: '10', text: 'Concursos de apoio à investigação regional realizados.' },
  { number: '€50k', text: 'Atribuídos em apoios a publicações e biobanco açoriano.' },
  { number: '20+', text: 'Investigadores apoiados em projetos insulares.' },
  { number: '1', text: 'Regulamento de reconhecimento mútuo desenvolvido.' },
];

const areas = [
  {
    icon: 'desktop_windows',
    title: 'e-Saúde',
    text: 'Desenvolvimento de plataformas digitais e sistemas de informação em saúde que integram registos eletrónicos, prescrição eletrónica e monitorização do paciente à distância, promovendo a eficiência dos serviços de saúde nos Açores.',
  },
  {
    icon: 'psychology',
    title: 'Inteligência Artificial em Saúde',
    text: 'Aplicação de algoritmos de aprendizagem automática e redes neuronais ao diagnóstico por imagem, previsão de surtos epidemiológicos e personalização de tratamentos, utilizando dados clínicos do ecossistema de saúde regional.',
  },
  {
    icon: 'cell_tower',
    title: 'Telemedicina',
    text: 'Implementação de soluções de consultas remotas e telemonitorização para ultrapassar as barreiras geográficas da insularidade, garantindo o acesso equitativo a cuidados especializados em todas as ilhas do arquipélago.',
  },
  {
    icon: 'biotech',
    title: 'Epidemiologia Insular',
    text: 'Estudo das particularidades epidemiológicas da população açoriana, com foco em doenças raras, genética populacional e fatores ambientais únicos que influenciam a saúde nas ilhas do Atlântico Norte.',
  },
];

const opportunities = [
  {
    tag: 'Estágios',
    title: 'Estágios Clínicos e de Investigação',
    text: 'Oportunidades de estágio em contexto hospitalar e laboratórios de investigação, abertas a alunos de licenciatura e mestrado da Universidade dos Açores e outros parceiros nacionais.',
  },
  {
    tag: 'Bolsas',
    title: 'Bolsas de Investigação',
    text: 'Bolsas anuais de apoio a projetos de investigação em saúde, financiadas pelo Fundo CACA e pela FCT Açores, destinadas a investigadores juniores e séniores.',
  },
  {
    tag: 'Teses',
    title: 'Projetos de Tese e Dissertação',
    text: 'Acompanhamento e co-orientação de teses de mestrado e doutoramento em áreas prioritárias do CACA, com acesso a dados clínicos e infraestruturas laboratoriais.',
  },
];

function LandingPage() {
  const { articles } = useNews('saude+acores', 3);
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const scrollManager = new ScrollManager('scrollTopBtn');
    const tiltEffect = new TiltEffect('.area-card');
    const heroCarousel = new HeroCarousel('.hero-carousel', ['/assets/images/caca-1', '/assets/images/caca-2']);

    new ContactForm('#contactForm');
    new NewsletterManager('#newsletterForm');

    const timer = setTimeout(() => {
      new AnimationManager();
      new ChartManager('investmentChart');
    }, 100);

    return () => {
      clearTimeout(timer);
      scrollManager.destroy?.();
      tiltEffect.destroy?.();
      heroCarousel.destroy?.();
    };
  }, []);

  async function handleSubmitEvent(eventData) {
    if (editingEvent) {
      await updateEvent({ ...eventData, id: editingEvent.id });
      setEditingEvent(null);
      return;
    }

    await addEvent(eventData);
  }

  function handleEditEvent(event) {
    setEditingEvent(event);
    document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="page">
      <Header />

      <section className="mission" id="missao">
        <div className="mission-layout">
          <div className="mission-text">
            <h2>A Nossa Missão</h2>
            <p>O Centro Académico Clínico dos Açores (CACA) é uma unidade de cooperação entre instituições de ensino superior, unidades de saúde e centros de investigação no arquipélago dos Açores. Criado em parceria com o Governo Regional dos Açores e a Universidade dos Açores, o CACA tem por missão promover a excelência na formação de profissionais de saúde, a investigação translacional e a inovação clínica ao serviço da população açoriana.</p>
            <h3>Visão</h3>
            <p>Ser reconhecido nacional e internacionalmente como um polo de referência em investigação clínica e formação avançada, valorizando a singularidade geográfica e biodiversidade dos Açores como ativos estratégicos para a ciência e a saúde.</p>
            <h3>Enquadramento Regional</h3>
            <p>Localizado na Região Autónoma dos Açores, o CACA beneficia de uma posição geográfica privilegiada no Atlântico Norte. A insularidade e as características epidemiológicas únicas da população açoriana oferecem oportunidades singulares para a investigação em saúde, nomeadamente em áreas como a genética populacional, doenças raras e saúde ambiental.</p>
          </div>
          <div className="mission-image">
            <img
              src="/assets/images/mission-azores.jpg"
              alt="Paisagem dos Açores — Lagoa das Sete Cidades na ilha de São Miguel, representativa do enquadramento natural do CACA"
              width="600"
              height="450"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="stats" id="estatisticas">
        <div className="stats-layout">
          <div className="stats-copy">
            <h2>Em 2025, o Centro Académico Clínico dos Açores:</h2>
            <p>Para 2026 queremos continuar a promover a investigação, mas também as melhores práticas clínicas e de gestão, através da rede de sinergias entre todos os membros do CACA.</p>
            <span className="stats-divider" aria-hidden="true"></span>
          </div>
          <div className="stats-grid">
            {stats.map((stat) => (
              <StatCard key={stat.number} number={stat.number} text={stat.text} />
            ))}
          </div>
        </div>
      </section>

      <section className="insights" id="dados">
        <div className="insights-inner">
          <div className="insights-copy">
            <span className="insights-tag">Transparência & Crescimento</span>
            <h2>Evolução do Apoio à Investigação</h2>
            <p>Ao longo dos últimos 5 anos, o compromisso do CACA com a inovação clínica nos Açores cresceu substancialmente. Em 2025, atingimos o marco histórico de <strong>€50.000</strong> em financiamento direto a projetos, publicações e ao biobanco regional.</p>
            <ul className="insights-list">
              <li><span className="material-symbols-outlined" aria-hidden="true">trending_up</span> Crescimento progressivo desde 2021</li>
              <li><span className="material-symbols-outlined" aria-hidden="true">science</span> Foco na investigação translacional</li>
            </ul>
          </div>
          <div className="insights-visual">
            <canvas id="investmentChart" aria-label="Gráfico de Evolução do Apoio à Investigação" role="img"></canvas>
          </div>
        </div>
      </section>

      <section className="areas" id="areas">
        <div className="areas-inner">
          <h2>Áreas de Investigação</h2>
          <p className="areas-subtitle">O CACA desenvolve investigação de excelência em áreas estratégicas para a saúde da população açoriana e para a inovação clínica.</p>
          <div className="areas-grid">
            {areas.map((area) => (
              <AreaCard key={area.title} icon={area.icon} title={area.title} text={area.text} />
            ))}
          </div>
        </div>
      </section>

      <section className="consortium" id="parceiros">
        <h2>O CONSÓRCIO</h2>
        <div className="consortium-grid">
          <article className="consortium-item">
            <span className="dot dot-green">H</span>
            <p>HOSPITAL DO DIVINO ESPÍRITO SANTO</p>
          </article>
          <article className="consortium-item">
            <span className="dot dot-blue">U</span>
            <p>UNIVERSIDADE DOS AÇORES</p>
          </article>
          <article className="consortium-item">
            <span className="dot dot-red">U</span>
            <p>UNIDADE DE SAÚDE ILHA DE SÃO MIGUEL</p>
          </article>
          <article className="consortium-item">
            <span className="dot dot-purple">S</span>
            <p>CENTRO DE ONCOLOGIA DOS AÇORES</p>
          </article>
        </div>
      </section>

      <section className="research" id="investigacao">
        <article className="research-column left">
          <h2>Apoio à investigação</h2>
          <p>Se já só lhe falta apoio financeiro para investigar, o Fundo de Financiamento à Investigação CACA está à disposição de todos os profissionais dos membros do consórcio, com apoios não sujeitos a impostos.</p>
          <a href="#contactos" className="btn btn-light">Ver apoios disponíveis</a>
        </article>
        <article className="research-column right">
          <h2>Quer investigar?</h2>
          <p>Se quer investigar, mas ainda não sabe por onde começar, pode integrar uma bolsa de investigadores e aguardar o contacto. Se já sabe, também pode submeter a sua proposta diretamente.</p>
          <a href="#contactos" className="btn btn-stroke">Aderir à bolsa de investigadores</a>
        </article>
      </section>

      <section className="opportunities" id="oportunidades">
        <div className="opportunities-inner">
          <h2>Oportunidades</h2>
          <p className="opportunities-subtitle">O CACA disponibiliza diversas oportunidades para estudantes, investigadores e profissionais de saúde que queiram contribuir para a investigação e inovação clínica nos Açores.</p>
          <div className="opportunities-grid">
            {opportunities.map((opportunity) => (
              <OppCard
                key={opportunity.title}
                tag={opportunity.tag}
                title={opportunity.title}
                text={opportunity.text}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="notice">
        <div className="notice-inner">
          <p><span className="notice-icon">i</span>Os apoios CACA a publicações requerem, sempre, a menção à afiliação ao consórcio nos artigos concorrentes.</p>
          <a href="#contactos" className="btn btn-notice">Ver exemplos</a>
        </div>
      </section>

      <section className="events" id="eventos">
        <div className="events-head">
          <h2>Eventos</h2>
        </div>
        <div className="events-layout">
          <EventForm
            editingEvent={editingEvent}
            onSubmit={handleSubmitEvent}
            onCancelEdit={() => setEditingEvent(null)}
          />
          <div className="events-list-wrapper">
            <h2>Eventos Disponiveis</h2>
            <EventList
              events={events}
              loading={eventsLoading}
              error={eventsError}
              onEdit={handleEditEvent}
              onDelete={deleteEvent}
            />
          </div>
        </div>
      </section>

      <section className="news" id="noticias">
        <div className="news-head">
          <h2>Notícias</h2>
        </div>
        <div className="news-grid">
          {[0, 1, 2].map((index) => (
            <NewsCard key={index} index={index} article={articles[index]} />
          ))}
        </div>
      </section>

      <section className="contact" id="contactos">
        <div className="contact-layout">
          <div className="contact-info">
            <h2>Contactos e Localização</h2>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon material-symbols-outlined" aria-hidden="true">mail</span>
                <div>
                  <h3>E-mail</h3>
                  <p><a href="mailto:geral@caca.azores.pt">geral@caca.azores.pt</a></p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon material-symbols-outlined" aria-hidden="true">phone</span>
                <div>
                  <h3>Telefone</h3>
                  <p><a href="tel:+351296123456">+351 296 123 456</a></p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon material-symbols-outlined" aria-hidden="true">location_on</span>
                <div>
                  <h3>Morada</h3>
                  <p>Rua da Universidade, n.º 1<br />9500-321 Ponta Delgada<br />Ilha de São Miguel — Açores, Portugal</p>
                </div>
              </div>
            </div>
            <div className="contact-map">
              <img
                src="/assets/images/contact-map.jpg"
                alt="Mapa ilustrativo da localização do CACA em Ponta Delgada, Ilha de São Miguel, Açores"
                width="500"
                height="280"
                loading="lazy"
              />
            </div>
          </div>
          <div className="contact-form-wrapper">
            <h2>Envie-nos uma mensagem</h2>
            <div id="success-message" className="success-message" style={{ display: 'none' }}>
              <span className="success-icon material-symbols-outlined">check_circle</span>
              <div>
                <h3>Mensagem enviada com sucesso!</h3>
                <p>Obrigado por nos contactar. Responderemos à sua mensagem em breve.</p>
              </div>
            </div>
            <form className="contact-form" id="contactForm" action="#" method="post" noValidate>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" placeholder="O seu nome completo" />
                <div className="error-message" id="error-nome" data-error-type="required">Nome é obrigatório.</div>
                <div className="error-message" id="error-nome-length" data-error-type="length">Nome deve ter pelo menos 3 caracteres.</div>
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" name="email" placeholder="exemplo@email.com" />
                <div className="error-message" id="error-email" data-error-type="required">E-mail é obrigatório.</div>
                <div className="error-message" id="error-email-format" data-error-type="format">Por favor, insira um endereço de e-mail válido.</div>
              </div>
              <div className="form-group">
                <label htmlFor="assunto">Assunto</label>
                <select id="assunto" name="assunto" required>
                  <option value="">Selecione um assunto</option>
                  <option value="investigacao-clinica">Investigação Clínica</option>
                  <option value="formacao-saude">Formação em Saúde</option>
                  <option value="suporte-investigadores">Suporte a Investigadores</option>
                  <option value="plataformas-digitais">Plataformas Digitais e Sistemas</option>
                  <option value="parcerias">Parcerias e Colaborações</option>
                  <option value="informacoes-gerais">Informações Gerais</option>
                  <option value="outro">Outro</option>
                </select>
                <div className="error-message" id="error-assunto" data-error-type="required">Assunto é obrigatório.</div>
              </div>
              <div className="form-group">
                <label htmlFor="mensagem">Mensagem</label>
                <textarea id="mensagem" name="mensagem" rows="5" placeholder="Escreva aqui a sua mensagem..."></textarea>
                <div className="error-message" id="error-mensagem" data-error-type="required">Mensagem é obrigatória.</div>
              </div>
              <button type="submit" className="btn btn-primary btn-submit">Enviar Mensagem</button>
            </form>
          </div>
        </div>
      </section>

      <section className="newsletter" id="newsletter" aria-label="Subscrição da Newsletter">
        <div className="newsletter-inner">
          <div className="newsletter-header">
            <span className="newsletter-tag">Fique a par das novidades</span>
            <h2>Subscreva a Nossa Newsletter</h2>
            <p>Receba atualizações sobre investigação clínica, formação avançada, oportunidades e notícias do Centro Académico Clínico dos Açores diretamente na sua caixa de correio.</p>
          </div>
          <div id="newsletter-success-message" className="newsletter-message" aria-live="polite" aria-atomic="true">
            <span className="message-icon material-symbols-outlined">check_circle</span>
            <span>Obrigado pela sua subscrição!</span>
          </div>
          <div id="newsletter-error-message" className="newsletter-message" aria-live="polite" aria-atomic="true">
            <span className="message-icon material-symbols-outlined">error</span>
            <span>Ocorreu um erro. Por favor, tente novamente.</span>
          </div>
          <div className="newsletter-content">
            <div className="newsletter-form-wrapper">
              <form id="newsletterForm" className="newsletter-form" noValidate>
                <div className="form-group">
                  <label htmlFor="newsletter-nome">Nome Completo</label>
                  <input
                    type="text"
                    id="newsletter-nome"
                    name="nome"
                    placeholder="Ex: João Silva"
                    required
                    aria-required="true"
                    aria-describedby="error-newsletter-nome error-newsletter-nome-length error-newsletter-nome-invalid"
                  />
                  <div className="error-message" id="error-newsletter-nome" data-error-type="required">Nome é obrigatório.</div>
                  <div className="error-message" id="error-newsletter-nome-invalid" data-error-type="invalid">Nome deve conter apenas letras e espaços.</div>
                  <div className="error-message" id="error-newsletter-nome-length" data-error-type="length">Nome deve ter pelo menos 2 caracteres.</div>
                </div>
                <div className="form-group">
                  <label htmlFor="newsletter-email">Endereço de Email</label>
                  <input
                    type="email"
                    id="newsletter-email"
                    name="email"
                    placeholder="Ex: nome@exemplo.com"
                    required
                    aria-required="true"
                    aria-describedby="error-newsletter-email error-newsletter-email-format"
                  />
                  <div className="error-message" id="error-newsletter-email" data-error-type="required">Email é obrigatório.</div>
                  <div className="error-message" id="error-newsletter-email-format" data-error-type="format">Por favor, insira um email válido.</div>
                </div>
                <button type="submit" className="btn-submit">Subscrever</button>
                <div className="newsletter-stats">Total de <span id="newsletter-subscribers-list">0 subscritores</span></div>
              </form>
            </div>
            <div className="newsletter-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div className="benefit-content">
                  <h3>Notícias Regulares</h3>
                  <p>Receba atualizações sobre os projetos e iniciativas do CACA.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div className="benefit-content">
                  <h3>Oportunidades de Formação</h3>
                  <p>Seja o primeiro a saber sobre programas e eventos de formação.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <span className="material-symbols-outlined">science</span>
                </div>
                <div className="benefit-content">
                  <h3>Investigação & Inovação</h3>
                  <p>Fique atualizado com os resultados de investigação em saúde.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <span className="material-symbols-outlined">handshake</span>
                </div>
                <div className="benefit-content">
                  <h3>Oportunidades de Parcerias</h3>
                  <p>Descubra novas possibilidades de colaboração com o CACA.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <button id="scrollTopBtn" className="scroll-top-btn" aria-label="Voltar ao topo">
        <span className="material-symbols-outlined">arrow_upward</span>
      </button>
    </main>
  );
}

export default LandingPage;
