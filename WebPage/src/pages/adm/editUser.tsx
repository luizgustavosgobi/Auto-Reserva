import UserForm from "./UserForm";
import { OpenAlert } from "../../App";
import { UserFormSchemaData } from "../../utils/schemas";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

function EditUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state ? location.state.user : null;
    const [message, setMessage] = useState<[string, boolean]>(['', false]);
    const { setOpen } = useContext(OpenAlert);

    useEffect(() => {
        if (!user) {
            navigate("/adm");
        }
    }, [user, navigate]);

    async function editUser(data: UserFormSchemaData) {
        const accessCode = user.accessCode;

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/editUser`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data, accessCode })
        })

        if (res.ok) {
            setMessage(['Alterações salvas!', true])
            setTimeout(() => { navigate("/adm") }, 2000)
        }
        else {
            res.json().then(data => setMessage([data.message, false]));
        }
        setOpen(true)
    }

    return <UserForm
        alertMessage={message}
        onSubmit={editUser}
        hasUserData
    />
}

export default EditUser;