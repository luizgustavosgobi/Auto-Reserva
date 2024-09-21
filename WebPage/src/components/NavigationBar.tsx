import { UserContext } from '@/App.tsx';
import { eraseCookie } from '@/utils/token';
import { AlignJustify, Home, LogOut, Mail, UserCog, UserPlus } from 'lucide-react';
import React, { cloneElement, ReactElement, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './styles/NavigationBar.module.css';

type NavigationBarProps = {
    divOpacity: HTMLDivElement,
    setDivOpacity: (arg: boolean) => void
}

type RenderIconProps = {
    IconElement: ReactElement,
    path: string
}

function NavigationBar({ divOpacity, setDivOpacity }: NavigationBarProps) {
    const { prontuario, name, photo, role } = useContext(UserContext)!
    const { pathname } = useLocation();
    const [menuBar, setMenuBar] = useState(false)
    const [isClosing, setIsClosing] = useState(false);

    const openMenuBar = () => {
        setMenuBar(true);
        setDivOpacity(true);
    }

    const closeMenuBar = () => {
        setIsClosing(true);
        setDivOpacity(false);
        setTimeout(() => {
            setMenuBar(false);
            setIsClosing(false);
        }, 100)
    }

    useEffect(() => {
        if (divOpacity) {
            divOpacity.addEventListener('click', () => {
                closeMenuBar();
            })
        }
    }, [divOpacity]);

    const links = [
        { path: '/', icon: <Home/>, label: 'Página Inicial' },
        { path: '/change-email', icon: <Mail/>, label: 'Alterar Email' },
        ...(role === 'ADMIN' ? [
            { path: '/adm', icon: <UserCog/>, label: 'Administrador' },
            { path: '/adm/create-user', icon: <UserPlus/>, label: 'Adicionar Usuário' },
        ] : []),
    ];
    
    const RenderIcon = ({ IconElement, path }: RenderIconProps) => {
        return (pathname === path) ? 
            cloneElement(IconElement, { size: 20 }) : 
            cloneElement(IconElement, { color: 'gray', size: 20 });
    };

    return (
        <>
            <AlignJustify size={35} onClick={openMenuBar} id={styles.openMenu} />
            
            {menuBar &&
                <div className={`${styles.menuBar} ${isClosing ? styles.closeMenuBar : ''}`}>
                    <div className={styles.profile}>
                        <img src={photo} className={styles.photoUser} />
                        <div className={styles.userInfos}>
                            <p>{name}</p>
                            <span>CT{prontuario}</span>
                        </div>
                        <span id={styles.close} onClick={closeMenuBar}> X </span>
                    </div>
                    <hr />

                    <div className={styles.links}>
                        {links.map(({ path, icon, label }) => (
                            <React.Fragment key={path}>
                                {path === '/adm' ? <hr /> : null}       
                                <Link
                                    to={path} 
                                    state={null}
                                    className={styles.link}
                                    onClick={() => { closeMenuBar(); }}
                                >
                                    <RenderIcon IconElement={icon} path={path} />
                                    <p>{label}</p>
                                </Link>
                            </React.Fragment>
                        ))}

                        <hr />
                        <Link
                            className={styles.link}
                            id={styles.logout}
                            to='/sign-in'
                            onClick={() => {
                                setDivOpacity(false);
                                eraseCookie("token");
                            }}
                        >
                            <LogOut size={18} color='rgb(224, 19, 19)' />
                            <p>Sair</p>
                        </Link>
                    </div>
                </div>
            }
        </>
    )
};

export default NavigationBar;