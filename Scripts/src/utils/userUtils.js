import { prisma } from "../lib/prisma.js"

export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      prontuario: true, 
      name: true,
      email: true,
      reciveEmails: true,
      funds: true,
      Dias: {
        select: {
          reserve: true,
          daysOfWeek: true,
          deletedDays: true,
          extraDays: true
        }
      }
    },
  })
}

export function removeDayFromUser(user, day) {
  const userDays = user.Dias

  if (!userDays.extraDays?.includes(day) || !userDays.deletedDays?.includes(day)) {
    return
  }

  const deletedDays = userDays.deletedDays?.filter((deletedDay) => deletedDay != day)
  const extraDays = userDays.extraDays?.filter((extraDay) => extraDay != day)
  prisma.dias.update({
    where: { prontuario: user.prontuario },
    data: {
      deletedDays,
      extraDays
    }
  })
}

export function subtractFounds(user, ammount) {
  prisma.user.update({
    where: { prontuario: user.prontuario },
    data: { funds: (user.funds - ammount) },
  });
}