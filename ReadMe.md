<h1 align="center">🍔 Auto Reserva 🍔</h1>

<div align="center">

   ![GitHub License](https://img.shields.io/github/license/luizgustavosgobi/Auto-Reserva?style=flat-square)

   [![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square)](https://github.com/luizgustavosgobi/Auto-Reserva/issues)
   ![GitHub Release](https://img.shields.io/github/v/release/luizgustavosgobi/Auto-Reserva?include_prereleases&style=flat-square)

</div>

O **Auto Reserva** é um sistema de **reserva de comida** feito para o **SICA** (Sistema de Controle de Alimentação) do **IF** (Instituto Federal).

- **Interface WEB** para facilitar as interações com o sistema.
- Suporte para **Captchas**, caso o Campus implemente **(será necessário pagamento ao sistema de solução de captchas)**.

## 🚀 Instalação

### Pré-requisitos

- Uma conta no **Netlify** para a hospedagem da página web.
- **Um servidor VPS** para hospedar a API e o Script.
- **Um Domínio** para a utilização so SSL no backend. (Caso não queira utilizar SSL, você devera fazer alterações no Nginx para aceitar requisições HTTP).
- Uma conta no **2Captcha** para a utilização do serviço de solução de captchas **caso necessário**.

### WebPage

Para a instalação da página web, recomendamos que utilize algum serviço de hospedagem de sites que deem suporte ao **React**, de preferencia algum gratuíto, como a **Netlify**.

<details><summary><b>Instalação com a Netlify</b></summary>

1. Faça o login no site da [Netlify](https://www.netlify.com/).

2. Já no painel de controle, clique em **Add new site**, e depois em **import an existing project**.

3. A netlify vai pedir da onde quer importar o projeto, selecione o ícone do github e faça o login/autorize a netlify a acessar seus repositórios.

4. Selecione o repositório que você deu o fork do **Auto Reserva**.

5. Coloque um nome para o site e, em **Build settings** coloque a seguinte cofiguração:

   - **Base directory**: `WebPage/`
   - **Build command**: `npm run build`
   - **Publish directory**: `WebPage/dist/`

6. Na parte de **Environment variables**, clique em **Add environment variables** e adicione:

   - **Key**: `VITE_BASE_URL`
   - **Value**: `O IP do servidor do BackEnd`

</details>

### API

Para a instalação da API, recomendamos que utilize uma VPS, utilizando o ubunto, como sistema operacional.

<details><summary><b>Como subir a API na VPS</b></summary>

1.  Clone o repositorio na sua VPS:

    ```sh
    $ git clone https://github.com/luizgustavosgobi/Auto-Reserva.git
    $ cd Auto-Reserva/API
    ```

2. Execute o script de instalação com:

    ```sh
    $ bash ./install.sh
    ```
</details>


### Scripts

No script, você pode utilizar a mesma VPS da API.

<details><summary><b>Instruções</b></summary>

1. Execute o script de instalação com:

   ```sh
   $ cd Auto-Reserva/Script
   $ bash ./install.sh
   ```

2. Se caso tenha que usar o **2Captcha**, você deve alterar na linha 23 do **src/main.js** para:

   ```js
   const message = await reserve(user, true);
   ```
   ao invés de:

   ```js
   const message = await reserve(user, false);
   ```

</details>


## Acesso ao sistema

Por padrão, o sistema já vem com um usuario administrador para ter acesso a criação de novos usuarios:

   - **Prontuario**: `0000000`
   - **AccessCode**: `clzohj9zj000b356bnh0atl53`

Para acessar esse usuário, na tela de login, clique em **Primeiro Acesso**, e crie uma senha. Depois é só efetuar o login.

Lembre-se de removelo após a criação de um novo usuário adiministrados, a fins de segurança.

<br>
<br>

<h1 align="center">😎 Contribuições 😎 </h1>

<a href="https://github.com/luizgustavosgobi/Auto-Reserva/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=luizgustavosgobi/Auto-Reserva" />
</a>