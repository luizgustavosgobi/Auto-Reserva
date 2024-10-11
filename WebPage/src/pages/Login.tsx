import { OpenAlert } from "@/App.tsx";
import { Form } from "@/components/Form/index.tsx";
import { loginSchema, LoginSchemaData } from "@/utils/schemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from 'lucide-react';
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Login() {
    useEffect(() => { document.title = 'Auto Reserva | Login' }, []);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { setOpen } = useContext(OpenAlert)

    async function login(data: LoginSchemaData) {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/accounts/login`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const resData = await res.json();

        if (!res.ok) {
            setError(resData.message);
            setOpen(true)
        }
        else if (resData.token) {
            document.cookie = `token=${resData.token}; path=/;`;
            navigate("/");
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
            error={error}
        >
            <Form.Input
                nameAndLabel={['prontuario', 'Prontuário']}
                icon={User}
            />

            <Form.PasswordInput nameAndLabel={['password', 'Senha']} />

            <Form.Button />
            <Form.Link to="/sign-up" />
        </Form.Root>
    )
}

export default Login;