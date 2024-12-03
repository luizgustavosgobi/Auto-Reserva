import { JSDOM } from "jsdom";
import { getSolvedCaptcha } from './capthcaSolver.js';
import { csrftoken } from "./variables.js";

import axios from "axios";
import qs from "querystring";
import 'dotenv/config';

export async function reserveHandler(user) {
  const captchaToken = process.env.HAS_CAPTCHA === 'true' ? await getSolvedCaptcha() : "";

  let response;
  for (let i=0; i<3;i++) {
    try {
      response = await reserve(user, captchaToken)
      break
    } catch (err) {
      if (i < 2) {
        console.log("Erro na hora de reservar! Tentando novamente")
      } else {
        console.log(err)
      }
    }
  }

  if (!response || response.status !== 200) {
    return "Não foi possivel fazer na reserva!"
  }
  
  const alert = new JSDOM(response.data).window.document.querySelectorAll(".alert")[0];
  const text = alert.textContent.split("\n")[2]
  return text.split("!")[1].trim()
}

async function reserve(user, captcha) {
  return await axios.post(process.env.PAGE_URL+'/home',
    qs.stringify({
      csrfmiddlewaretoken: csrftoken.split("=")[1],
      prontuario: user.prontuario,
      "g-recaptcha-response": captcha,
    }),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': csrftoken
      },
    }
  )
}