"use client";
"use strict";

import { UserContext } from "@/layout";
import { Form } from "@/components/Form/index";
import { emailSchema, EmailSchemaData } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getToken } from "@/utils/token";

export default function AlternateEmail() {
  const user = use(UserContext);

  const methods = useForm<EmailSchemaData>({
    resolver: zodResolver(emailSchema),
  });

  async function handleEditUser(data: EmailSchemaData) {
    const { email, receiveEmails } = data;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/updateEmail`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
        body: JSON.stringify({ email, receiveEmails }),
      },
    );

    if (res.ok) {
      toast.success("Email atualizado com Sucesso!");
      methods.reset();
      window.location.reload();
    } else {
      res.json().then((data) => toast.error(data.message));
    }
  }

  return (
    <div>
      <title>Auto Reserva | Alterar Email</title>

      <div>
        {user && user.email ? (
          <p className="mx-auto mt-12 w-fit rounded-xl bg-purple-500 p-4 text-lg max-sm:w-[21rem]">
            Email atual: <span className="text-[#00d9ff]">{user.email}</span>
          </p>
        ) : (
          <p className="mx-auto mt-12 w-fit rounded-xl bg-[#c91f1f] p-4 text-lg max-sm:w-[21rem]">
            <span className="text-white">Nenhum email cadastrado ❌</span>
          </p>
        )}
      </div>

      <Form.Root<EmailSchemaData>
        title="Alterar Email"
        formMethods={methods}
        onSubmit={handleEditUser}
      >
        <Form.Input nameAndLabel={["email", "Email"]} icon={Mail} />

        <Form.Input
          nameAndLabel={["confirmEmail", "Confirmar Email"]}
          icon={Mail}
        />

        <Form.SwitchInput
          nameAndLabel={["receiveEmails", "Receber notificações?"]}
          defaultChecked
        />

        <Form.Button />
        <Form.Link to="/" />
      </Form.Root>
    </div>
  );
}
