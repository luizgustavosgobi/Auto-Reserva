"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { UserContext } from "@/layout";
import { useContext, useEffect, useState } from "react";
import { getToken } from "@/utils/token";
import User from "@/utils/types/User";

async function fetchData(): Promise<User[]> {
  let usersData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });

  let users: User[] = await usersData.json();

  return users;
}

export default function Dashboard() {
  const [data, setData] = useState<User[]>([]);
  const user = useContext(UserContext);

  useEffect(() => {
    const getData = async () => {
      const users = await fetchData();
      const filteredUsers = users.filter(
        (data) => data.prontuario !== user?.prontuario,
      );
      setData(filteredUsers);
    };

    getData();
  }, [user]);

  return (
    <>
      <title>Auto Reserva | Usuários</title>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
