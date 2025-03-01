"use client"

import { Form } from "@/components/Form";
import { userSchema, UserSchemaData } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, User } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export default function Register() {
    const router = useRouter();

    async function AddUser(data: UserSchemaData) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/firstAccess`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        res.ok
            ? router.push("/sign-in")
            : res.json().then(res => { toast.error(res.message) })
    }

    const methods = useForm<UserSchemaData>({
        resolver: zodResolver(userSchema)
    });

    return (
        <Form.Root<UserSchemaData>
            title="Cadastro"
            formMethods={methods}
            onSubmit={AddUser}
        >
            <title>Auto Reserva | Cadastro</title>

            <Form.Input
                nameAndLabel={['prontuario', 'Prontuário']}
                icon={User}
            />
            
            <Form.Input
                nameAndLabel={['accessCode', 'Chave de Acesso']}
                icon={KeyRound}
            />
            
            <Form.PasswordInput nameAndLabel={['password', 'Senha']} />
            <Form.PasswordInput nameAndLabel={['confirmPassword', 'Confirmar Senha']} />
            
            <Form.Button />
            <Form.Link to='/sign-in' />
        </Form.Root>
    );
    
}