import { OpenAlert } from "@/App";
import UserForm from "@/components/UserForm";
import { UserFormSchemaData } from "@/utils/schemas";
import { getToken } from "@/utils/token";
import { useContext, useRef, useState } from "react";

function CreateUser() {
    const [message, setMessage] = useState<[string, boolean]>(['', false]);
    const { setOpen } = useContext(OpenAlert);

    const userFormRef = useRef<{resetForm: () => void}>(null);

    async function createUser(data: UserFormSchemaData) {
        if (!data.photo) { data.photo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSseB6uZeeMH55OlfcMvLSB_O1j4c9eCKFcLQ&s' }

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            },
            body: JSON.stringify(data)
        })

        res.ok
            ? (setMessage(['Usuário adicionado com sucesso!', true]))
            : res.json().then(data => setMessage([data.message, false]));

        if (userFormRef.current) {
            userFormRef.current.resetForm();
        }

        setOpen(true)
    }

    return <UserForm
        ref={userFormRef}
        alertMessage={message}
        onSubmit={createUser}
        hasUserData={false}
    />
}

export default CreateUser;