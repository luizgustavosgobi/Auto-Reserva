"use client"

import { ColumnDef } from "@tanstack/react-table"
import User from "@/utils/types/User"
import UserActions from "./userActions"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export const columns: ColumnDef<User>[] = [
    {
        id: "photo",
        cell: ({ row }) => {
            return (
                <Avatar>
                    <AvatarImage src={row.original.photo} />
                </Avatar>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "prontuario",
        header: "Identifier",
    },
    {
        header: "Email",
        cell: ({ row }) => {
            return row.original.email || "not registered";
        },
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "accessCode",
        header: "Access Code",
    },
    {
        header: "Actions",
        cell: ({ row }) => {
            return <UserActions user={row.original} />
        },
    },
]