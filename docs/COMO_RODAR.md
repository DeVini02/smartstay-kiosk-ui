# Como rodar o SmartStay (guia para o time)

Repositório: **https://github.com/DeVini02/smartstay-kiosk-ui**

Vocês precisam de **dois programas rodando ao mesmo tempo**: a API (back) e o totem (front).

---

## Pré-requisitos

| Ferramenta | Versão recomendada | Para quê |
|------------|-------------------|----------|
| **Node.js** | 18 ou 20 | Totem (front) |
| **Python** | 3.11 ou 3.12 | API (back) — evitem 3.14 por enquanto |
| **Git** | qualquer recente | Clonar o repo |

**Opcional:** Docker Desktop — só se quiserem PostgreSQL em vez de SQLite.

---

## 1. Clonar o projeto

```bash
git clone https://github.com/DeVini02/smartstay-kiosk-ui.git
cd smartstay-kiosk-ui
```

---

## 2. Subir a API (backend)

Abra um terminal na pasta `smartstay-backend`.

### Windows (mais fácil — sem Docker)

```powershell
cd smartstay-backend
.\run-local.ps1
```

Na primeira vez ele cria o ambiente virtual e instala as dependências. Pode demorar 1–2 minutos.

### Manual (se o script não funcionar)

```powershell
cd smartstay-backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
$env:DATABASE_URL = "sqlite:///./smartstay.db"
uvicorn app.main:app --reload --port 8000
```

### Conferir se a API está no ar

Abra no navegador:

- **Health:** http://127.0.0.1:8000/health → deve mostrar `"status": "ok"`
- **Swagger (testar endpoints):** http://127.0.0.1:8000/docs

**Deixe este terminal aberto** enquanto usam o totem.

---

## 3. Subir o totem (front-end)

Abra **outro** terminal na raiz do repo (`smartstay-kiosk-ui`).

```bash
npm install
npm run dev
```

Abra no navegador:

- **Totem:** http://localhost:8080

O front já está configurado para chamar a API em `http://127.0.0.1:8000` (arquivo `.env.development`).

---

## 4. Roteiro de teste (demo)

Com API + totem rodando:

### Check-in

1. Toque na tela inicial → escolha idioma  
2. Menu → **Check-in**  
3. Digite o código **`2847`** (ou CPF `12345678901`) → Buscar  
4. Confirme os dados → LGPD → aceite  
5. Tela da câmera (aguarde ou “Capturar agora”)  
6. Processando → chave digital com **QR gerado pela API**  

### Check-out

1. Depois de um check-in na **mesma sessão**, volte ao menu  
2. **Check-out** → identificação facial → resumo → confirmar → avaliação  

> **Importante:** o check-out na API exige reserva com status `checked_in`. Por isso façam o check-in antes na mesma sessão.

---

## Dados de teste (seed automático)

| Campo | Valor |
|-------|--------|
| Código no totem | `2847` |
| Código completo | `RES-2026-2847` |
| CPF | `12345678901` |
| Quarto | 412 |
| Hóspede | V. da Silva (recorrente) |
| Primeira viagem | código `1001`, CPF `98765432100` |

---

## Problemas comuns

### “Sem conexão” / erro ao buscar reserva

- A API não está rodando → subam o passo 2 de novo  
- Porta 8000 ocupada → fechem outro processo ou mudem a porta  

### `pip install` falha (Python 3.14)

Instalem **Python 3.12**: https://www.python.org/downloads/  
Marquem “Add to PATH” na instalação.

### Totem abre mas dados não mudam

- Confiram se a API está em http://127.0.0.1:8000/health  
- Reiniciem `npm run dev` após clonar  

### Docker (opcional)

Quem tiver Docker Desktop:

```bash
cd smartstay-backend
docker compose up --build
```

Usa PostgreSQL em vez de SQLite. O totem continua igual (`npm run dev`).

---

## Resumo rápido (cola no grupo)

```
Terminal 1:  cd smartstay-backend  →  .\run-local.ps1
Terminal 2:  cd smartstay-kiosk-ui  →  npm install  →  npm run dev
Navegador:   http://localhost:8080  (totem)
             http://127.0.0.1:8000/docs  (API)
Teste:       código 2847
```

---

Dúvidas sobre a API → ver também `smartstay-backend/README.md`.
