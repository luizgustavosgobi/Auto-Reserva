import "./utils/variables.js"

import { isDayToReserve } from "./utils/dayUtils.js";
import { getUsers, subtractFounds, removeDayFromUser } from "./utils/userUtils.js"
import { reserveHandler } from "./utils/reserve.js"
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

  const days = user.days;

  if (isDayToReserve(days)) {
    console.log(user.name + " - Reservando");

    const message = await reserveHandler(user);
    console.log(message + "\n")
    allReserves += user.name + " - " + message + "<br><br>";

    if (user.email && user.reciveEmails) {
      user.name = user.name.split(" ")[0] + " " + user.name.split(" ")[1];
      sendEmail(user, message);
    }
    subtractFounds(user, captchaValue)
  }
  removeDayFromUser(user, dayToReserveStr);

  await new Promise(resolve => setTimeout(resolve, 1000));
}

sendEmail({ email: process.env.NODEMAILER_USER, name: "Admin" }, allReserves, { menu: true });

console.log("\nReservas finalizadas!");
console.log("---------------------------\n");