import axios from "axios";
import 'dotenv/config';

async function createTask(websiteKey) {
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

export async function getSolvedCaptcha(websiteKey) {
  let taskId = await createTask(websiteKey)
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
