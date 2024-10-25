#!/bin/bash

if [ "$EUID" -ne 0 ]; then
  echo "Por favor, execute o script como root ou usando sudo."
  exit 1
fi

if ! command -v node &> /dev/null; then
  read -p "Node.js não está instalado. Iniciando a instalação..."

  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash

  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

  nvm install 21
  clear
  if command -v node &> /dev/null; then
    echo "Node 21 instalado com sucesso!."
  else 
    echo "Falha ao instalar o Node 21. Instale-o manualmente!"
    exit 1
  fi
fi

read -p "Deseja configurar as variaveis de ambiente? [Y/n]: " option
if [[ $option == [yY] || -z $option ]]; then
  clear
  echo "Iniciando as configurações das variaveis de ambiente..."
  echo

  read -p "Informe o nome de usuário do banco de dados: " dbName
  read -p "Informe a senha para $dbName: " dbPasswd
  read -p "Informe o email para mandar as notificações: " nodemailerUser
  read -p "Informe a senha do email $nodemailerUser: " nodemailerPasswd
  read -p "Informe o dominio do seu provedor de email (google: smtp.gmail.com): " nodemailerHost
  read -p "Informe a porta do provedor de email (google: 587): " nodemailerPort
  read -p "Informe a URL do sica de seu campus: " pageURL
  read -p "Informe a chave de API do TwoCaptcha caso necessário: " TwoCaptcha

  if [ ! -d "/etc/autoreserva/env" ]; then
    mkdir -p /etc/autoreserva/env
  fi

  configFile="/etc/autoreserva/env/script.env"
  
  echo "NODEMAILER_HOST='$nodemailerHost'" > $configFile
  echo "NODEMAILER_PORT='$nodemailerPort'" >> $configFile
  echo "NODEMAILER_USER='$nodemailerUser'" >> $configFile
  echo "NODEMAILER_PASS='$nodemailerPasswd'" >> $configFile
  echo "DATABASE_URL='postgresql://$dbName:$dbPasswd@127.0.0.1:5432/reserva?schema=users'" >> $configFile
  echo "PAGE_URL='$pageURL'" >> $configFile
  echo "TWOCAPTCHA_APIKEY='$TwoCaptcha'" >> $configFile
  echo "NODE_PATH='$(which node)'" >> $configFile

  clear
  echo "Configurações salvas em $configFile"
fi

DIR="$(realpath "$(dirname "$0")")"
currentDir="${pwd}"

cd "$DIR"
npm i

if ! grep "bash $DIR/exec.sh" "/etc/crontab"; then
  sudo echo "0 10   * * 1-5 root    bash $DIR/exec.sh" >> /etc/crontab
fi

clear

cd "$currentDir"

echo "Instalado com sucesso!"