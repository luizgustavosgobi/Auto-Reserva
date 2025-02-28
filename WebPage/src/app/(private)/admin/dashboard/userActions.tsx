"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import User from "@/utils/types/User";
import { getToken } from "@/utils/token";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function UserActions({ user }: { user: User }) {
  const router = useRouter();

  async function deleteUser({
    accessCode,
    userId,
  }: {
    accessCode: string;
    userId: string;
  }) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
        body: JSON.stringify({ accessCode }),
      },
    );

    const data = await res.json();

    if (res.ok) {
      toast.success("Usuário excluído com sucesso!");
      window.location.reload();
    } else {
      toast.error("Falha ao excluir usuário: " + data.message);
    }
  }

  function handleEditUser() {
    sessionStorage.setItem("editUser", JSON.stringify(user));
    router.push("/admin/edit-user");
  }

  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer rounded-md p-2 hover:bg-gray-50">
              <Edit
                className="h-4 w-4 text-yellow-500"
                onClick={() => handleEditUser()}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer rounded-md p-2 hover:bg-gray-50">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-900">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Realmente deseja excluir o usuário?
                    </AlertDialogTitle>
                    <div className="m-auto my-[1rem] flex w-fit items-center justify-center gap-2 rounded-md bg-gray-600 p-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.photo} />
                      </Avatar>
                      <div className="text-gray-100">
                        <p>{user.name}</p>
                        <span>{`CT${user.prontuario}`}</span>
                      </div>
                    </div>
                    <AlertDialogDescription className="text-gray-200">
                      Essa ação não poderá ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer text-gray-900 hover:bg-gray-100">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer bg-gray-700 hover:bg-gray-600"
                      onClick={async () => {
                        await deleteUser({
                          accessCode: user.accessCode,
                          userId: user.prontuario,
                        });
                      }}
                    >
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
