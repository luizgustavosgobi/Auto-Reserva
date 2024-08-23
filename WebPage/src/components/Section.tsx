import styles from './styles/Section.module.css'

type SectionProps = {
    title: string,
    children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
    return (
        <div className={styles.section}>
            <h3>{title}</h3>
            <hr/>
            {children}
        </div>
    )
}

export default Section;