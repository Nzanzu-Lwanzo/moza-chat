import "./App.scss";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Chat from "./pages/Chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider, closeSnackbar, enqueueSnackbar } from "notistack";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { XCircle } from "@phosphor-icons/react";
import { CookiesProvider } from "react-cookie";
import { idbConnection, openLocalDatabase } from "./db/connection";
import { useEffect } from "react";
import Axios from "axios";
import { BASE_URL } from "./utils/constants";
import useChatStore from "./stores/ChatStore";
import { UserType } from "./typings/@types";

const client = new QueryClient({
  defaultOptions: {
    mutations: {},
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

function App() {
  const { setAllUsers } = useChatStore();

  useEffect(() => {
    openLocalDatabase({
      onOpenSuccess: () => {
        Axios.get(BASE_URL.concat("/user/"), { withCredentials: true })
          .then((response) => {
            const data = response.data;
            setAllUsers(data as UserType[]);
            idbConnection.insert({
              into: "users",
              values: data,
              ignore: true,
              skipDataCheck: true,
              upsert: true,
            });
          })
          .catch((e) => {
            console.log(e);
            setAllUsers(null);
          });
      },
      onOpenError: () => {
        enqueueSnackbar("IDB not initialized !");
      },
    });
  }, []);

  return (
    <>
      <CookiesProvider>
        <QueryClientProvider client={client}>
          <SnackbarProvider
            autoHideDuration={5000}
            maxSnack={4}
            className="notistack__toast"
            preventDuplicate={false}
            action={(snackbarId) => (
              <button onClick={() => closeSnackbar(snackbarId)}>
                <XCircle size={23} fill="#FFF" />
              </button>
            )}
          >
            <Router>
              <Routes>
                <Route path="/" Component={Home} />
                <Route path="/chat" Component={Chat} />
                <Route path="/client/auth/">
                  <Route path="login" Component={LogIn} />
                  <Route path="signup" Component={SignUp} />
                </Route>
              </Routes>
            </Router>
          </SnackbarProvider>
        </QueryClientProvider>
      </CookiesProvider>
    </>
  );
}

export default App;
