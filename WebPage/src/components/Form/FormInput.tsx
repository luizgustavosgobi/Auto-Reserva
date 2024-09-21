import CustomSwitch from '@/components/CustomSwitch';
import { Box } from '@mui/material';
import styles from '@styles/Form.module.css';
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import BaseInput, { BaseInputProps } from "./BaseInput";

export function FormInput(props: BaseInputProps) {
    return <BaseInput {...props} />;
}

export function FormPasswordInput({ nameAndLabel }: BaseInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <BaseInput nameAndLabel={nameAndLabel} type={showPassword ? 'text' : 'password'} icon={Lock}>
            {showPassword
                ? <Eye id={styles.eye} onClick={() => setShowPassword(!showPassword)} />
                : <EyeOff id={styles.eye} onClick={() => setShowPassword(!showPassword)} />
            }
        </BaseInput>
    );
}

export function FormSwitchInput({ nameAndLabel, defaultChecked = false }: BaseInputProps & { defaultChecked?: boolean }) {
    const { control } = useFormContext();

    return (
        <Box>
            <label>{nameAndLabel[1]}</label>
            <Controller
                name={nameAndLabel[0]}
                control={control}
                defaultValue={defaultChecked}
                render={({ field }) => (
                    <CustomSwitch
                        {...field}
                        checked={field.value}
                    />
                )}
            />
        </Box>
    );
}