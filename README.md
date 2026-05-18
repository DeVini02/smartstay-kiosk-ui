# SmartStay AI

Totem de autoatendimento + app mobile para hotelaria, com check-in por reconhecimento facial, controle de quarto via IoT e foco em personalização.

Projeto desenvolvido para o Challenge FIAP 2025-26, em parceria com a Flexmedia.

---

## Sobre o projeto

O SmartStay AI é um ecossistema de dois produtos que se complementam:

- **Totem** — fica na recepção do hotel. O hóspede faz check-in e check-out por reconhecimento facial em menos de 2 minutos, recebe a chave digital e tem suas preferências aplicadas ao quarto.
- **App mobile** — acompanha o hóspede durante toda a estadia. Guarda a chave digital, controla o quarto (ar-condicionado, iluminação, cortinas) e gerencia preferências.

O diferencial é a **personalização para hóspedes recorrentes**: o sistema reconhece o hóspede e prepara o quarto do jeito que ele gosta antes da chegada, sempre com consentimento explícito conforme a LGPD.

---

## Estrutura deste repositório

| Pasta / área | O que é |
|--------------|---------|
| `src/` | Front-end do totem (React + Vite) |
| [`smartstay-backend/`](./smartstay-backend/) | **API REST** (Python + FastAPI) — reservas, check-in/out, chaves digitais, LGPD, IoT |

Repositório futuro: `smartstay-app` (app mobile do hóspede).

### Documentação para o time

| Documento | Para quê |
|-----------|----------|
| [**Como rodar**](./docs/COMO_RODAR.md) | Passo a passo: API + totem + teste com código `2847` |
| [**Entrega backend**](./docs/ENTREGA_BACKEND.md) | O que foi feito, o que falta e divisão de tarefas |

---

## Tecnologias

- **Front-end:** React + Vite + Tailwind CSS
- **Back-end:** Python + FastAPI + SQLAlchemy ([ver `smartstay-backend/README.md`](./smartstay-backend/README.md))
- **Banco de dados:** SQLite (dev) ou PostgreSQL (Docker)
- **Reconhecimento facial:** face-api.js — roda localmente, sem enviar imagens para servidor

---

## Como rodar o totem (front-end)

**1.** Suba a API (outro terminal):

```powershell
cd smartstay-backend
.\run-local.ps1
```

**2.** Suba o totem:

```bash
npm install
npm run dev
```

Abre em http://localhost:8080 — o totem já chama a API em `http://127.0.0.1:8000` (ver `.env.development`).

**Teste:** código `2847` ou CPF `12345678901` → check-in completo → depois check-out no menu.

---

## Como rodar a API (back-end)

Sem Docker (SQLite):

```powershell
cd smartstay-backend
.\run-local.ps1
```

Documentação da API: http://localhost:8000/docs

Detalhes, endpoints e dados de teste: **[smartstay-backend/README.md](./smartstay-backend/README.md)**

---

## Status atual

### Pronto
- Telas do totem: check-in, check-out, telas de erro e consentimento LGPD
- Design system definido (cores, fontes, componentes)
- Fluxo de personalização IoT (front)
- Painel de acessibilidade
- **API back-end:** reservas, check-in/out, chave digital, LGPD, IoT simulado, PMS simulado, Swagger

### Em desenvolvimento
- Reconhecimento facial real (face-api.js)
- App mobile do hóspede
- Reconhecimento facial real (hoje só exibe a câmera)
