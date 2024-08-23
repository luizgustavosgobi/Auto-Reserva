type User = {
    name: string,
    prontuario: string,
    accessCode: string,
    photo: string,
    password?: string,
    email?: string,
    isAdm: boolean,
    reciveEmails: boolean,
    Dias: Dias
}

type Dias = {
    prontuario: string,
    extraDays: string[],
    deletedDays: string[],
    daysOfWeek: string[],
    reserve: boolean
}

export default User;