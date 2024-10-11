import { OpenAlert } from '@/App';
import { getToken } from '@/utils/token';
import User from '@/utils/types/User';
import { Tooltip } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import FilledAlert from './FilledAlert';
import styles from "./styles/NavigationBar.module.css";
import './styles/UserTable.css';

interface UserActionsProps {
    user: Omit<User, "reciveEmails" | "Dias">
    rowsState: {
        rows: User[]
        setRows: Dispatch<SetStateAction<User[]>>
    }
}

function UserActions({ user, rowsState }: UserActionsProps) {
    const { rows, setRows } = rowsState
    const [delUser, setDelUser] = useState<User | null>(null);
    const [message, setMessage] = useState<[string, boolean]>(['', false]);
    const [loading, setLoading] = useState(false);
    const { setOpen } = useContext(OpenAlert);

    async function deleteUser(userACToken: string, userIdentifier: string) {
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${userIdentifier}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify({ accessCode: userACToken })
            });

            if (res.ok) {
                const updatedRows = rows!.filter((row) => row.prontuario !== userIdentifier);
                setRows(updatedRows);
                setMessage(["Usuário excluído com sucesso!", true]);
            } else {
                setMessage(["Falha ao excluir usuário: " + (await res!.json()).message, false]);
            }

            setOpen(true);
        } 
        finally {setLoading(false); }
    }

    const { name, photo, prontuario, accessCode, role } = delUser ?? {};

    return (
        <>
            {createPortal(
                (delUser || loading) && (
                    <div className={`${styles.pageOpacity} containerDelete`} onClick={() => setDelUser(null)}>
                        {loading ? (
                            <div className="loading"></div>
                        ) : (
                            <div className="confirmDelete" onClick={(e) => e.stopPropagation()}>
                                <h3>Tem certeza que deseja excluir o usuário?</h3>
                                <div className="userData">
                                    <img src={photo} alt="img User" />
                                    <div style={{ textAlign: "left" }}>
                                        <p>{name}</p>
                                        <span style={{ fontSize: '1.1rem' }}>{role}</span>
                                    </div>
                                </div>
                                <div className="buttonsDelete">
                                    <button onClick={() => setDelUser(null)}>Cancelar</button>
                                    <button 
                                        onClick={() => {
                                            setDelUser(null);
                                            deleteUser(accessCode as string, prontuario as string);
                                        }}
                                    >
                                        Sim
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ),
                document.getElementById("root") as HTMLElement
            )}

            <FilledAlert
                message={message[0]}
                success={message[1]}
            />

            <div className='actions'>
                <Tooltip title="Edit this user">
                    <Link to="/adm/edit-user" state={{ user }}>
                        <Edit
                            size={41}
                            className='editUser'
                        />
                    </Link>
                </Tooltip>

                <Tooltip title="Delete this user">
                    <Trash2
                        size={41}
                        className='delUser'
                        onClick={() => setDelUser(user as User)}
                    />
                </Tooltip>
            </div>
        </>
    );
}

export default UserActions;
