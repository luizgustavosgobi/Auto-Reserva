import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from 'lucide-react';
import { useContext, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { OpenAlert, UserContext } from "../App.tsx";
import { Form } from "../components/Form/index.tsx";
import styles from "../components/styles/Form.module.css";
import { getToken } from "../token.ts";
import { emailSchema, EmailSchemaData } from "../utils/schemas.ts";

function Email() {
    const { email } = useContext(UserContext);
    const { setOpen } = useContext(OpenAlert);
    const [message, setMessage] = useState<[string, boolean]>(['', false]);
    const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
        
    useEffect(() => {
        document.title = 'Auto Reserva | Alterar Email';
        setUserEmail(email || undefined);
    }, [email]); 

    async function putEmail(data: EmailSchemaData) {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/updateEmail`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            res.json().then(res => {
                setMessage([res.message, false]);
            })
        }
        else {
            setMessage(['Email Atualizado com Sucesso!', true]);
            setUserEmail(data.email);
            methods.reset();
        }

        setOpen(true);
    }

    const methods = useForm<EmailSchemaData>({
        resolver: zodResolver(emailSchema)
    });

    return (
        <div>
            {userEmail
              ? <p className={styles.boxInfo}>Email atual: <span>{userEmail}</span></p>
              : <p className={styles.noEmail}> <span>Nenhum email cadastrado ❌</span></p>
            }

            <Form.Root<EmailSchemaData>
                title="Alterar Email"
                formMethods={methods}
                onSubmit={putEmail}
                error={message}
            >
                <Form.Input
                    nameAndLabel={['email', 'Email']}
                    icon={Mail}
                />

                <Form.Input
                    nameAndLabel={['confirmEmail', 'Confirmar Email']}
                    icon={Mail}
                />

                <Form.SwitchInput nameAndLabel={['reciveEmails', 'Receber notificações?']} defaultChecked />

                <Form.Button />
                <Form.Link to='/' />
            </Form.Root>
        </div>
    )
}

export default Email;
