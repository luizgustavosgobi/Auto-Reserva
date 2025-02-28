"use client"

import { useRef } from 'react';
import { UserFormSchemaData } from '@/utils/schemas';
import { getToken } from '@/utils/token';
import { toast } from 'sonner';
import { UserForm } from '@/(private)/admin/UserForm';

export default function CreateUser() {
    const userFormRef = useRef<{ resetForm: () => void }>(null);

    async function createUser(data: UserFormSchemaData) {
        if (!data.photo) { data.photo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSseB6uZeeMH55OlfcMvLSB_O1j4c9eCKFcLQ&s' }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            },
            body: JSON.stringify(data)
        })

        res.ok
            ? (toast.success('Usuário adicionado com sucesso!'))
            : res.json().then(data => toast.error(data.message));

        if (userFormRef.current && res.ok) {
            userFormRef.current.resetForm();
        }
    }

    return <UserForm
        ref={userFormRef}
        onSubmit={createUser}
        hasUserData={false}
    />
}