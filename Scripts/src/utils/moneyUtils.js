import axios from "axios";

export async function convertCaptchaValue(captchaValue) {
  const data = (await axios.get("https://economia.awesomeapi.com.br/json/last/USD-BRL")).data
  const dollar = data.USDBRL.bid
  
  return captchaValue * dollar
}
