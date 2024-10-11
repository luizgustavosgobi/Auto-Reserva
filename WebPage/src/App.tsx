import { createContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import { validateToken } from "./utils/token.ts";
import User from "./utils/types/User.ts";

export const UserContext = createContext({} as User);
export const OpenAlert = createContext({} as {open: boolean, setOpen: (open: boolean) => void})

function StructureApp() {
  const [open, setOpen] = useState(false);

  return (
    <OpenAlert.Provider value={{open, setOpen}}>
      <Header />
      <Outlet />
      <Footer />
    </OpenAlert.Provider>
  );

}

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (!pathname.startsWith("/sign")) {
      validateToken().then(data => {
        setUser(data);

        if (pathname.startsWith("/adm") && data.role !== 'ADMIN') {
          navigate("/");
        }
      });
    }
  }, [navigate, pathname]);

  return (
    <>
        {user ? (
            <UserContext.Provider value={user}>
                <StructureApp />
            </UserContext.Provider>
        ) : (
            <StructureApp />
        )}
    </>
  );
}

export default App;