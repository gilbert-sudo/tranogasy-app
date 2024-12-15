import { useLocation } from "wouter";
import Swal from "sweetalert2";

export const usePopup = () => {

const [ ,setLocation] = useLocation("");

  const featureUnderConstructionPopup = async () => {
    Swal.fire({
      html: `<img src="images/WorkingOn.jpg" style="border-radius: 15px;" alt="please log in" class="img-fluid"><br>  <p style={{ fontWeight: "400" }}>
        Nos développeurs travaillent actuellement sur cette fonctionnalité,
        qui sera bientôt disponible. Nous nous excusons pour la gêne occasionnée et vous remercions de
        votre patience.
      </p>`,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "ok",
      confirmButtonColor: "#7cbd1e",
      customClass: {
        popup: "smaller-sweet-alert",
      },
    });
  };

  const unpaidBillPopup = async () => {
    Swal.fire({
      html: `<img src="images/unpaid-bill.jpg" style="border-radius: 15px;" alt="redo the payment please" class="img-fluid"><br> Il y a eu un problème avec votre dernier paiement. Veuillez le régulariser pour débloquer à nouveau cette fonctionnalité.`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Voir le paiement",
      confirmButtonColor: "#7cbd1e",
      cancelButtonText: "Fermer",
      cancelButtonColor: "#F31559",
      customClass: {
        popup: "smaller-sweet-alert",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setLocation("/payment-recovery");
      }
    });
  }

  return {
    featureUnderConstructionPopup,
    unpaidBillPopup,
  };
};
