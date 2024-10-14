type User = {
    name: string,
    prontuario: string,
    accessCode: string,
    photo: string,
    password?: string,
    email?: string,
    role: "USER" | "ADMIN",
    reciveEmails: boolean,
    days: Days
}

type Days = {
    prontuario: string,
    extraDays: string[],
    deletedDays: string[],
    daysOfWeek: string[],
    reserve: boolean
}

export default User;