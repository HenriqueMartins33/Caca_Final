/**
 * ChartManager
 * Classe responsável por inicializar e animar o gráfico de estatísticas usando Chart.js e IntersectionObserver.
 * Configuração atualizada para um Gráfico de Linha Preenchido (Area Spline) Premium - Estilo Avançado de UX/UI.
 */
export class ChartManager {
  /**
   * Construtor da classe.
   */
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.initObserver();
  }

  /**
   * IntersectionObserver para só desenhar o gráfico quando for visível
   */
  initObserver() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderChart();
          obs.disconnect(); // Desconecta após renderizar a primeira vez
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this.canvas);
  }

  /**
   * Renderiza o Gráfico de Linha com gradiente
   */
  renderChart() {
    const ctx = this.canvas.getContext('2d');
    
    // Gradiente premium para o preenchimento da curva (glow effect) adaptado para tema claro
    let gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(246, 195, 48, 0.3)'); 
    gradient.addColorStop(1, 'rgba(246, 195, 48, 0.0)');

    // Valores padrão do Chart.js para Tema Claro
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#4f5b6e';

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        datasets: [{
          label: 'Financiamento',
          data: [12000, 18500, 24000, 38000, 50000],
          borderColor: '#f6c330', // linha principal a amarelo
          backgroundColor: gradient, // preenchimento
          borderWidth: 3,
          tension: 0.4, // Cúbica (Smooth Line / curva suave)
          fill: true,
          pointBackgroundColor: '#ffffff', // fundo interno do ponto branco
          pointBorderColor: '#f6c330', // borda do ponto a amarelo
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#f6c330',
          pointHoverBorderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // permite forçar a altura pelo CSS
        animation: {
          y: {
            duration: 2000,
            easing: 'easeOutQuart'
          },
          x: {
            duration: 1500,
            easing: 'easeOutQuart'
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false // Mais simples, visual UX clean e moderno
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fundo claro para a tooltip
            titleColor: '#1f2a3f', // Título escuro
            bodyColor: '#a6800d', // Corpo da tooltip amarelo escuro
            borderColor: 'rgba(0, 0, 0, 0.08)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            titleFont: { family: "'Inter', sans-serif", size: 13, weight: 'bold' },
            bodyFont: { family: "'Inter', sans-serif", size: 13, weight: 'bold' },
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // sombra na tooltip
            callbacks: {
              label: function(context) {
                return `€ ${context.parsed.y.toLocaleString('pt-PT')}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: '#6b7280',
              font: { size: 12, weight: '500' }
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)', // Linhas de grelha escuras muuuito transparentes
              drawBorder: false,
              borderDash: [5, 5] // Linhas tracejadas subtis
            },
            border: {
              display: false
            },
            ticks: {
              color: '#6b7280',
              font: { size: 12 },
              callback: function(value) {
                return '€' + (value / 1000) + 'k';
              }
            },
            beginAtZero: true,
            suggestedMax: 60000
          }
        }
      }
    });
  }
}
