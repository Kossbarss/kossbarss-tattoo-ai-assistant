# Tattoo AI Assistant

AI-powered tattoo consultant and idea generator.

- **Consultant chat** — answers questions about styles, placement, sizing, aftercare, and brainstorms concepts (Anthropic Claude API).
- **Idea generator** — turns a text description into a tattoo-style image preview (OpenAI Images API, swappable for any image-generation provider).

## Stack

- Backend: Node.js + Express (`/server`)
- Frontend: React + Vite (`/client`)

## Local development

```bash
npm run install:all
cp server/.env.example server/.env   # fill in ANTHROPIC_API_KEY and OPENAI_API_KEY
npm run dev:server   # http://localhost:3000
npm run dev:client    # http://localhost:5173 (proxies /api to :3000)
```

## Production build

```bash
npm run install:all
npm run build          # builds client into client/dist
NODE_ENV=production npm start   # server serves API + built client on PORT (default 3000)
```

## Deployment

See the deployment notes below for running this on a fresh Ubuntu 24.04 VPS behind Nginx with systemd and Let's Encrypt. Replace `<URL_РЕПОЗИТОРІЮ_...>` with this repo's clone URL; `PORT` defaults to `3000` and the start command is `npm run start`, matching `package.json`.
