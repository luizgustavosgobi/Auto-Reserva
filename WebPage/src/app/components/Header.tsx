"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import logo from "@/assets/ifspCTDLogo.png";

function Header() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <div>
      <header className="flex items-center justify-center border-b-2 border-solid border-b-purple-600 bg-gray-700 p-2 max-sm:gap-4">
        {!(pathname === "/sign-in") && !(pathname === "/register") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="ml-5 cursor-pointer max-sm:ml-0" />
            </TooltipTrigger>
            <TooltipContent>
              {state === "expanded"
                ? "Fechar barra lateral"
                : "Abrir barra lateral"}
            </TooltipContent>
          </Tooltip>
        )}

        <div className="m-auto flex items-center max-sm:m-0">
          <img
            src={logo.src}
            alt="Logo IFSP"
            className="max-w-[4.75rem] object-cover"
          />
          {pathname.startsWith("/adm") ? (
            <h1 className="text-center text-[xx-large] font-bold max-sm:text-[20px]">
              Painel do Administrador
            </h1>
          ) : (
            <h1 className="text-center text-[xx-large] font-bold max-sm:text-[20px]">
              SICA - Auto Reserva
            </h1>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
