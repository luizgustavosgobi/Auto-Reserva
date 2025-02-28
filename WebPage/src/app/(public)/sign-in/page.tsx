"use client"

import { Form } from "@/components/Form/index";
import { loginSchema, LoginSchemaData } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from 'lucide-react';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignIn() {
    const router = useRouter();

    async function login(data: LoginSchemaData) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/login`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const { token, message } = await res.json();

        if (!res.ok) {
            toast.error(message);
        }
        else if (token) {
            document.cookie = `token=${token}; path=/;`;
            router.push("/");
        }
    }

    const methods = useForm<LoginSchemaData>({
        resolver: zodResolver(loginSchema),
    });

    return (
        <Form.Root<LoginSchemaData>
            title='Login'
            formMethods={methods}
            onSubmit={login}
        >
            <title>Auto Reserva | Entrar</title>

            <Form.Input
                nameAndLabel={['prontuario', 'Prontuário']}
                icon={User}
            />

            <Form.PasswordInput nameAndLabel={['password', 'Senha']} />

            <Form.Button />
            <Form.Link to="/register" />
        </Form.Root>
    )
}