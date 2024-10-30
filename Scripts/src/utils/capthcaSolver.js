import axios from "axios";
import { websiteKey } from "./variables.js"
import 'dotenv/config';

async function createTask() {
  const response = await axios.post('https://api.2captcha.com/createTask', {
    clientKey: process.env.TWOCAPTCHA_APIKEY,
    task: {
      type:"RecaptchaV2TaskProxyless",
      websiteURL: process.env.PAGE_URL,
      websiteKey: websiteKey
    }
  })

  return response.data.taskId;
}

export async function getSolvedCaptcha() {
  let taskId = await createTask()
  console.log("Resolvendo Captcha: " + taskId);

  let attempts = 0
  let captcha = undefined
  while (captcha == undefined) {
    const response = await axios.post(`https://api.2captcha.com/getTaskResult`, {
      clientKey: process.env.TWOCAPTCHA_APIKEY,
      taskId
    });

    if (response.data.errorId !== 0) {
      if (attempts < 1) {
        console.log("Falha ao responder o captcha, tentando novamente!");
        taskId = await createTask(websiteKey)
        attempts += 1
      } else {
        console.log("Falha ao responder o captcha! Limites de tentativas exedido!");
        return ""
      }
    }
  
    captcha = response.data.solution?.gRecaptchaResponse
  }

  console.log("Captcha resolvido com sucesso!");
  return captcha;
}
