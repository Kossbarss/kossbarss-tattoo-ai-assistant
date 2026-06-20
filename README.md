# Tattoo AI Assistant

AI-powered tattoo consultant and idea generator.

- **Consultant chat** — answers questions about styles, placement, sizing, aftercare, and brainstorms concepts (Anthropic Claude API). Conversations are listed in a sidebar and can be created/deleted.
- **Idea generator** — turns a text description into a tattoo-style image preview (OpenAI Images API, swappable for any image-generation provider). Generated images are saved into the active conversation and can be downloaded.

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

Conversation history (including generated images) is stored per-conversation in a local SQLite file (`server/data.sqlite` by default, override with `DATABASE_PATH`). The browser keeps a `conversationId` in `localStorage`; the sidebar lists all conversations via `GET /api/chat` and supports switching/deleting via `DELETE /api/chat/:id`.

## Rate limiting

`/api/chat` is limited to 30 requests per 15 minutes per IP, `/api/generate` to 10 requests per 15 minutes per IP (see `server/src/index.js`). Adjust the `max`/`windowMs` values there if needed.

## Deployment

### Docker

```bash
docker build -t tattoo-ai-assistant .
docker run -p 3000:3000 --env-file server/.env tattoo-ai-assistant
```

### Bare-metal Ubuntu 24.04 VPS

Run `deploy/setup.sh <git-clone-url> <domain> <email>` as root on a fresh VPS. It installs Node.js, Nginx, Certbot, creates a `deploy` user, clones/builds the app, installs the `deploy/myapp.service` systemd unit, configures `deploy/nginx.conf` as a reverse proxy, and issues a Let's Encrypt certificate. Fill in `server/.env` with `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` before the service will work correctly.

### Automatic deploy on push to `main` (GitHub Actions)

`.github/workflows/deploy.yml` SSHes into the VPS and runs `git reset --hard origin/main && npm run install:all && npm run build && sudo systemctl restart myapp` on every push to `main`.

One-time setup on the VPS (run as root):

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

Then in the GitHub repo: **Settings → Secrets and variables → Actions**, add:

- `VPS_HOST` — `173.242.58.153`
- `VPS_USER` — `deploy`
- `VPS_SSH_KEY` — contents of `/home/deploy/.ssh/github_deploy` (the private key from step 3)

Paste the private key directly into the GitHub secret field — never into chat or any other shared channel. After saving the secret, clear it from your terminal history (e.g. `history -c`) since it was printed to stdout.
