# CACA — Plataforma Web React + API de Utilizadores

Este repositório consolida a evolução dos projetos PEI1, PEI2 e PEI3 numa aplicação web moderna para o Centro Académico Clínico dos Açores (CACA).

O projeto está organizado em duas partes:
- Front-end em React + Vite, preservando a identidade visual da landing page original.
- Back-end em Node.js + Express para gestão de utilizadores com autenticação e perfis.

## Grupo

- Bacar Sillá
- Henrique Cabral Teixeira Moniz Martins

## Stack Escolhida

- **React + Vite** — adequado para dividir a landing page em componentes reutilizáveis com estados, efeitos e integração com APIs. Vite oferece arranque rápido e configuração simples.
- **Node.js + Express** — solução leve e direta para construir a API de utilizadores.
- **MongoDB + Mongoose** — modelo flexível para perfis de utilizadores com validação de esquema e gestão de dados.

## Estrutura do Projeto
caca-react-migration/
├── src/
│   ├── components/     — componentes reutilizáveis (StatCard, AreaCard, EventForm...)
│   ├── context/        — AuthContext (gestão global de autenticação)
│   ├── hooks/          — useEvents, useNews, useWeather
│   ├── pages/          — LandingPage, LoginPage, RegisterPage, ProfilePage
│   ├── services/       — api.js (comunicação com o back-end)
│   └── main.jsx
├── js/modules/         — módulos JS legados reutilizados (PEI1/PEI2)
├── style.css
└── caca-api/
├── src/
│   ├── controllers/ — authController, userController
│   ├── middleware/  — authMiddleware, errorMiddleware
│   ├── models/      — User.js
│   └── routes/      — authRoutes, userRoutes
└── server.js
## Funcionalidades Migradas para React

- Hero com carrossel de imagens.
- Menu responsivo e scroll to top.
- Animações de secções, cartões e contadores (GSAP).
- Gráfico de investimento com Chart.js.
- Áreas de investigação com efeito 3D (TiltEffect).
- Secção de eventos com CRUD e persistência em IndexedDB.
- Notícias carregadas de feed RSS externo.
- Formulário de contacto com validação.
- Newsletter com validação e armazenamento local.
- Secções institucionais, oportunidades, parceiros e contactos.

## Novas Funcionalidades

- Registo e autenticação de utilizadores com JWT.
- Perfil de utilizador com edição de dados.
- Sistema de permissões — administrador e utilizador regular.
- Painel de administração para gestão de utilizadores.
- Rotas protegidas no front-end e no back-end.

## API de Gestão de Utilizadores

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| POST | `/api/auth/register` | Não | Registo de novo utilizador |
| POST | `/api/auth/login` | Não | Autenticação com JWT |
| GET | `/api/users/profile` | Token | Leitura do perfil |
| PUT | `/api/users/profile` | Token | Atualização do perfil |
| GET | `/api/users` | Admin | Lista todos os utilizadores |
| DELETE | `/api/users/:id` | Admin | Elimina um utilizador |

## Como Correr o Projeto

criar um env na pasta caca api
com
PORT=5000
MONGODB_URI=link
JWT_SECRET=------

e criar um env na root
com
VITE_API_URL=http://localhost:3001


### Front-end

```bash
npm install
npm run dev
```


### Back-end

```bash
npm install
cd caca-api
npm run seed
npm run dev
```

## Variáveis de Ambiente

### Front-end (`.env`)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| VITE_API_URL | URL da API back-end | http://localhost:3001 |

### Back-end (`caca-api/.env`)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| MONGODB_URI | URI de ligação ao MongoDB | mongodb+srv://... |
| JWT_SECRET | Chave secreta para JWT | string_longa_aleatória |
| PORT | Porta do servidor | 3001 |
| OPENWEATHER_API_KEY | Chave da API OpenWeather | 771f699f... |

## Decisões de Design e Implementação

- A identidade visual original foi preservada através do reaproveitamento do CSS existente.
- A migração foi feita de forma incremental — módulos que manipulavam o DOM diretamente foram substituídos por hooks React; módulos de efeitos visuais foram mantidos e inicializados via useEffect.
- A chave OpenWeather é mantida no back-end para não ser exposta.

## Acessibilidade, Responsividade e Segurança

- Estrutura semântica em HTML com atributos aria.
- Navegação por teclado e labels associados a todos os controlos.
- Layout responsivo para mobile, tablet e desktop.
- Validação de formulários no cliente e no servidor.
- Hashing de passwords com bcrypt (cost factor 12).
- Autenticação JWT com expiração de 7 dias.
- Sistema de permissões implementado (administrador e utilizador regular).
- Proteção de rotas no front-end (ProtectedRoute) e no back-end (requireAuth, requireRole).
- Rate limiting nas rotas de autenticação (5 pedidos por 15 minutos).
- Headers de segurança via Helmet.

## APIs Externas Utilizadas

- **OpenWeatherMap** — estado meteorológico nos eventos (proxied pelo back-end).
- **OpenStreetMap / Nominatim / Leaflet** — mapa e geolocalização nos eventos.
- **Google News RSS via rss2json** — carregamento de notícias na landing page.
- **Chart.js** — gráfico de evolução do investimento.
- **GSAP + ScrollTrigger** — animações de entrada e contadores.
