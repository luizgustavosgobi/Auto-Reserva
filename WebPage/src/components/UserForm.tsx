import { userFormSchema, UserFormSchemaData } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@styles/Form.module.css";
import { Camera, Contact, User } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { Form } from "./Form";

type UserFormProps = {
    hasUserData: boolean;
    alertMessage: [string, boolean];
    onSubmit: (data: UserFormSchemaData) => void
}

type Role = 'USER' | 'ADMIN';

const UserForm = forwardRef(({ hasUserData, alertMessage, onSubmit }: UserFormProps, ref) => {
    let name = '', prontuario = '', photo = '', role:Role = 'USER';

    if (hasUserData) {
        const { state } = useLocation();
        const user = state?.user || {};
        ({ name = '', prontuario = '', photo = '', role = 'USER' } = user);
    }

    useEffect(() => { document.title = hasUserData ? 'Adm | Editar Usuário' : 'Adm | Adicionar Usuário' }, []);

    const methods = useForm<UserFormSchemaData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name,
            prontuario,
            photo,
            role
        }
    });

    const { watch } = methods
    const prontuarioInput = watch('prontuario');
    const nameInput = watch('name');
    const photoInput = watch('photo');

    useImperativeHandle(ref, () => ({
        resetForm: methods.reset
    }));

    return (
        <Form.Root<UserFormSchemaData>
            title={hasUserData ? 'Editar Usuário' : 'Adicionar Usuário'}
            formMethods={methods}
            onSubmit={onSubmit}
            error={alertMessage}
        >
            <div className={styles.user}>
                <img src={photoInput ? photoInput : photo ? photo : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSseB6uZeeMH55OlfcMvLSB_O1j4c9eCKFcLQ&s'} />
                <div>
                    <span>{nameInput ? nameInput : name ? name : '------------'}</span>
                    <p>CT<span>{prontuarioInput ? prontuarioInput : prontuario ? prontuario : '-------'}</span></p>
                </div>
            </div>

            <Form.Input
                nameAndLabel={['name', 'Nome']}
                icon={Contact}
            />

            <Form.Input
                nameAndLabel={['prontuario', 'Prontuário']}
                icon={User}
            />

            <Form.Input
                nameAndLabel={['photo', 'Foto']}
                icon={Camera}
            />

            <Form.SwitchInput nameAndLabel={['role', 'Administrador']} />

            <Form.Button />
            <Form.Link to="/adm" />
        </Form.Root>
    )
})

export default UserForm;