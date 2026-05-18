# Como rodar o projeto

Pra ver o totem funcionando com a API, precisam de **dois terminais abertos**.

Repo: https://github.com/DeVini02/smartstay-kiosk-ui

---

## O que instalar antes

- **Node** (18 ou 20) — pro totem  
- **Python 3.11 ou 3.12** — pra API (3.14 deu problema aqui, melhor não usar)  
- **Git** — pra clonar  

Docker é opcional, só se quiserem PostgreSQL. Pra testar em casa o SQLite resolve.

---

## Clonar

```bash
git clone https://github.com/DeVini02/smartstay-kiosk-ui.git
cd smartstay-kiosk-ui
```

---

## Terminal 1 — API (back)

```powershell
cd smartstay-backend
.\run-local.ps1
```

Na primeira vez demora um pouco (venv + pip).

Se o script falhar, na mão:

```powershell
cd smartstay-backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
$env:DATABASE_URL = "sqlite:///./smartstay.db"
uvicorn app.main:app --reload --port 8000
```

Testa no browser:

- http://127.0.0.1:8000/health — tem que aparecer ok  
- http://127.0.0.1:8000/docs — documentação da API  

**Não fecha esse terminal** enquanto usa o totem.

---

## Terminal 2 — Totem (front)

Na pasta raiz do repo (`smartstay-kiosk-ui`):

```bash
npm install
npm run dev
```

Abre: http://localhost:8080

O front já aponta pra API em `127.0.0.1:8000` (`.env.development`).

---

## Testar rápido

**Check-in**

1. Tela inicial → idioma → Check-in  
2. Código **2847** (ou CPF **12345678901**) → buscar  
3. Confirma → LGPD → aceita  
4. Câmera (espera ou clica em capturar)  
5. Processando → aparece a chave com QR  

**Check-out**

Só funciona direito se você fez check-in **antes na mesma sessão** (senão a API não acha estadia ativa).

Menu → Check-out → segue o fluxo.

---

## Dados de teste

- Código: **2847**  
- CPF: **12345678901**  
- Quarto: **412**, hóspede **V. da Silva** (já tem histórico no sistema)  
- Outro hóspede (1ª vez): código **1001**, CPF **98765432100**  

---

## Deu ruim?

**“Sem conexão” no totem** — API provavelmente não tá rodando. Volta no terminal 1.

**pip não instala** — troca pro Python 3.12.

**Totem abre mas parece mock** — confere o /health da API e reinicia o `npm run dev`.

**Docker** (quem tiver):

```bash
cd smartstay-backend
docker compose up --build
```

---

## Cola pro grupo

```
Terminal 1: cd smartstay-backend → .\run-local.ps1
Terminal 2: npm install → npm run dev
Totem: http://localhost:8080
API: http://127.0.0.1:8000/docs
Código teste: 2847
```

API com mais detalhe: `smartstay-backend/README.md`
