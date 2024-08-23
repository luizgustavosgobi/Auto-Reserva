import { useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import NavigationBar from './NavigationBar';
import classes from './styles/NavigationBar.module.css';
import styles from './styles/Header.module.css'
import logo from '/src/assets/ifspCTDLogo.png';

function Header() {
    const { pathname } = useLocation();
    const [pageOpacity, setPageOpacity] = useState(false);
    const divOpacityRef = useRef<HTMLDivElement | null>(null);

    return (
        <div>
            <div className={pageOpacity ? classes.pageOpacity : ''} ref={divOpacityRef}></div>

            <header className={styles.Header}>
                <div className={styles.titleLogo}>
                    <img src={logo} alt="Logo IFSP" />
                    {pathname.startsWith("/adm")
                        ? <h1>Painel do Administrador</h1>
                        : <h1>SICA - Auto Reserva</h1>
                    }
                </div>

                {(pathname === '/' || pathname === '/change-email' || pathname.startsWith("/adm")) &&
                    <NavigationBar setDivOpacity={setPageOpacity} divOpacity={divOpacityRef.current as HTMLDivElement} />
                }
            </header>
        </div>
    )
}

export default Header;