import { useFormContext } from 'react-hook-form'
import { ButtonHTMLAttributes } from 'react'
import styles from '../styles/Form.module.css'

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