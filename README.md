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

## Persistence

Chat history is stored per-conversation in a local SQLite file (`server/data.sqlite` by default, override with `DATABASE_PATH`). The browser keeps a `conversationId` in `localStorage` and the server reloads history for that ID on each page load.

## Deployment

### Docker

```bash
docker build -t tattoo-ai-assistant .
docker run -p 3000:3000 --env-file server/.env tattoo-ai-assistant
```

### Bare-metal Ubuntu 24.04 VPS

Run `deploy/setup.sh <git-clone-url> <domain> <email>` as root on a fresh VPS. It installs Node.js, Nginx, Certbot, creates a `deploy` user, clones/builds the app, installs the `deploy/myapp.service` systemd unit, configures `deploy/nginx.conf` as a reverse proxy, and issues a Let's Encrypt certificate. Fill in `server/.env` with `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` before the service will work correctly.
