"use client";

import { Switch } from "../ui/switch";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import BaseInput, { BaseInputProps } from "./BaseInput";
import { FormField, FormControl } from "../ui/form";

export function FormInput(props: BaseInputProps) {
  return <BaseInput {...props} />;
}

export function FormPasswordInput({ nameAndLabel }: BaseInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const iconProps = {
    className: "absolute text-[1.5em] cursor-pointer right-2.5 top-2",
    onClick: () => setShowPassword(!showPassword),
  };

  return (
    <BaseInput
      nameAndLabel={nameAndLabel}
      type={showPassword ? "text" : "password"}
      icon={Lock}
    >
      {showPassword ? <Eye {...iconProps} /> : <EyeOff {...iconProps} />}
    </BaseInput>
  );
}

export function FormSwitchInput({
  nameAndLabel,
  defaultChecked = false,
}: BaseInputProps & { defaultChecked?: boolean }) {
  const { control } = useFormContext();

  return (
    <div className="flex items-center justify-center gap-10 text-center">
      <label htmlFor={nameAndLabel[0]}>{nameAndLabel[1]}</label>
      <FormField
        name={nameAndLabel[0]}
        control={control}
        defaultValue={!defaultChecked}
        render={({ field }) => (
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        )}
      />
    </div>
  );
}
