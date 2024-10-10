import { useMutation } from "@tanstack/react-query";
import Axios, { AxiosError } from "axios";
import { User, LogInUser, SignUpUser } from "../utils/@types";
import { BASE_URL } from "../utils/constants";
import useAppStore from "../stores/useAppStore";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { lsWrite } from "../utils/ls.io";

export const useAuthenticate = () => {
  const setAuth = useAppStore((state) => state.setAuth);
  const navigateTo = useNavigate();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: {
      path: string;
      user: LogInUser | SignUpUser;
    }) => {
      try {
        const response = await Axios.post(
          BASE_URL.concat(data.path),
          data.user,
          {
            withCredentials: true,
          }
        );

        let authenticatedUser = response.data as User;
        setAuth(authenticatedUser);

        if (response.status < 400) {
          lsWrite("auth-user", authenticatedUser);
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
    login: (user: LogInUser): void => mutate({ path: "/auth/login", user }),
    signup: (user: SignUpUser): void => mutate({ path: "/auth/signup", user }),
    isPending,
    isSuccess,
    isError,
  };
};
