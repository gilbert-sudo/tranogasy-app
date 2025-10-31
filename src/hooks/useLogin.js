import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/redux";
import { useLocation } from "wouter";
import { useImage } from "./useImage";
import { useModal } from "./useModal";

import Swal from "sweetalert2";
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bootstrapClassname, setBootstrap] = useState(null);
  const [location, setLocation] = useLocation();
  const historyStack = useSelector((state) => state.historyStack);
  const { notLogedInImg } = useImage();
  const { showModal } = useModal();

  //redux
  const dispatch = useDispatch();

  const notLogedPopUp = async () => {
    Swal.fire({
      title: "<h6><strong>Vous êtes déconnecté(e)<strong><h6/>",
      html: `<img src=${notLogedInImg()} class="img-fluid"><br> Pour aimer et sauvegarder des articles, connectez-vous ou créez votre compte gratuitement. Merci !`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Se connecter",
      confirmButtonColor: "#7cbd1e",
      cancelButtonText: "Annuler",
      cancelButtonColor: "#F31559",
      customClass: {
        popup: "smaller-sweet-alert",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        showModal("login");
        Swal.close();
      }
    });
  };

  const login = async (phone, passwordToTest) => {
    setIsLoading(true);
    setError(null);
    if (!phone.length || !passwordToTest.length) {
      setBootstrap("alert alert-warning");
      setError("Veuillez remplir les champs obligatoires.");
      setIsLoading(false);
      return;
    }

    const startsWithCode = /^\+261/.test(phone);

    if (startsWithCode) {
      phone = phone.slice(4);
    }

    const phoneNumber = phone.trim().replace(/\s/g, "");
    const password = passwordToTest.trim().replace(/\s/g, "");
    const phoneNumberRegex = /^(03[2,3,4,7,8])(\d{7})$|^(3[2,3,4,7,8])(\d{7})$/;
    if (phoneNumberRegex.test(phoneNumber)) {
      if (phoneNumber.length === 10 || phoneNumber.length === 9) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/users/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({ phone: phoneNumber, password }),
            }
          );

          const json = await response.json();

          if (!response.ok) {
            setBootstrap("alert alert-danger");
            setError(json.error);
            Swal.close();
            setIsLoading(false);
          }

          if (response.ok) {
            dispatch(setUser(json.user));
            setBootstrap("alert alert-success");
            setError("Vous vous êtes connecté(e) maintenant!");
            localStorage.setItem("user", JSON.stringify(json));
            setIsLoading(false);
            Swal.close();
            setLocation("/loader");
            console.log(location);
            setTimeout(() => {
              console.log("steps needed: ", -(historyStack.steps + 2));
              window.history.go(-(historyStack.steps + 2));
            }, 500);
          }
        } catch (error) {
          setIsLoading(false);
          setLocation("/nosignal");
          Swal.close();
        }
      }
    } else {
      // Phone number has invalid format
      setBootstrap("alert alert-danger");
      setError("Ce numéro ne possède pas de compte.");
      setIsLoading(false);
    }
  };

  const loginLastUser = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/loginLastUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ userId }),
      });

      const json = await response.json();

      if (response.ok) {
        dispatch(setUser(json.user));
        localStorage.setItem("user", JSON.stringify(json));
      }
    } catch (error) {
      setLocation("/nosignal");
    }
  };

  const loginWithFacebookID = async (facebookID) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/census-taker/connect/${facebookID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        setIsLoading(false);
        setBootstrap("alert alert-danger");
      }

      if (response.ok) {
        setBootstrap("alert alert-success");
        setError("Vous vous êtes connecté(e) maintenant!");
        localStorage.setItem("user", JSON.stringify(json));
        dispatch(setUser(json.user));
        setIsLoading(false);
        window.location.href = "/";
      }
    } catch (error) {
      setIsLoading(false);
      setLocation("/nosignal");
    }
  };

  return {
    loginWithFacebookID,
    login,
    loginLastUser,
    notLogedPopUp,
    isLoading,
    setIsLoading,
    error,
    bootstrapClassname,
  };
};
