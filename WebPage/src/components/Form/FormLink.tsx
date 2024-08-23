import { Link } from 'react-router-dom';

enum Paths {
    '/sign-up' = 'Sua primeira vez aqui?',
    '/sign-in' = 'Fazer Login',
    '/adm' = 'Ver quem está cadastrado',
    '/' = 'Ir para a página inicial'
}

type FormLinkProps = {
    to: keyof typeof Paths;
}

export default function FormLink({ to }: FormLinkProps) {
    return ( <Link to={to}>{Paths[to]}</Link> );
}