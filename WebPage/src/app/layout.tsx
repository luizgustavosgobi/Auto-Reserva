"use client";

import { validateToken } from "./utils/token";
import { usePathname } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import type User from "./utils/types/User";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

export const UserContext = createContext<User | null>(null);

function StructureApp({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <title>Auto Reserva</title>
      <link rel="icon" type="image/png" href="./public/images/iconWEB.png" />
      <meta name="robots" content="noindex" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <div className="flex h-screen flex-col">
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SidebarProvider>
      </div>
      <Toaster />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const signRoute = ["/sign-in", "/register"];
  const isSignRoute = signRoute.includes(pathname);

  useEffect(() => {
    if (!isSignRoute) {
      const fetchUser = async () => {
        try {
          const userData = await validateToken();
          setUser(userData);
        } catch (error) {
          console.error("Failed to validate token: ", error);
          setUser(null);
        }
      };

      fetchUser();
    }
  }, [pathname]);

  return (
    <html lang="pt-br">
      <body className="h-full bg-gray-900 font-[Poppins] text-gray-50">
        <div className="flex h-screen flex-col justify-between overflow-x-hidden">
          {isSignRoute ? (
            <StructureApp>{children}</StructureApp>
          ) : (
            <UserContext.Provider value={user}>
              <StructureApp>{children}</StructureApp>
            </UserContext.Provider>
          )}
        </div>
      </body>
    </html>
  );
}
