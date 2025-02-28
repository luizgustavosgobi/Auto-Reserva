import { Home, LogOut, Mail, UserCog, UserPlus } from "lucide-react";
import { UserContext } from "@/layout";
import { use } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { Avatar, AvatarImage } from "./ui/avatar";
import { logOutUser } from "@/utils/token";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Página Inicial",
    url: "/",
    icon: Home,
  },
  {
    title: "Alterar Email",
    url: "/alternate-email",
    icon: Mail,
  },
  {
    title: "Administrador",
    url: "/admin/dashboard",
    icon: UserCog,
  },
  {
    title: "Adicionar Usuário",
    url: "/admin/create-user",
    icon: UserPlus,
  },
  {
    title: "Sair",
    url: "/sign-in",
    icon: LogOut,
  },
];

export function AppSidebar() {
  const user = use(UserContext);
  const currentPath = usePathname();

  return (
    <Sidebar className="border-r-[1px]">
      <SidebarContent className="bg-gray-600">
        <div className="justify-left m-0 flex items-center p-3">
          <Avatar>{user && <AvatarImage src={user && user.photo} />}</Avatar>
          <div className="ml-4 flex flex-col text-gray-50">
            <b>{user && user.name}</b>
            <p>{user && user.prontuario}</p>
          </div>
        </div>
        <Separator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => {
                  if (item.url.startsWith("/admin")) {
                    return user && user.role === "ADMIN";
                  }
                  return true;
                })
                .map((item) => (
                  <div key={item.title}>
                    {item.url === "/sign-in" && <Separator className="my-2" />}

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="cursor-pointer p-5 hover:bg-gray-400 active:bg-gray-400"
                        onClick={
                          item.url === "/sign-in" ? logOutUser : undefined
                        }
                      >
                        <a href={item.url}>
                          <item.icon
                            size={24}
                            className={
                              item.url === currentPath
                                ? "text-gray-300"
                                : item.url === "/sign-in"
                                  ? "text-red-500"
                                  : "text-gray-50"
                            }
                          />
                          <span
                            className={`text-[1.05rem] ${
                              item.url === "/sign-in"
                                ? "text-red-500"
                                : "text-gray-50"
                            }`}
                          >
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
