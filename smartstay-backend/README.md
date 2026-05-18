# SmartStay Backend

API do SmartStay (Challenge FIAP / Flexmedia). O totem consome isso da pasta `src/` do repo principal.

---

## O que tem aqui

- Buscar reserva (código ou CPF)
- Check-in: sessão, LGPD, face (simulado), chave digital + QR
- Check-out: resumo, confirma, nota, revoga chave
- Perfil do hóspede e preferências
- LGPD (log, exportar, apagar dados)
- IoT e PMS simulados (dá pra trocar depois por integração real)

Stack: Python, FastAPI, SQLAlchemy. Banco: SQLite local ou Postgres com Docker.

Documentação automática: http://127.0.0.1:8000/docs (com a API rodando)

---

## Rodar sem Docker

```powershell
.\run-local.ps1
```

Ou, na mão:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
$env:DATABASE_URL = "sqlite:///./smartstay.db"
uvicorn app.main:app --reload --port 8000
```

Precisa Python **3.11 ou 3.12**.

---

## Com Docker

```bash
docker compose up --build
```

---

## Dados de teste

| | |
|---|---|
| Código no totem | `2847` |
| CPF | `12345678901` |
| Quarto | 412 |

Primeira viagem: código `1001`, CPF `98765432100`.

---

## Endpoints que mais usamos

- `GET /api/v1/reservations/lookup?code=2847`
- `POST /api/v1/check-in/start`
- `POST /api/v1/check-in/{id}/consent`
- `POST /api/v1/check-in/{id}/face`
- `POST /api/v1/check-in/{id}/complete`
- `POST /api/v1/checkout/identify`
- `GET /health`

Lista completa no `/docs`.

---

## Testes

```powershell
pip install -r requirements.txt
$env:DATABASE_URL = "sqlite:///./test_smartstay.db"
pytest tests/ -v
```

---

## Integração com o totem

O front já chama essa API (ver `.env.development` na raiz do repo).

Pra rodar os dois juntos: `docs/COMO_RODAR.md` no repo principal.

---

LGPD: não guardamos foto no servidor, só referência do embedding quando tiver face-api.
