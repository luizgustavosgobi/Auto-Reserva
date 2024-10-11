import { useState, useEffect, FormEvent } from 'react';
import styles from './styles/SectionInput.module.css'

type SectionInputProps = {
    days: string[],
    otherElementDay: string[],
    setDays: (days: string[]) => void,
    reserve: boolean
}

function SectionInput({ days, setDays, otherElementDay, reserve }: SectionInputProps) {
    const [date, setDate] = useState('');
    const [error, setError] = useState(false);

    const removeDay = (date: string) => {
        const newDays = days.filter(day => day !== date);
        setDays(newDays);
    }

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(false);
            }, 3000);
        }
    }, [error]);


    function addDate(e: FormEvent) {
        e.preventDefault()

        const formattedDate = date.split('-').reverse().join('/');
        const dateToday = new Date().toLocaleDateString().split('/').reverse().join('-');

        if (date <= dateToday || days.includes(formattedDate) || otherElementDay.includes(formattedDate) || date.length !== 10) {
            setError(true);
            return;
        }

        setDays([...days, formattedDate]);
        setDate('');
    }

    return (
        <div className={styles.SectionInput}>
            <form>
                <input
                    type="date"
                    maxLength={8}
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                    className={error ? styles.error : ''}
                    disabled={!reserve}
                />

                <button type="submit" disabled={!reserve} onClick={addDate}>Adicionar</button>
            </form>
            <div className={styles.allDays}>
                {days.map((day) => {
                    return (
                        <div className={styles.days} key={day}>
                            <li>{day}</li>
                            <button className={styles.removeButton} disabled={!reserve} onClick={() => removeDay(day)}>Retirar</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SectionInput;