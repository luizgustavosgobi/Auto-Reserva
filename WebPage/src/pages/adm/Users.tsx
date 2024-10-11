import { UserContext } from "../../App";
import { getToken } from "@/utils/token";
import { useContext, useEffect, useState } from "react";
import UserTable from "@/components/UserTable.tsx";
import User from "@/utils/types/User.ts";

function Users() {
    const { prontuario } = useContext(UserContext)!;
    const [users, setUsers] = useState<User[]>([]);

    const loadUsers = async () => {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + getToken() }
        })
        response.json().then(async data => {
            const filteredData = data.filter((user: User) => (user.prontuario !== prontuario))
            setUsers(filteredData)
        });
    }

    useEffect(() => {
        document.title = 'Adm | Users';
        loadUsers();
    }, []);

    const usersObject = users.reduce((obj, user, index) => {
        obj[index] = user;
        return obj;
    }, {} as { [key: string]: User });

    return (
        <main style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            padding: "2.8rem"
        }}>
            <UserTable {...usersObject} />
        </main>
    )
}

export default Users;