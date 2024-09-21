import FilledAlert from '@/components/FilledAlert';
import styles from '@styles/Form.module.css';
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

type FormRootProps<T extends FieldValues> = {
    title: 'Cadastro' | 'Login' | 'Alterar Email' | 'Adicionar Usuário' | 'Editar Usuário',
    children: React.ReactNode,
    onSubmit: SubmitHandler<T>,
    formMethods: UseFormReturn<T>,
    // sign-(in/up) screens has just error messages(string), anothers screens has success messages too([string, boolean])
    error: string | [string, boolean]
}

export default function FormRoot<T extends FieldValues>({title, onSubmit, formMethods, children, error}: FormRootProps<T>) {
    return (
        <div className={styles.main}>
            <div className={styles.LoginForm}>
                <h1>{title}</h1>
                <FilledAlert 
                    message={Array.isArray(error) ? error[0] : error} 
                    success={Array.isArray(error) ? error[1] : false}
                />

                <FormProvider {...formMethods}>
                    <form onSubmit={formMethods.handleSubmit(onSubmit)} className={styles.Form}>
                        {children}
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}
