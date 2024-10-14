import { z } from 'zod';

//  /sign-in
export const loginSchema = z.object({
    prontuario: z.string()
        .min(1, 'O prontuário é obrigatório')
        .transform(val => val.toUpperCase().replace(/[CT|AL]/g, '')),
    password: z.string()
        .min(1, 'A senha é obrigatória')
})

export type LoginSchemaData = z.infer<typeof loginSchema>


// /sign-up
export const userSchema = z.object({
    prontuario: z.string()
        .refine(val => val.length === 7 || val.length === 9, {
            message: "Número de caracteres inválido"
        })
        .transform(val => val.toUpperCase().replace(/[CT|AL]/g, '')),
    accessCode: z.string()
        .toLowerCase()
        .length(25, "Número de caracteres inválido"),
    password: z.string()
        .min(8, "A senha precisa conter no mínimo 8 caracteres")
        .refine(password => /[a-z]/.test(password), "Este campo precisa conter no mínimo uma letra minúscula")
        .refine(password => /[A-Z]/.test(password), "Este campo precisa conter no mínimo uma letra maiúscula")
        .refine(password => /\d/.test(password), "Este campo precisa conter no mínimo um número"),
    confirmPassword: z.string()
})
    .refine(data => data.password === data.confirmPassword, {
        message: "As senhas devem ser iguais",
        path: ['confirmPassword']
    });

export type UserSchemaData = z.infer<typeof userSchema>


//  /change-email
export const emailSchema = z.object({
    email: z.string()
        .min(1, 'O Email é obrigatório')
        .email('Formato de Email inválido'),
    confirmEmail: z.string(),
    reciveEmails: z.boolean()
})
    .refine(data => data.email === data.confirmEmail, {
        message: 'Os emails devem ser iguais',
        path: ['confirmEmail']
    })

export type EmailSchemaData = z.infer<typeof emailSchema>


//  /adm/(create-user/edit-user)
export const userFormSchema = z.object({
    name: z.string().min(1)
        .transform(name => {
            return name.trim().split(" ").map(word => {
                return word[0].toLocaleUpperCase().concat(word.substring(1))
            }).join(" ")
        }),
    prontuario: z.string().length(7),
    photo: z.string().url().refine(value => value.includes('http'), {
        message: "Invalid url",
    }).or(z.string().length(0)),
    role: z.boolean().transform((val) => (val ? 'ADMIN' : 'USER')),
})

export type UserFormSchemaData = z.infer<typeof userFormSchema>