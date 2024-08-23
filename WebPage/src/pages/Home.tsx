import { CalendarDays } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { OpenAlert, UserContext } from '../App.tsx';
import CustomSwitch from '../components/CustomSwitch.tsx';
import FilledAlert from '../components/FilledAlert.tsx';
import Section from '../components/Section.tsx';
import SectionInput from '../components/SectionInput.tsx';
import classes from '../components/styles/Form.module.css';
import { getToken } from '../token.ts';
import styles from './styles/home.module.css';

function Home() {
    useEffect(() => { document.title = 'Auto Reserva' }, [])

    const { name, email, Dias } = useContext(UserContext);

    const { setOpen } = useContext(OpenAlert);
    const [extraDays, setExtraDays] = useState<string[]>([]);
    const [deletedDays, setDeletedDays] = useState<string[]>([]);
    const [message, setMessage] = useState<[string, boolean]>(['', false]);
    const [reserve, setReserve] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (Dias) {
            const { daysOfWeek, extraDays, deletedDays, reserve } = Dias;
            updateUserDays(daysOfWeek);
            setExtraDays(extraDays);
            setDeletedDays(deletedDays);
            setReserve(reserve);
        }
    }, [Dias]);

    const weekDaysList = [
        { id: 'Seg', name: 'Segunda' },
        { id: 'Ter', name: 'Terça' },
        { id: 'Quar', name: 'Quarta' },
        { id: 'Quin', name: 'Quinta' },
        { id: 'Sex', name: 'Sexta' },
    ];

    const checkboxRefs = weekDaysList.map(() => useRef<HTMLInputElement | null>(null));

    async function savePreferences() {
        setIsSubmitting(true)
        setMessage(['', false])
        const newReserve = !reserve;
        setReserve(newReserve)

        const daysOfWeek = checkboxRefs
            .filter(checkbox => checkbox.current?.checked)
            .map((_, index) => weekDaysList[index].id);

        const data = { extraDays, deletedDays, daysOfWeek, reserve: newReserve }

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/preferences`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
        },)

        res!.ok
            ? setMessage(["Preferências Atualizadas com Sucesso", true])
            : setMessage(["Falha ao Atualizar as Informações: " + (await res!.json()).message, false])

        setOpen(true)
        setIsSubmitting(false)
    }

    function updateUserDays(daysOfWeek: string[]) {
        checkboxRefs.forEach((checkbox, index) => {
            if (daysOfWeek?.includes(weekDaysList[index].id)) {
                checkbox.current!.checked = true;
            }
        })
    }

    return (
        <main className={styles.wrapper}>
            <FilledAlert
                message={message[0]}
                success={message[1]}
            />

            {name &&
                <div>
                    <h2>Seja bem vindo
                        <span id={styles.userName}>{` ${name}`}</span>
                        <br />

                        Deseja Reservar?
                        <CustomSwitch
                            checked={reserve || false}
                            onChange={() => savePreferences()}
                        />
                    </h2>
                </div>
            }

            {!email &&
                <Link className={styles.emailAlert} id={styles.emailAlert} to="change-email">Clique aqui para cadastrar um email para receber notificações das reservas!</Link>
            }

            <div style={{width: 'fit-content', marginBottom: '1rem'}}>
                <section style={{ opacity: reserve ? '' : '0.7' }}>
                    <div className={styles.iconDays}>
                        <CalendarDays size={25} />
                        <h2> Alterar dias da Reserva </h2>
                    </div>

                    <div className={styles.alterDays}>
                        <Section title='Dias da Semana'>
                            <form>
                                {weekDaysList.map((day, index) => (
                                    <div key={day.id}>
                                        <input
                                            type="checkbox"
                                            ref={checkboxRefs[index]}
                                            className={styles.checkboxInput}
                                            disabled={!reserve}
                                        />
                                        <label htmlFor={day.name}>
                                            {day.name}
                                        </label>
                                    </div>
                                ))}
                            </form>
                        </Section>

                        <Section title='Adicionar Dias Extras'>
                            <SectionInput
                                days={extraDays}
                                setDays={setExtraDays}
                                otherElementDay={deletedDays}
                                reserve={reserve || false}
                            />
                        </Section>

                        <Section title='Adicionar Dias para NÃO Reservar'>
                            <SectionInput
                                days={deletedDays}
                                setDays={setDeletedDays}
                                otherElementDay={extraDays}
                                reserve={reserve || false}
                            />
                        </Section>

                        <button
                            id={styles.saveButton}
                            disabled={isSubmitting || !reserve}
                            onClick={savePreferences}
                            >
                            {isSubmitting ? <div className={classes.loading}></div> : "Salvar"}
                        </button>
                    </div>
                </section>
                <span className={styles.infoMessage}>*Não esqueça de salvar suas alterações</span>
            </div>
        </main>
    )
}

export default Home;