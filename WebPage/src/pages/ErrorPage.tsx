import { useEffect } from "react";
import { Link } from "react-router-dom";
import sytles from './styles/errorPage.module.css'

function ErrorPage() {
    useEffect(() => {document.title = 'Error 404 | Page not Found'}, []);

    return (
        <main className={sytles.wrapper}>
            <div className={sytles.error}>
                <h1>ERRO 404</h1>
                <p>Página não encontrada</p>
                <Link to='/'>Ir para página inicial</Link>
            </div>
        </main>
    )
}

export default ErrorPage;