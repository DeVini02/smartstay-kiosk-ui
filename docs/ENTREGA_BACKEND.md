# Backend — o que foi feito e o que falta

**Enzo** (back)  
Repo: https://github.com/DeVini02/smartstay-kiosk-ui  
Pasta: `smartstay-backend/`

Fala, time. Resumo do que ficou pronto da minha parte e o que ainda depende de vocês.

---

## O que eu fiz

Montei a API do SmartStay em Python (FastAPI) e liguei no totem que o Vini já tinha pronto.

Antes o totem só fingia os dados no navegador (`mockData`, `localStorage`). Agora o fluxo de check-in e check-out passa pela API de verdade.

**No back tem:**

- Buscar reserva por código (4 dígitos) ou CPF
- Check-in inteiro: sessão, LGPD, “face” (ainda simulado), chave digital com QR
- Perfil do hóspede, preferências, hóspede que já voltou no hotel
- LGPD: log de consentimento, exportar dados, apagar dados pessoais
- IoT e PMS **simulados** por enquanto (mas já gravam no banco / no fluxo)
- Swagger em http://127.0.0.1:8000/docs pra testar sem o totem

Foto de rosto **não** vai pro servidor — no máximo hash/id do embedding, quando a gente colocar o face-api de verdade.

**No totem, essas telas já batem na API:**

busca reserva → confirma → LGPD → câmera → processando → chave (QR vem do back) → check-out

Config do front: `.env.development` com `VITE_API_URL=http://127.0.0.1:8000/api/v1`

Tá tudo na `main` do GitHub.

---

## Pra testar / mostrar na sprint

1. Sobe API + totem (`COMO_RODAR.md`)
2. Código **2847** no check-in
3. Mostra o QR na chave digital
4. Se der tempo, check-out no mesmo fluxo (check-in antes na mesma sessão)

---

## O que ainda falta (não é refazer o back)

### Vini / front do totem

- Testar o fluxo integrado e avisar se quebrar algo
- Colocar **face-api.js** de verdade (hoje a câmera abre mas o reconhecimento é simulado)
- Ajustar telas de erro se a API cair
- UX depois de testar no totem da FIAP

### App mobile

- Repo separado — chave digital, controle do quarto
- Mesma API (`/api/v1`)

### Geral do grupo

- Vídeo pitch (3 min)
- ZIP + PDF pro portal FIAP
- Totem físico na Paulista (com o Scrum Master)

### Comigo, se precisar

- CORS, endpoint, integração quebrando
- Depois: PMS real, IoT real, deploy (se pedirem)

---

## O que **não** precisa mais no back

- Criar API do zero
- Integrar totem nos fluxos principais (já feito)
- Subir no Git (já tá)

---

## Se não rodar aí

1. `COMO_RODAR.md`
2. http://127.0.0.1:8000/health tem que dar ok
3. Me chama com print + terminal

Detalhe da API: `smartstay-backend/README.md`
