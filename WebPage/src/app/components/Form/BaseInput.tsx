import User from "@/utils/types/User";
import { ElementType } from "react";
import { FieldError, useFormContext } from "react-hook-form";

type registerName = keyof User | "confirmPassword" | "confirmEmail";

export type BaseInputProps = {
  nameAndLabel: [registerName, string];
  icon?: ElementType;
};

function formatString(str: string) {
  str = str.replace(/([A-Z])/g, " $1");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function BaseInput({
  nameAndLabel,
  icon: Icon,
  type = "text",
  children,
}: BaseInputProps & { type?: string; children?: React.ReactNode }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const placeholder = formatString(nameAndLabel[0]);
  const errorMessage = (errors[nameAndLabel[0]] as FieldError)?.message;

  return (
    <div className="mb-4 grid">
      <label className="font-bold self-start text-lg text-gray-100">
        {nameAndLabel[1]}
      </label>
      <div className="relative flex items-center w-full max-sm:w-[16.5rem]">
        {Icon && (
          <Icon
            size={35}
            color="var(--color-purple-300)"
            className="absolute p-2"
          />
        )}
        <input
          type={type}
          placeholder={
            nameAndLabel[0] === "prontuario" ? "Identifier" : placeholder
          }
          className={`${nameAndLabel[0].toLowerCase().includes("password") ? "pr-[2.5rem]" : ""} w-80 rounded-lg border-none bg-gray-400 p-2 pl-10 text-[large] font-thin text-gray-50 placeholder-gray-200 caret-purple-300 focus:outline focus:outline-gray-50 max-sm:w-[16.5rem]`}
          {...register(nameAndLabel[0])}
        />
        {children}
      </div>
      {errorMessage && (
        <p className="max-sm:[16rem] w-fit max-w-xs text-[medium] break-keep text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
