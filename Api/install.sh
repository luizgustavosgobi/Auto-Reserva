#!/bin/bash

if [ "$EUID" -ne 0 ]; then
  echo "Por favor, execute o script como root ou usando sudo."
  exit 1
fi

if ! command -v docker &> /dev/null; then
  echo "Docker não está instalado. Iniciando a instalação..."

  apt-get update
  apt-get install ca-certificates curl gnupg
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  echo \
    "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update

  apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  groupadd docker
  usermod -aG docker $USER

  systemctl enable --now docker docker.socket conteinerd

  clear

  echo "Docker instalado com sucesso!"
fi

read -p "Deseja configurar as variaveis de ambiente? [Y/n]: " option
if [[ $option == [yYsS] || -z $option ]]; then
  clear

  read -p "Informe o nome de usuário do banco de dados: " dbname
  read -p "Informe a senha para $dbname (8+ digitos): " dbpasswd
  read -p "Informe uma senha para o JWT: " jwt
  read -p "Informe o seu dominio: " domain

  if [ ! -d "/etc/autoreserva/env" ]; then
    mkdir -p /etc/autoreserva/env
  fi

  configFolder="/etc/autoreserva/env"

  echo "POSTGRES_USER='$dbname'" > "$configFolder/database.env"
  echo "POSTGRES_PASSWORD='$dbpasswd'" >> "$configFolder/database.env"
  echo "JWT_SECRET='$jwt'" > "$configFolder/api.env"
  echo "DATABASE_URL='postgresql://$dbname:$dbpasswd@postgres-reserva:5432/reserva?schema=users'" >> "$configFolder/api.env"
  echo "SERVER_NAME='$domain'" >> "$configFolder/nginx.env"

  clear
  echo "Configurações salvas em $configFolder/"
fi

read -p "Deseja configurar os certificados SSL? [Y/n]: " option
if [[ $option == [yYsS] || -z $option ]]; then
  if [ ! -d "/etc/autoreserva/keys" ]; then
    mkdir -p /etc/autoreserva/keys
  fi

  file="/etc/autoreserva/keys/domain"

  echo "Informe o certificado ssl do seu dominio (ctr+d quando terminar):"
  while IFS= read -r line; do
    echo "$line" >>"$file.pem"
  done

  echo "Informe a chave ssl do seu dominio (ctr+d quando terminar):"
  while IFS= read -r line; do
    echo "$line" >>"$file.key"
  done

  clear

  echo "Certificados salvos em /etc/autoreserva/keys/"
fi

if ! systemctl is-active --quiet docker; then
  echo "O serviço Docker não está em execução. Iniciando o processo de inicialização..."
  systemclt start docker
fi

currentDir="${pwd}"
DIR="$(dirname "$0")"

cd "$DIR"

docker compose down && docker compose build && docker compose up -d

cd "$currentDir"