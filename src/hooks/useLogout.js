import { useRedux } from "./useRedux";
import { useLocation } from "wouter";

export const useLogout = () => {
  const { resetReduxStore } = useRedux();
  const [ , setLocation] = useLocation();

  const logout = () => {
    //remove user from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("signup");

    //update the user redux state
    resetReduxStore();
  };

  return { logout };
};


