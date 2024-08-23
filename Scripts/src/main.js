import "./utils/variables.js"

import { isDayToReserve } from "./utils/dayUtils.js";
import { getUsers, subtractFounds, removeDayFromUser } from "./utils/userUtils.js"
import { reserve } from "./utils/reserve.js"
import { sendEmail } from "./utils/email.js"
import { captchaValue, dayToReserveStr } from "./utils/variables.js";

console.log("---------------------------");
console.log("Script loaded sucessfully");
console.log(new Date() + "\n");

let allReserves = "";

for (const user of await getUsers()) {
  if (user.funds < captchaValue) {
    console.log(user.name + "- No founds, skipping reserve")
    continue
  }

  const days = user.Dias;

  if (isDayToReserve(days)) {
    console.log(user.name + " - Reservando");

    const message = await reserve(user, false);
    allReserves += user.name + " - " + message + "<br><br>";

    if (user.email && user.reciveEmails) {
      user.name = user.name.split(" ")[0] + " " + user.name.split(" ")[1];
      sendEmail(user, message);
    }
    subtractFounds(user, captchaValue)
  }
  removeDayFromUser(user, dayToReserveStr);
}

sendEmail({ email: process.env.NODEMAILER_USER, name: "Admin" }, allReserves, { menu: true });
