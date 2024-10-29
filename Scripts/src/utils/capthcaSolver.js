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

  let captcha = undefined
  while (captcha == undefined) {
    const response = await axios.post(`https://api.2captcha.com/getTaskResult`, {
      clientKey: process.env.TWOCAPTCHA_APIKEY,
      taskId
    });

    if (response.data.errorId !== 0) {
      taskId = await createTask(websiteKey)
    }

    captcha = response.data.solution?.gRecaptchaResponse
  }

  return captcha;
}
