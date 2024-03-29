#!/bin/bash
# for running this script , ./script.sh PORTNO EMAIL DOMAIN_NAME aws_flag
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
node -v
npm -v
apt-get update -y
apt-get install git -y
git — version
git clone git@github.com:2024-Open-Soft/Backend.git
# cd Backend
# npm install
# npm start
# project has been setup

PORTNO=$1
DOMAIN_NAME=$2
# nginx setup
  nginx_conf="
  server {
    listen 80;
    client_max_body_size 10M;

    location / {
      proxy_pass http://localhost:3001;
    }
  }
  "

if ! command -v nginx >/dev/null; then
  sudo apt-get update
  sudo apt-get install -y nginx
fi

sudo -u root bash -c "echo '$nginx_conf' >/etc/nginx/sites-available/default"

if systemctl is-active -q ngin  x; then
  sudo systemctl restart nginx
else
  sudo systemctl enable --now nginx
fi
