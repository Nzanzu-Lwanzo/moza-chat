import { useMutation } from "@tanstack/react-query";
import Axios, { AxiosError } from "axios";
import { UserType, LogInUserType, SignUpUserType } from "../utils/@types";
import { BASE_URL } from "../utils/constants";
import useAppStore from "../stores/useAppStore";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { lsWrite } from "../utils/ls.io";
import { useCookies } from "react-cookie";
import { useState } from "react";

export const useAuthenticate = () => {
  const setAuth = useAppStore((state) => state.setAuth);
  const setCurrentRoom = useAppStore((state) => state.setCurrentRoom);
  const navigateTo = useNavigate();
  const [isLogginOut, setIsLoggingOut] = useState(false);

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

        if (error.status === 406) {
          let data = error.response?.data as { message: string };

          if (data.message === "DUPLICATE_USERNAME") {
            snackMessage = "Il existe un utilisateur avec ce nom !";
          } else if (data.message === "DUPLICATE_EMAIL") {
            snackMessage = "Il existe un utilisateur avec cette email !";
          }
        } else {
          snackMessage = "Il se peut que ces données soient incorrectes !";
        }

        enqueueSnackbar(snackMessage);
        enqueueSnackbar("Oups ! La requête a échoué !");

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
          setAuth(undefined);
          setCurrentRoom(undefined);
          localStorage.removeItem("current-room");
          localStorage.removeItem("auth-user");

          navigateTo("/");
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

export const useHasCookie = () => {
  const cookies: { "connect.sid"?: string } = useCookies(["connect.sid"])["0"];

  let hasCookie: boolean = cookies["connect.sid"] !== undefined;

  if (!hasCookie) localStorage.removeItem("auth-user");

  return hasCookie;
};
