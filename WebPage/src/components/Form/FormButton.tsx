import styles from '@styles/Form.module.css'
import { ButtonHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

type FormButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function FormButton(props: FormButtonProps){
    const { formState: { isSubmitting } } = useFormContext()

    return (
        <button
            type="submit"
            disabled={isSubmitting}
            {...props}
        >
        {isSubmitting ? <div className={styles.loading}></div> : "Enviar"}
        </button>
    )
}