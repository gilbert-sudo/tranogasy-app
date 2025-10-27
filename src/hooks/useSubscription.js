import { useLocation } from "wouter";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setPricingField } from "../redux/redux";

import { useImage } from "./useImage";

export const useSubscription = () => {

  const [, setLocation] = useLocation();
  const { notPremiumImg } = useImage();
  const dispatch = useDispatch();

  const subscribeUser = async (userId, planValidity) => {
    try {
      console.log(userId, planValidity);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/subscribe/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ planValidity }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        console.log(json.message);
        return { status: "success", user: json.user };
      }
      if (!response.ok) {
        console.log(json.message);
        return { status: "failed" };
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
      return { status: "failed" };
    }
  };

  const unSubscribeUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/subscribe/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ setToNull: true }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        console.log(json.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const notSubscribedPopup = async () => {
    Swal.fire({
      title: "<h6><strong>Vous êtes en mode gratuit<strong><h6/>",
      html: `<img src=${notPremiumImg()} alt="please log in" class="img-fluid"><br> Nous sommes désolés, mais vous devez disposer d'un forfait pour effectuer cette action. Veuillez acheter un forfait pour continuer ! <strong>( À partir de 0 ar )</strong>`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Voir les Offres",
      confirmButtonColor: "#7cbd1e",
      cancelButtonText: "Annuler",
      cancelButtonColor: "#F31559",
      customClass: {
        popup: "smaller-sweet-alert",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(setPricingField({ key: "pricingModal", value: true }));
        Swal.close();
      }
    });
  }

  return {
    subscribeUser,
    unSubscribeUser,
    notSubscribedPopup,
  };
};
