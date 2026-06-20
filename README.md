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

Chat history is stored per-conversation in a local SQLite file (`server/data.sqlite` by default, override with `DATABASE_PATH`). The browser keeps a `conversationId` in `localStorage` and the server reloads history for that ID on each page load. Generated images are saved into the active conversation's history alongside chat messages.

## Rate limiting

`/api/chat` and `/api/generate` are rate-limited (per IP, 15-minute window) to protect the underlying Anthropic/OpenAI API keys from abuse. Limits are configured in `server/src/index.js` (`chatLimiter`, `generateLimiter`).

## Deployment

### Docker

```bash
docker build -t tattoo-ai-assistant .
docker run -p 3000:3000 --env-file server/.env tattoo-ai-assistant
```

### Bare-metal Ubuntu 24.04 VPS

Run `deploy/setup.sh <git-clone-url> <domain> <email>` as root on a fresh VPS. It installs Node.js, Nginx, Certbot, creates a `deploy` user, clones/builds the app, installs the `deploy/myapp.service` systemd unit, configures `deploy/nginx.conf` as a reverse proxy, and issues a Let's Encrypt certificate. Fill in `server/.env` with `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` before the service will work correctly.

### Automatic deploy on push to `main` (GitHub Actions)

A workflow at `.github/workflows/deploy.yml` SSHes into the VPS and redeploys automatically on every push to `main`. One-time setup on the VPS (as root):

```bash
# 1. Generate a dedicated deploy key (no passphrase) for the deploy user
sudo -u deploy ssh-keygen -t ed25519 -f /home/deploy/.ssh/github_deploy -N ""
sudo -u deploy bash -c 'cat /home/deploy/.ssh/github_deploy.pub >> /home/deploy/.ssh/authorized_keys'
sudo -u deploy chmod 600 /home/deploy/.ssh/authorized_keys

# 2. Allow the deploy user to restart the service without a password prompt
echo 'deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart myapp' > /etc/sudoers.d/deploy-myapp
chmod 440 /etc/sudoers.d/deploy-myapp

# 3. Print the private key once to copy into GitHub secrets, then clear your terminal scrollback
cat /home/deploy/.ssh/github_deploy
```

Then, in the GitHub repository settings, add these secrets under **Settings → Secrets and variables → Actions**:

- `VPS_HOST` — the VPS IP or hostname
- `VPS_USER` — `deploy`
- `VPS_SSH_KEY` — the contents of the generated private key

Paste the private key directly into the GitHub secret field — never into chat or any other shared channel. After saving the secret, clear it from your terminal history (e.g. `history -c`) since it was printed to stdout.
