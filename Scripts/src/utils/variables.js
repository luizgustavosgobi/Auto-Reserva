import axios from "axios"
import { dayToString, getDayToReserve } from "./dayUtils.js"
import { getCsrfToken, getMenu, getWebsiteKey } from "./htmlUtils.js"
import { convertCaptchaValue } from "./moneyUtils.js"

import 'dotenv/config';

//
//      Website related variables
//
const response = await axios.get(process.env.PAGE_URL)

export const menu = getMenu(response.data)
export const websiteKey = getWebsiteKey(response.data)
export const csrftoken = getCsrfToken(response.headers)

//
//      Day related variables
//

export const dayToReserve = getDayToReserve()
export const dayToReserveStr = dayToString(dayToReserve)
export const today = new Date().toLocaleDateString("pt-BR")

export const daysOfWeek = ["Domingo", "Seg", "Ter", "Quar", "Quin", "Sex", "Sábado"];

//
// Captcha Related Variables
//

export const captchaValue = convertCaptchaValue(0.00299)