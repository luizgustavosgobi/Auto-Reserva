import { OpenAlert } from "@/App";
import { Form } from "@/components/Form";
import { userSchema, UserSchemaData } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, User } from 'lucide-react';
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

function FirstAccess() {
    useEffect(() => { document.title = 'Auto Reserva | Cadastro' }, []);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { setOpen } = useContext(OpenAlert);

    async function AddUser(data: UserSchemaData) {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/accounts/firstAccess`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        res.ok
            ? navigate("/sign-in")
            : res.json().then(res => { setError(res.message); setOpen(true) })
    }

    const methods = useForm<UserSchemaData>({
        resolver: zodResolver(userSchema)
    });

    return (
        <Form.Root<UserSchemaData>
            title="Cadastro"
            formMethods={methods}
            onSubmit={AddUser}
            error={error}
        >
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

export default FirstAccess;
