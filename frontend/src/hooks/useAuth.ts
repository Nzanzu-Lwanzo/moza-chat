import { useMutation } from "@tanstack/react-query";
import Axios, { AxiosError } from "axios";
import { UserType, LogInUserType, SignUpUserType } from "../utils/@types";
import { BASE_URL } from "../utils/constants";
import useAppStore from "../stores/AppStore";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { lsWrite } from "../utils/ls.io";
import { useCookies } from "react-cookie";
import { useState } from "react";
import useChatStore from "../stores/ChatStore";

export const useHasCookie = () => {
  const cookies: { "connect.sid"?: string } = useCookies(["connect.sid"])["0"];

  let hasCookie: boolean = cookies["connect.sid"] !== undefined;

  if (!hasCookie) localStorage.removeItem("auth-user");

  return hasCookie;
};

export const useAuthenticate = () => {
  const { setAuth } = useAppStore();
  const navigateTo = useNavigate();
  const [isLogginOut, setIsLoggingOut] = useState(false);
  const { setCurrentRoom } = useChatStore();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: {
      path: string;
      user: LogInUserType | SignUpUserType;
    }) => {
      try {
        const response = await Axios.post(
          BASE_URL.concat(data.path),
          data.user,
          {
            withCredentials: true,
          }
        );

        let authenticatedUserType = response.data as UserType;
        setAuth(authenticatedUserType);

        if (response.status < 400) {
          lsWrite("auth-user", authenticatedUserType);
          navigateTo("/chat");
        }

        return response.data;
      } catch (e) {
        let error = e as AxiosError;
        let snackMessage: string = "";

        switch (error.status) {
          case 406: {
            let data = error.response?.data as { message: string };

            switch (data.message) {
              case "DUPLICATE_USERNAME": {
                snackMessage = "Il existe un utilisateur avec ce nom !";
                break;
              }

              case "DUPLICATE_EMAIL": {
                snackMessage = "Il existe un utilisateur avec cette email !";
                break;
              }
            }

            enqueueSnackbar(snackMessage);

            break;
          }

          case 404: {
            enqueueSnackbar("Compte introuvable, créez-le peut-être !");
            break;
          }

          case 500: {
            // On suppose que jusqu'ici, les seules erreurs 500 lâchées
            // ce sont celles produites dans la stratégie
            enqueueSnackbar("Compte inexistant, veuillez le créez !");
            navigateTo("/client/auth/signup");
            break;
          }

          default: {
            enqueueSnackbar("Erreur, vous n'avez pas été connecté !");
            break;
          }
        }

        return error;
      }
    },
  });

  return {
    login: (user: LogInUserType): void => mutate({ path: "/auth/login", user }),
    signup: (user: SignUpUserType): void =>
      mutate({ path: "/auth/signup", user }),
    logout: async (): Promise<void> => {
      setIsLoggingOut(true); // To get a visual feedback
      try {
        const response = await Axios.get(BASE_URL.concat("/auth/logout"), {
          withCredentials: true,
        });

        if (response.status === 200) {
          // Navigate first
          navigateTo("/");

          // Do the rest in the background
          setAuth(undefined);
          setCurrentRoom(undefined);
          localStorage.removeItem("current-room");
          localStorage.removeItem("auth-user");
        }
      } catch (e) {
        let error = e as AxiosError;
        console.log(error);
      } finally {
        setIsLoggingOut(false); // To get a visual feedback
      }
    },
    isPending,
    isSuccess,
    isError,
    isLogginOut,
  };
};
