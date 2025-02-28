"use client";

import { userFormSchema, UserFormSchemaData } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Contact, User } from "lucide-react";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../../components/Form";
import TypeUser from "@/utils/types/User";
import { usePathname, useRouter } from "next/navigation";

type UserFormProps = {
  hasUserData: boolean;
  onSubmit: (data: UserFormSchemaData) => void;
};

type Role = "USER" | "ADMIN";

export const UserForm = forwardRef(
  ({ hasUserData, onSubmit }: UserFormProps, ref) => {
    const patnhame = usePathname();
    const router = useRouter();
    let name = "",
      prontuario = "",
      photo = "",
      role: Role = "USER";

    if (hasUserData) {
      const userData = sessionStorage.getItem("editUser");

      if (!userData) {
        router.push("/admin/dashboard");
        return;
      }

      const user: TypeUser = JSON.parse(userData);
      ({ name = "", prontuario = "", photo = "", role = "USER" } = user);
    }

    function DefaultValueRole({ role }: { role: Role }) {
      if (patnhame === "/admin/edit-user") {
        return role === "ADMIN";
      } else {
        return false;
      }
    }

    const methods = useForm<UserFormSchemaData>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        name,
        prontuario,
        photo,
        role: DefaultValueRole({ role }),
      },
    });

    const { watch } = methods;
    const prontuarioInput = watch("prontuario");
    const nameInput = watch("name");
    const photoInput = watch("photo");

    useImperativeHandle(ref, () => ({
      resetForm: methods.reset,
    }));

    const title = hasUserData ? "Editar Usuário" : "Adicionar Usuário";

    return (
      <Form.Root<UserFormSchemaData>
        title={title}
        formMethods={methods}
        onSubmit={onSubmit}
      >
        <title>{`Admin | ${title}`}</title>

        <div className="mb-4 flex w-fit gap-4 self-center rounded-[20px] bg-gray-700 p-4">
          <img
            className="h-24 w-24 rounded-[20px] object-cover"
            src={
              photoInput
                ? photoInput
                : photo
                  ? photo
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSseB6uZeeMH55OlfcMvLSB_O1j4c9eCKFcLQ&s"
            }
          />
          <div className="flex flex-col items-start justify-evenly text-start text-[large] font-semibold">
            <span>{nameInput ? nameInput : name ? name : "------------"}</span>
            <p>
              CT
              <span>
                {prontuarioInput
                  ? prontuarioInput
                  : prontuario
                    ? prontuario
                    : "-------"}
              </span>
            </p>
          </div>
        </div>

        <Form.Input nameAndLabel={["name", "Nome"]} icon={Contact} />

        <Form.Input nameAndLabel={["prontuario", "Prontuário"]} icon={User} />

        <Form.Input nameAndLabel={["photo", "Foto"]} icon={Camera} />

        <Form.SwitchInput nameAndLabel={["role", "Administrador"]} />

        <Form.Button />
        <Form.Link to="/admin/dashboard" />
      </Form.Root>
    );
  },
);
