import { JSDOM } from "jsdom"

export function getWebsiteKey(html){
  return new JSDOM(html).window.document.querySelectorAll(".g-recaptcha")[0].getAttribute("data-sitekey")
}

export function getMenu(html){
  let div = new JSDOM(html).window.document.querySelectorAll(".jumbotron")[1]
  let text = div.textContent.trim().split("\n")
  text = text.map((item) => item.trim()).filter((item) => item != "")
  text[1] = "(Hoje)"
  let menu = "<br>" + text.join(", <br>")

  div = new JSDOM(html).window.document.querySelectorAll(".jumbotron")[2]
  text = div.textContent.trim().split("\n")
  text = text.map((item) => item.trim()).filter((item) => item != "")
  menu += "<br><br>Cardápio - " + text.join(", <br>")

  return menu
}

export function getCsrfToken(headers) {
  return headers["set-cookie"][0].split(";")[0] ;
}

