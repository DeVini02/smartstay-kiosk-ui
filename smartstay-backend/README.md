# SmartStay Backend

API REST do ecossistema **SmartStay AI** — Challenge FIAP 2025-26 (parceira **Flexmedia**).

Repositório do **back-end** do projeto. O front do totem está em [smartstay-kiosk-ui](https://github.com/DeVini02/smartstay-kiosk-ui).

---

## O que esta API faz hoje

Esta é a camada de servidor que o totem e o app mobile vão consumir. **Já está implementado e testável:**

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| Busca de reserva | ✅ | Por código (`2847`) ou CPF — simula consulta ao PMS |
| Fluxo de check-in | ✅ | Sessão → consentimento LGPD → verificação facial → chave digital |
| Chave digital | ✅ | Token + payload QR (`smartstay://room/...`) + validação |
| Personalização IoT | ✅ | Aplica temperatura, luz e cortinas conforme perfil (simulado + log) |
| Perfil do hóspede | ✅ | Preferências, estadias, hóspede recorrente |
| LGPD | ✅ | Log de consentimentos, exportação e exclusão de dados pessoais |
| Check-out | ✅ | Identificação → resumo → confirma → avaliação → revoga chaves |
| Documentação | ✅ | Swagger em `/docs` e ReDoc em `/redoc` |
| Dados de demo | ✅ | Seed automático alinhado ao mock do front-end do totem |

**Ainda não feito (próximos passos do time):**

- Front do totem conectado a esta API (hoje usa mocks no navegador)
- Reconhecimento facial real (`face-api.js` no totem → API recebe só hash)
- App mobile (`smartstay-app`)
- PMS e IoT reais (hoje simulados no código)

---

## Stack

- Python 3.11+ / 3.12
- FastAPI + Uvicorn
- SQLAlchemy 2 + Pydantic v2
- Banco: **SQLite** (dev sem Docker) ou **PostgreSQL** (Docker/produção)

---

## Rodar na sua máquina (sem Docker)

Ideal se você não tem Docker instalado.

**Requisito:** Python **3.11 ou 3.12** (evite 3.14 por enquanto — algumas libs ainda não têm wheel).

```powershell
cd smartstay-backend
.\run-local.ps1
```

Ou manualmente:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
$env:DATABASE_URL = "sqlite:///./smartstay.db"
uvicorn app.main:app --reload --port 8000
```

Abra no navegador:

- **API:** http://localhost:8000  
- **Swagger (testar tudo):** http://localhost:8000/docs  
- **Health:** http://localhost:8000/health  

### Teste rápido no Swagger

1. `GET /api/v1/reservations/lookup` → parâmetro `code` = `2847`  
2. Copie o `id` da reserva  
3. `POST /api/v1/check-in/start` → body: `{"reservation_id": "res_demo_412"}`  
4. Siga consent → face → complete na documentação

---

## Rodar com Docker (PostgreSQL)

Para quem tiver Docker Desktop:

```bash
docker compose up --build
```

Usa `requirements-postgres.txt` e PostgreSQL 16.

---

## Dados de demonstração

| Uso | Valor |
|-----|--------|
| Código no totem | `2847` (exibe `RES-2026-2847`) |
| CPF hóspede recorrente | `12345678901` |
| Quarto | `412` |
| ID hóspede | `g_v_silva_001` |
| Face embedding (MVP) | `fe_a8b2c4` |
| Primeira viagem | código `1001`, CPF `98765432100` |

---

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Status da API e do banco |
| GET | `/api/v1/reservations/lookup?code=2847` | Busca reserva |
| POST | `/api/v1/check-in/start` | Inicia check-in |
| POST | `/api/v1/check-in/{id}/consent` | Consentimentos LGPD |
| POST | `/api/v1/check-in/{id}/face` | Verifica rosto (hash, sem foto) |
| POST | `/api/v1/check-in/{id}/complete` | Chave digital + IoT |
| POST | `/api/v1/checkout/identify` | Inicia check-out |
| POST | `/api/v1/checkout/{id}/confirm` | Finaliza estadia |
| POST | `/api/v1/checkout/{id}/rate` | Avaliação |
| GET | `/api/v1/guests/{id}/profile` | Perfil e preferências |
| GET | `/api/v1/guests/{id}/export` | Exportação LGPD |
| DELETE | `/api/v1/guests/{id}/data` | Exclusão LGPD |
| GET | `/api/v1/keys/{token}/validate` | Valida chave digital |

Lista completa em `/docs`.

---

## Integração com o totem

No `smartstay-kiosk-ui`, adicionar:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Substituir chamadas a `mockData` / `localStorage` por `fetch` nos fluxos de reserva e check-in (trabalho conjunto front + back).

---

## Testes automatizados

```powershell
pip install -r requirements.txt
$env:DATABASE_URL = "sqlite:///./test_smartstay.db"
pytest tests/ -v
```

---

## Estrutura do projeto

```
app/
  main.py              # FastAPI, CORS, seed
  models/              # Hóspedes, reservas, sessões, chaves, IoT
  schemas/             # Contratos JSON (compatíveis com o totem)
  routers/             # REST por domínio
  services/            # PMS simulado, IoT, mapeadores
  seed.py              # Dados demo
tests/
  test_api.py          # Fluxo check-in + LGPD
```

**LGPD:** fotos faciais **não** são salvas — apenas `vector_hash` / `face_embedding_id`.

**PMS / IoT:** simulados; camadas prontas para integração real (Flexmedia, MQTT, etc.).

---

## Time SmartStay · FIAP 3ESOR Challenge 2025-26
