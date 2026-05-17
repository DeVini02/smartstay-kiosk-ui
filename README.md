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

## Estrutura

Este ecossistema é composto por repositórios separados:

| Repositório | O que é |
|-------------|---------|
| `smartstay-totem` | Front-end do totem (este repositório) |
| `smartstay-app` | Front-end do app mobile do hóspede |
| `smartstay-backend` | API e banco de dados (a ser criado) |

---

## Tecnologias

- **Front-end:** React + Vite + Tailwind CSS
- **Back-end:** Python + FastAPI (a desenvolver)
- **Banco de dados:** PostgreSQL (a desenvolver)
- **Reconhecimento facial:** face-api.js — roda localmente, sem enviar imagens para servidores
- **Hospedagem:** Render (gratuito para o MVP)

---

## Status atual

### Pronto
- Telas do totem: check-in, check-out, telas de erro e consentimento LGPD
- Design system definido (cores, fontes, componentes)
- Fluxo de personalização IoT
- Painel de acessibilidade

### Em desenvolvimento
- App mobile do hóspede
- Back-end e banco de dados
- Reconhecimento facial real (hoje só exibe a câmera)
