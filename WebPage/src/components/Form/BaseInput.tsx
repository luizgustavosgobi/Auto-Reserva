import { ElementType } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import styles from '../styles/Form.module.css';
import User from '../../utils/types/User';

type registerName = keyof User | 'confirmPassword' | 'confirmEmail'

export type BaseInputProps = {
    nameAndLabel: [registerName, string] 
    icon?: ElementType,
}

function formatString(str: string) {
    str = str.replace(/([A-Z])/g, ' $1');
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function BaseInput({ nameAndLabel, icon: Icon, type = "text", children }: BaseInputProps & { type?: string, children?: React.ReactNode }) {
    const { register, formState: { errors } } = useFormContext()
    const placeholder = formatString(nameAndLabel[0])
    const errorMessage = (errors[nameAndLabel[0]] as FieldError)?.message;

    return (
        <div className={styles.inputGroup}>
            <label>{nameAndLabel[1]}</label>
            <div className={styles.inputIcon}>
                {Icon && <Icon size={35} color='var(--color-purple-300)' />}
                <input
                    type={type}
                    placeholder={nameAndLabel[0] === "prontuario" ? "Identifier" : placeholder}
                    {...register(nameAndLabel[0])}
                />
                {children}
            </div>
            {errorMessage && <p className={styles.errorInput}>{errorMessage}</p>}
        </div>
    );
}