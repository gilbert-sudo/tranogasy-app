import { useLocation } from "wouter";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/redux";
import { useModal } from "./useModal";
import Swal from "sweetalert2";

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bootstrapClassname, setBootstrap] = useState(null);
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { hideModal, setCodeConfirmer } = useModal();

  const generateRandomCode = async () => {
    const min = 100;
    const max = 999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  };

  const signup = async (
    inputedUsername,
    inputedEmail,
    inputedPhone,
    inputedPassword,
    inputedConfirmPassword,
    confirmationCode
  ) => {
    setIsLoading(true);
    setError(null);
    if (
      !inputedUsername.length ||
      !inputedPhone.length ||
      !inputedPassword.length ||
      !inputedConfirmPassword.length
    ) {
      setBootstrap("alert alert-warning");
      setError("Veuillez remplir les champs obligatoires.");
      setIsLoading(false);
      return;
    }
    const username = inputedUsername
      .trim()
      .replace(/\s{2,}/g, " ")
      .replace(/(^|\s)\S/g, function (match) {
        return match.toUpperCase(); // capitalize first letter of each word
      });

    const startsWithCode = /^\+261/.test(inputedPhone);

    if (startsWithCode) {
      inputedPhone = inputedPhone.slice(4);
    }

    const phone = inputedPhone.trim().replace(/\s/g, "");
    const password = inputedPassword.trim().replace(/\s/g, "");
    const confirmPassword = inputedConfirmPassword.trim().replace(/\s/g, "");
    const email = inputedEmail.trim().replace(/\s/g, "");
    const phoneNumberRegex = /^(03[2,3,4,7,8])(\d{7})$|^(3[2,3,4,7,8])(\d{7})$/;
    const phoneNumber = (phone.startsWith("0")) ? phone : `0${phone}`;

    if (username.length <= 40) {
      if (phoneNumberRegex.test(phoneNumber)) {
        if (phoneNumber.length === 10 || phoneNumber.length === 9) {
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

            if (response.ok) {
              setBootstrap("alert alert-danger");
              setError(
                "Ce numéro de téléphone est déjà utilisé par un autre utilisateur"
              );
              setIsLoading(false);
            }
            if (!response.ok) {
              if (password === confirmPassword) {
                // verify the user's phone number
                setCodeConfirmer(confirmationCode);
                setIsLoading(false);
              } else {
                setBootstrap("alert alert-danger");
                setError(
                  "Le mot de passe de confirmation ne correspond pas au mot de passe que vous avez indiqué."
                );
                setIsLoading(false);
              }
            }
          } catch (error) {
            setLocation("/nosignal");
            setBootstrap("alert alert-danger");
            setError("Une  erreur s'est produite.");
            setIsLoading(false);
          }
        }
      } else {
        // Phone number has invalid format
        setBootstrap("alert alert-danger");
        setError("votre numéro de téléphone n'est pas valide.");
        setIsLoading(false);
      }
    } else {
      // username has invalid length
      setBootstrap("alert alert-danger");
      setError(
        "Oups ! Le nom d'utilisateur doit comporter 40 caractères ou moins."
      );
      setIsLoading(false);
    }
  };

  const finalizeSignup = async ({ username, email, phone, password }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          username,
          email,
          phone,
          password,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "<h6><strong>Bienvenue sur TranoGasy !<strong><h6/>",
          text: "Votre compte a été créé avec succès.",
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "ok, merci",
          confirmButtonColor: "#7cbd1e",
          customClass: {
            popup: "smaller-sweet-alert",
          },
        });

        dispatch(setUser(json.user));
        localStorage.setItem("user", JSON.stringify(json));
        setIsLoading(false);
        hideModal();
      }
      if (!response.ok) {
        setBootstrap("alert alert-danger");
        setError("Une erreur s'est produite.");
        setIsLoading(false);
      }
    } catch (error) {
      setLocation("/nosignal");
      setIsLoading(false);
    }
  };

  return {
    generateRandomCode,
    signup,
    finalizeSignup,
    isLoading,
    error,
    bootstrapClassname,
  };
};
