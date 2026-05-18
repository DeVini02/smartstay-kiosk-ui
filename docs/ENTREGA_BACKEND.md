# Entrega do backend + integração — o que foi feito e o que falta

**Responsável:** [seu nome]  
**Repositório:** https://github.com/DeVini02/smartstay-kiosk-ui  
**Pasta do back:** `smartstay-backend/`  
**Status:** ✅ Parte de backend + integração com totem **concluída para MVP**

---

## 1. O que eu fiz (resumo para apresentar)

Construí a **API REST do SmartStay** e **conectei ao totem** que o Vini já tinha feito. Antes o totem só usava dados falsos no navegador (`mockData` / `localStorage`). Agora o fluxo principal fala com o servidor.

### Backend (`smartstay-backend/`)

| Módulo | O que faz |
|--------|-----------|
| **Reservas** | Busca por código (4 dígitos) ou CPF — simula consulta ao PMS |
| **Check-in** | Sessão → consentimento LGPD → verificação facial → chave digital |
| **Chave digital** | Token + QR (`smartstay://room/...`) + endpoint de validação |
| **Hóspede / perfil** | Preferências, histórico, hóspede recorrente |
| **LGPD** | Log de consentimentos, exportação e exclusão de dados |
| **IoT** | Aplica temperatura, luz, cortinas (simulado + log no banco) |
| **Check-out** | Identificação → resumo → confirma → avaliação → revoga chaves |
| **PMS** | Camada simulada (`PmsService`) — pronta para API real depois |
| **Docs** | Swagger em `/docs` |

**Stack:** Python, FastAPI, SQLAlchemy, SQLite (dev) ou PostgreSQL (Docker).

**LGPD:** fotos **não** são salvas no servidor — só referência/hash do embedding facial.

### Integração com o totem (`src/lib/api/`)

Telas que **já chamam a API**:

- Busca de reserva  
- Início do check-in (ao confirmar reserva)  
- Consentimento LGPD  
- Captura facial (verificação simulada no back)  
- Processamento → conclusão do check-in + QR real  
- Check-out (identificar, confirmar, avaliar)  

Arquivo de config: `.env.development` → `VITE_API_URL=http://127.0.0.1:8000/api/v1`

### GitHub

Tudo está no repo do time, branch `main`:

- Commit 1: API + pasta `smartstay-backend/`  
- Commit 2: Integração totem ↔ API  

---

## 2. O que o time pode dizer na sprint / banca

> “Temos um **MVP integrado**: totem React na recepção + API FastAPI com check-in/out, chave digital, LGPD e personalização IoT simulada. O hóspede busca a reserva, aceita os termos, passa pela captura facial, recebe QR de chave digital e, no check-out, vê o resumo e avalia a estadia. O back está documentado no Swagger e versionado no GitHub.”

Demo sugerida (5 min): código **2847** → check-in completo → mostrar QR → check-out.

---

## 3. O que ainda falta (por área / pessoa)

Não é “refazer o back”. É evoluir o produto para nota máxima e produção.

### Front do totem (Vini / front)

| Tarefa | Prioridade | Detalhe |
|--------|------------|---------|
| Revisar fluxos integrados | Alta | Testar com `COMO_RODAR.md`; reportar bugs |
| **face-api.js** real | Alta | Reconhecimento no browser; API só recebe `vector_hash` |
| Tratamento de erros | Média | Telas de erro já existem; ligar 100% aos status da API |
| Ajustes de UX pós-teste | Média | Loading, mensagens, totem físico FIAP |

### App mobile (`smartstay-app` — a definir)

| Tarefa | Prioridade |
|--------|------------|
| Criar repo / telas | Alta |
| Chave digital + controle do quarto | Alta |
| Consumir mesma API (`/api/v1`) | Alta |

### Back (eu — manutenção / evolução)

| Tarefa | Prioridade | Detalhe |
|--------|------------|---------|
| Suporte na integração | Contínuo | Ajudar se endpoint/CORS quebrar |
| PMS real | Baixa (pós-MVP) | Substituir `PmsService` simulado |
| IoT real (MQTT / Flexmedia) | Baixa (pós-MVP) | Substituir simulador |
| Deploy em nuvem | Média | Railway, Render, etc. — demo fora do PC |

### Time geral

| Tarefa | Prioridade |
|--------|------------|
| **Vídeo pitch** (3 min) | Obrigatório sprint |
| Teste nos **totens FIAP** (Paulista) | Alta |
| PDF + ZIP para portal FIAP | Obrigatório |
| Atualizar README principal se mudar algo | Baixa |

---

## 4. O que NÃO é mais “a fazer” no backend

- ❌ Criar API do zero  
- ❌ Modelar check-in / check-out / LGPD do zero  
- ❌ Subir back no GitHub (já está)  
- ❌ Ligar totem à API nos fluxos principais (já feito)  

---

## 5. Arquivos úteis

| Arquivo | Conteúdo |
|---------|----------|
| `docs/COMO_RODAR.md` | Passo a passo para rodar API + totem |
| `smartstay-backend/README.md` | Detalhes técnicos da API e endpoints |
| `README.md` (raiz) | Visão geral do ecossistema |
| http://127.0.0.1:8000/docs | Documentação interativa (com API rodando) |

---

## 6. Contato / dúvidas

Se a API não subir ou o totem não achar reserva:

1. Conferir `COMO_RODAR.md`  
2. Testar http://127.0.0.1:8000/health  
3. Chamar [seu nome] com print da tela + terminal  

---

*Challenge FIAP 2025-26 · Flexmedia · SmartStay AI*
