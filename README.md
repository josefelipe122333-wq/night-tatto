# Night Tattoo Body Art

Landing page do estúdio Night Tattoo Body Art.

## Deploy

```bash
git init
git add .
git commit -m "feat: landing page night tattoo"
```

Criar repositório no GitHub e fazer push:

```bash
git remote add origin https://github.com/SEU-USER/night-tattoo.git
git branch -M main
git push -u origin main
```

Depois conectar no Vercel em [vercel.com](https://vercel.com) e importar o repositório.

## Variáveis de Ambiente (Opcionais)

| Variável | Descrição | Onde usar |
|---|---|---|
| `ANTHROPIC_API_KEY` | Chave da API da Anthropic (Claude) | Ativa geração de sugestões via IA no endpoint `/api/sugerir-tattoo` |

> Se `ANTHROPIC_API_KEY` não estiver configurada, o sistema usa sugestões pré-escritas locais (funciona normalmente).
