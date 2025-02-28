"use client";

import { useEffect, useState } from "react";
import { UserFormSchemaData } from "@/utils/schemas";
import { getToken } from "@/utils/token";
import { toast } from "sonner";
import { UserForm } from "@/(private)/admin/UserForm";
import User from "@/utils/types/User";

export default function EditUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("editUser");

    data
      ? setUser(JSON.parse(data))
      : window.location.replace("/admin/dashboard");
  }, []);

  async function handleEditUser(data: UserFormSchemaData) {
    const accessCode = user?.accessCode;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/edit-user`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
        body: JSON.stringify({ ...data, accessCode }),
      },
    );

    if (res.ok) {
      toast.success("Alterações salvas!");
      sessionStorage.removeItem("editUser");
      setTimeout(() => {
        window.location.replace("/admin/dashboard");
      }, 2000);
    } else {
      res.json().then((data) => toast.error(data.message));
    }
  }

  return <UserForm onSubmit={handleEditUser} hasUserData />;
}
