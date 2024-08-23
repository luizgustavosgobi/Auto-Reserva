import { menu, today } from './variables.js';

import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  },
})

export function sendEmail(user, msg, args){
  if (args === undefined) args =  ""
  
  transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: user.email,
    subject: 'Reserva do dia ' + today,
    html:  `
    <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
        <title>Reserve notification</title>

        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          h1 {
            font-size: 30px;
            margin-bottom: 8px;
          }

          #alert {
            margin-top: 1rem; 
            margin-bottom: 0.5rem;
          }

          #msg {
            margin-top: 1rem;
          }

          @media screen and (max-width: 425px) {
            h1 {
              font-size: 25px;
              margin-bottom: 8px;
            }

            #msg {
              font-size: 14px;
              margin-top: 2rem;
            }

            #alert {
              margin-top: 2rem; 
              margin-bottom: 1rem;
            }

            #underName {
              font-size: smaller;
            }
          }
        </style>
      </head>
      <body>
        <table style="color: #eaeaea; font-family: 'Poppins', sans-serif;">
          <tr>
            <td>
              <table style="gap: 30px; width: fit-content; background-color: #1f1f23; padding: 30px 30px 6px; border-radius: 10px; box-shadow: 0px 0px 10px 0px #18181b;">
                <tr>
                  <td style="text-align: center;">
                    <h1 style="font-weight: 500; line-height: 10px;">Olá <span style="color: #ab8eee;">${user.name}</span>!</h1>
                    <p id="underName">Aqui está o resultado da sua reserva do dia!</p>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 18px; font-weight: 500; margin-top: 1rem; color: #c6b2f3;">
                    <p id="msg">${msg}</p>
                  </td>
                </tr>
                ${args.menu ? `` : `<tr>
                  <td style="font-size: 17px; font-weight: 500; margin-top: 1rem; color: #c6b2f3;">
                    <p style="color: #c6b2f3;">${menu || "Cardápio do dia Não Cadastrado"}</p>
                  </td>
                </tr>`}
                <tr>
                  <td style="font-size: smaller; text-align: start; width: 100%;">
                    <p id="alert">Aproveite a sua refeição, e lembre de não reservar para dias em que não irá comer!</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; font-size: smaller;">
                    <p>© 2024 Auto-Reserva</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
  </html>
  `
  });
}
