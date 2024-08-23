import { JSDOM } from "jsdom";
import { getSolvedCaptcha } from './capthcaSolver.js';
import { csrftoken, websiteKey } from "./variables.js";

import axios from "axios";
import qs from "querystring";
import 'dotenv/config';

export async function reserve(user, captcha) {
  const response = await axios.post(process.env.PAGE_URL+'/home',
    qs.stringify({
      csrfmiddlewaretoken: csrftoken.split("=")[1],
      prontuario: user.prontuario,
      "g-recaptcha-response": captcha ? await getSolvedCaptcha(websiteKey) : "",
    }),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': csrftoken
      },
    }
  )

  const alert = new JSDOM(response.data).window.document.querySelectorAll(".alert")[0];
  const text = alert.textContent.split("\n")[2]
  return text.split("!")[1].trim()
}

