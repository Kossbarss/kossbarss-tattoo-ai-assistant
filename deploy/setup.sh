#!/usr/bin/env bash
# Deployment script for Ubuntu 24.04 — run as root via WebSSH on a fresh VPS.
# Usage: ./setup.sh <git-clone-url> <domain> <email>
set -euo pipefail

REPO_URL="${1:?git clone URL required}"
DOMAIN="${2:?domain required}"
EMAIL="${3:?email required}"

apt update && apt upgrade -y
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx build-essential

id -u deploy &>/dev/null || adduser --disabled-password --gecos "" deploy
usermod -aG sudo deploy

sudo -u deploy bash <<EOSU
cd /home/deploy
[ -d app ] || git clone "$REPO_URL" app
cd app
npm run install:all
npm run build
[ -f server/.env ] || cp server/.env.example server/.env
EOSU

echo ">>> Edit /home/deploy/app/server/.env to set ANTHROPIC_API_KEY and OPENAI_API_KEY, then re-run the rest of this script."

cp /home/deploy/app/deploy/myapp.service /etc/systemd/system/myapp.service
systemctl daemon-reload
systemctl enable --now myapp

sed "s/tattoo-ai.victoriaponikarova.online/$DOMAIN/" /home/deploy/app/deploy/nginx.conf > /etc/nginx/sites-available/myapp
ln -sf /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp
nginx -t && systemctl reload nginx

certbot --nginx -d "$DOMAIN" --redirect -m "$EMAIL" --agree-tos -n

systemctl status myapp --no-pager
curl -I "https://$DOMAIN"
