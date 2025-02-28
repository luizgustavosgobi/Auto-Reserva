"use client";
"use strict";

import { UserContext } from "@/layout";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import Section from "@/components/Section";
import SectionInput from "@/components/SectionInput";
import { getToken } from "@/utils/token";
import { CalendarDays } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FormControl, FormField } from "@/components/ui/form";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

export default function Page() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Home />
    </FormProvider>
  );
}

function Home() {
  const { control } = useFormContext();
  const user = use(UserContext);
  const [userDays, setUserDays] = useState<[string[], string[], boolean]>([
    [],
    [],
    false,
  ]); // [extraDays, deletedDays, reserve]
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shortName = user?.name?.split(" ");

  const setExtraDays = (newExtraDays: string[]) => {
    setUserDays([newExtraDays, userDays[1], userDays[2]]);
  };

  const setDeletedDays = (newDeletedDays: string[]) => {
    setUserDays([userDays[0], newDeletedDays, userDays[2]]);
  };

  useEffect(() => {
    if (user && user.days) {
      const { daysOfWeek, extraDays, deletedDays, reserve } = user.days;
      updateUserDays(daysOfWeek);
      setUserDays([extraDays, deletedDays, reserve]);
    }
  }, [user]);

  const weekDaysList = [
    { id: "Seg", name: "Segunda" },
    { id: "Ter", name: "Terça" },
    { id: "Quar", name: "Quarta" },
    { id: "Quin", name: "Quinta" },
    { id: "Sex", name: "Sexta" },
  ];

  const checkboxRefs = weekDaysList.map(() =>
    useRef<HTMLInputElement | null>(null),
  );

  async function savePreferences({
    toggleReserve,
  }: {
    toggleReserve: boolean;
  }) {
    setIsSubmitting(true);

    const newReserve = toggleReserve ? !userDays[2] : userDays[2];
    setUserDays([userDays[0], userDays[1], newReserve]);

    const daysOfWeek = checkboxRefs
      .map((checkbox, index) => ({ checkbox, index }))
      .filter(({ checkbox }) => checkbox.current?.checked)
      .map(({ index }) => weekDaysList[index].id);

    const data = {
      extraDays: userDays[0],
      deletedDays: userDays[1],
      daysOfWeek,
      reserve: newReserve,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/preferences`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
      },
    );

    res.ok
      ? toast.success("Preferências Atualizadas com Sucesso")
      : toast.error(
          "Falha ao Atualizar as Informações: " + (await res.json()).message,
        );

    setIsSubmitting(false);
  }

  function updateUserDays(daysOfWeek: string[]) {
    checkboxRefs.forEach((checkbox, index) => {
      if (checkbox.current) {
        checkbox.current.checked = daysOfWeek.includes(weekDaysList[index].id);
      }
    });
  }

  return (
    <main className="flex flex-col items-center gap-[0.8rem] p-6 text-center">
      {user && user.name && (
        <div>
          <h2 className="text-[1.3rem] max-sm:text-[21px]">
            Seja bem vindo
            <span className="text-[1.7rem] font-bold text-purple-600">{` ${shortName && shortName[0]} ${shortName && shortName.pop()}`}</span>
            <br />
            Deseja Reservar?
            <FormField
              name={"reserve"}
              control={control}
              defaultValue={user.days?.reserve}
              render={({ field }) => (
                <FormControl>
                  <Switch
                    checked={field.value}
                    className="ml-2"
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      savePreferences({ toggleReserve: true });
                    }}
                  />
                </FormControl>
              )}
            />
          </h2>
        </div>
      )}

      {user && !user.email && (
        <Link
          className="my-[0.6rem] rounded-[10px] bg-purple-500 p-4 text-[1.15rem] text-gray-50 no-underline hover:bg-purple-700 max-sm:my-[0.9rem] max-sm:mt-2.5 max-sm:text-[0.9rem]"
          href="/alternate-email"
        >
          Clique aqui para cadastrar um email para receber notificações das
          reservas!
        </Link>
      )}

      <div className="mb-2 w-fit">
        <section
          style={{ opacity: userDays[2] ? "" : "0.7" }}
          className="w-full rounded-[10px] bg-gray-700 p-4"
        >
          <div className="mb-3 flex items-center justify-center gap-3 text-[1.4rem] font-bold max-sm:gap-2">
            <CalendarDays size={25} />
            <h2> Alterar dias da Reserva </h2>
          </div>

          <div className="grid grid-cols-3 grid-rows-[auto_auto] gap-[1.6rem] rounded-[10px] bg-gray-500 p-4 max-sm:grid-cols-[1fr]">
            <Section title="Dias da Semana">
              <form className="my-auto flex items-start gap-2 rounded-[5px] bg-gray-800 px-4 py-2 has-[input[type=checkbox]]:flex-col">
                {weekDaysList.map((day, index) => (
                  <div key={day.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      ref={checkboxRefs[index]}
                      className="h-[18px] w-[18px] accent-purple-500"
                      disabled={!userDays[2]}
                    />
                    <label
                      htmlFor={day.name}
                      className="text-[1.1rem] font-bold"
                    >
                      {day.name}
                    </label>
                  </div>
                ))}
              </form>
            </Section>

            <Section title="Adicionar Dias Extras">
              <SectionInput
                days={userDays[0]}
                setDays={setExtraDays}
                otherElementDay={userDays[1]}
                reserve={userDays[2] || false}
              />
            </Section>

            <Section title="Adicionar Dias para NÃO Reservar">
              <SectionInput
                days={userDays[1]}
                setDays={setDeletedDays}
                otherElementDay={userDays[0]}
                reserve={userDays[2] || false}
              />
            </Section>

            <button
              className="col-[2/3] m-auto w-[85%] cursor-pointer place-items-center rounded-[7px] border-none bg-[rgb(43,150,70,1)] p-2 text-[1.3rem] font-bold text-gray-50 hover:bg-[rgb(35,128,58)] disabled:grid disabled:cursor-not-allowed disabled:place-items-center disabled:bg-[rgb(31,119,53)] max-sm:col-[1/1] max-sm:w-full"
              disabled={isSubmitting || !userDays[2]}
              onClick={() => savePreferences({ toggleReserve: false })}
            >
              {isSubmitting ? (
                <div className="h-[23px] w-[23px] animate-spin rounded-[50%] border-l-[2.5px] border-solid border-l-[rgb(0,217,255)] bg-transparent"></div>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </section>
        <span className="justify-left mt-[0.2rem] ml-4 flex text-[rgb(221,218,218)] max-sm:text-left max-sm:text-[smaller]">
          *Não esqueça de salvar suas alterações
        </span>
      </div>
    </main>
  );
}
