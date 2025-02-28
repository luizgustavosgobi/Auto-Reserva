import Link from "next/link";

const Paths = {
  "/register": "Sua primeira vez aqui?",
  "/sign-in": "Fazer Login",
  "/admin/dashboard": "Ver quem está cadastrado",
  "/": "Ir para a página inicial",
} as const;

type FormLinkProps = {
  to: keyof typeof Paths;
};

export default function FormLink({ to }: FormLinkProps) {
  return (
    <Link
      href={to}
      className="mt-0.8 mr-0.5 self-end text-[medium] font-bold text-purple-300 no-underline hover:text-purple-400"
    >
      {Paths[to]}
    </Link>
  );
}
