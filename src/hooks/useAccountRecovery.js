import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setUser,
  resetAccountRecovery,
  setAccountRecoveryUser,
  setAccountRecoveryVerification,
} from "../redux/redux";
import { useLocation } from "wouter";
import { useSignup } from "./useSignup";
import { useRedux } from "./useRedux";
import { useSMS } from "./useSMS";
import Swal from "sweetalert2";

export const useAccountRecovery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bootstrapClassname, setBootstrapClassname] = useState(null);
  const [, setLocation] = useLocation();
  const { generateRandomCode } = useSignup();
  const dispatch = useDispatch();
  const { sendSMS } = useSMS();
  const { resetReduxStore } = useRedux();

  const verifyUsersPhoneNumber = async (inputedPhone) => {

    const phone = inputedPhone.trim().replace(/\s/g, "");
    const phoneNumber = (phone.startsWith("0")) ? phone : `0${phone}`;

    // Generate a random number of 4 characters
    const confirmationCode = await generateRandomCode();

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/exist/${phoneNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        if (json) {
          // console.log(json);
          dispatch(setAccountRecoveryUser(json));
          dispatch(setAccountRecoveryVerification({ code: confirmationCode }));

          // send verification code to the user
          // await sendBefianaSMS(
          //   phoneNumber,
          //   "Votre code de confirmation TranoGasy est le : " + confirmationCode
          // );

          await sendSMS(
            phoneNumber,
            "Votre code de confirmation TranoGasy est le : " + confirmationCode
          );

          setError(null);
          setLocation("/password-recovery-verification");
        } else {
          dispatch(resetAccountRecovery());
          setError("Une erreur s'est produite.");
          setBootstrapClassname("alert alert-danger");
        }
        setIsLoading(false);
      }
      if (!response.ok) {
        console.log(json.error);
        setError(json.error);
        setBootstrapClassname("alert alert-danger");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      // setLocation("/nosignal");
      console.log(error);
    }
  };

  const resetUsersPassword = async (userId, newPassword, confirmPassword) => {
    if (newPassword.length >= 8 && newPassword.length <= 12) {
      if (newPassword === confirmPassword) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/users/update-password/${userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({ newPassword }),
            }
          );

          const json = await response.json();

          if (response.ok) {
            setTimeout(() => {
              setIsLoading(false);
            }, 0);
            if (json) {
              console.log(json);
              setError(null);
              resetReduxStore();
              dispatch(setUser(json));
              localStorage.setItem("user", JSON.stringify({ user: json }));
              setLocation("/loader");
              Swal.close();
            } else {
              setError("Une erreur s'est produite.");
              setBootstrapClassname("alert alert-danger");
            }
          }
          if (!response.ok) {
            console.log(json.message);
            setError(json.message);
            setBootstrapClassname("alert alert-danger");
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
          setLocation("/nosignal");
          console.log(error);
        }
      } else {
        setError(
          "Le mot de passe de confirmation ne correspond pas au mot de passe que vous avez indiqué."
        );
        setBootstrapClassname("alert alert-danger");
        setIsLoading(false);
      }
    } else {
      setError("Le mot de passe doit contenir entre 8 et 12 caractères.");
      setBootstrapClassname("alert alert-danger");
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    bootstrapClassname,
    verifyUsersPhoneNumber,
    resetUsersPassword,
  };
};
