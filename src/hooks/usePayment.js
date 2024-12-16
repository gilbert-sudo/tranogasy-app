import { useState } from "react";
import { useLocation } from "wouter";
import { useSubscription } from "./useSubscription";
import { useNotification } from "./useNotification";
import { setUser } from "../redux/redux";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

export const usePayment = () => {
  const [, setLocation] = useLocation();
  const { subscribeUser } = useSubscription();
  const { sendNotification } = useNotification();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const verifyPayment = async (paymentInfo, amount, setCurrentPage) => {
    let countdown = 7; // Initial countdown value in seconds

    const updateCountDownText = () => {
      Swal.update({
        html: `Est-ce que vous êtes certain d'avoir envoyé ${amount}Ar par ${paymentInfo.mobileMoney} au numéro <u>${paymentInfo.number}</u> au nom de ${paymentInfo.name}? <br> <small>(${countdown} sec)</small>`,
      });
    };

    const countdownFunction = () => {
      countdown -= 1;
      updateCountDownText();
      Swal.update({
        showConfirmButton: false,
      });

      if (countdown > 0) {
        setTimeout(countdownFunction, 1000); // Update every second
      } else {
        // Show the confirm button after 7 seconds
        Swal.hideLoading();
        Swal.update({
          showConfirmButton: true,
          html: `Est-ce que vous êtes certain d'avoir envoyé ${amount}Ar par ${paymentInfo.mobileMoney} au numéro <u>${paymentInfo.number}</u> au nom de ${paymentInfo.name}?.`,
          confirmButtonText: "Oui",
        });
      }
    };
    Swal.fire({
      title: `<h6><strong>Êtes-vous vraiment sûr?</small></h6>`,
      html: `Est-ce que vous êtes certain d'avoir envoyé ${amount}Ar par ${paymentInfo.mobileMoney} au numéro <u>${paymentInfo.number}</u> au nom de ${paymentInfo.name}?`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "",
      confirmButtonColor: "#7cbd1e",
      cancelButtonText: "Non",
      cancelButtonColor: "#F31559",
      timerProgressBar: true, // Show progress bar
      customClass: {
        popup: "smaller-sweet-alert",
      },
      didOpen: () => {
        Swal.showLoading();
        countdownFunction();
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCurrentPage(3);
      }
    });
  };

  const addPayment = async (paymentData) => {
    let countdown = 7; // Initial countdown value in seconds

    const updateCountDownText = () => {
      Swal.update({
        html: `Vous avez envoyé ${paymentData.amount} ariary depuis le numéro <u>${paymentData.phoneNumber}</u> pour l'achat d'un ${paymentData.reason}. <br> <small>(${countdown} sec)</small>`,
      });
    };

    const countdownFunction = () => {
      countdown -= 1;
      updateCountDownText();
      Swal.update({
        showConfirmButton: false,
      });

      if (countdown > 0) {
        setTimeout(countdownFunction, 1000); // Update every second
      } else {
        // Show the confirm button after 7 seconds
        Swal.hideLoading();
        Swal.update({
          showConfirmButton: true,
          html: `Vous avez envoyé ${paymentData.amount} ariary depuis le numéro <u>${paymentData.phoneNumber}</u> pour l'achat d'un ${paymentData.reason}.`,
          confirmButtonText: "Oui, confirmer !",
        });
      }
    };
    Swal.fire({
      title: `<h6><strong>Vérifier bien le numéro !</small></h6>`,
      html: `Vous avez envoyé ${paymentData.amount} ariary depuis le numéro <u>${paymentData.phoneNumber}</u> pour l'achat d'un ${paymentData.reason}.`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "",
      confirmButtonColor: "#7cbd1e",
      cancelButtonText: "Annuler",
      cancelButtonColor: "#F31559",
      timerProgressBar: true, // Show progress bar
      customClass: {
        popup: "smaller-sweet-alert",
      },
      didOpen: () => {
        Swal.showLoading();
        countdownFunction();
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              user: paymentData.user,
              type: paymentData.type,
              reason: paymentData.reason,
              payload: paymentData.payload,
              amount: paymentData.amount,
              phoneNumber: paymentData.phoneNumber,
            }),
          });

          const paymentResponse = await response.json();
          console.log({ paymentResponse });

          if (response.ok) {
            console.log("step 2");
            //subscribe the user
            const subResponse = await subscribeUser(
              paymentData.user,
              paymentData.planValidity
            );
            console.log(subResponse);

            if (subResponse.status === "success") {
              setIsLoading(false);
              Swal.fire({
                title: "<h6><strong>Merci pour votre achat!<strong><h6/>",
                icon: "success",
                html: `Félicitations ! Vous avez souscrit à notre service premium ${paymentData.reason}.`,
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText: "Ok",
                confirmButtonColor: "#7cbd1e",
                customClass: {
                  popup: "smaller-sweet-alert",
                },
              });

              dispatch(setUser(subResponse.user));

              //sent notification
              const notificationData = { user: paymentData.user, payment: paymentResponse._id, message: `Nous sommes en train de confirmer votre paiement de ${paymentData.amount} Ar.`, reason: "payment", img: `images/${paymentData.operator}-avatar.jpg` };
              sendNotification(notificationData);

              window.history.go(-2);
            } else {
              setIsLoading(false);
              Swal.fire({
                title:
                  "<h6><strong>Oops! Une erreur s'est produite.<strong><h6/>",
                icon: "error",
                html: `Nous sommes désolés, mais une erreur s'est produite lors de votre achat. Veuillez réessayer plus tard.`,
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText: "Ok",
                confirmButtonColor: "#F31559",
                customClass: {
                  popup: "smaller-sweet-alert",
                },
              });
            }
          }
          if (!response.ok) {
            setIsLoading(false);
            Swal.fire({
              title:
                "<h6><strong>Oops! Une erreur s'est produite.<strong><h6/>",
              icon: "error",
              html: `Nous sommes désolés, mais une erreur s'est produite lors de votre achat. Veuillez réessayer plus tard.`,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: "Ok",
              confirmButtonColor: "#F31559",
              customClass: {
                popup: "smaller-sweet-alert",
              },
            });
          }
        } catch (error) {
          setIsLoading(false);
          setLocation("/nosignal");
          console.log(error);
          // Close the alert when loading is complete
          Swal.close();
        }
      }
    });
  };

  const makeFreePayment = async (paymentData) => {
    
    
    let countdown = 5; // Initial countdown value in seconds

    const updateCountDownText = () => {
      Swal.update({
        html: `Êtes-vous certain de vouloir souscrire au forfait ${paymentData.reason}? <br> <small>(${countdown} sec)</small>`,
      });
    };

    const countdownFunction = () => {
      countdown -= 1;
      updateCountDownText();
      Swal.update({
        showConfirmButton: false,
      });

      if (countdown > 0) {
        setTimeout(countdownFunction, 1000); // Update every second
      } else {
        // Show the confirm button after 7 seconds
        Swal.hideLoading();
        Swal.update({
          showConfirmButton: true,
          html: `Êtes-vous certain de vouloir souscrire au forfait ${paymentData.reason}?`,
          confirmButtonText: "Oui, confirmer !",
        });
      }
    };
    Swal.fire({
      title: `<h6><strong>Vérifier bien!</small></h6>`,
      html: `Êtes-vous certain de vouloir souscrire au forfait ${paymentData.reason}?`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "",
      confirmButtonColor: "#7cbd1e",
      cancelButtonText: "Annuler",
      cancelButtonColor: "#F31559",
      timerProgressBar: true, // Show progress bar
      customClass: {
        popup: "smaller-sweet-alert",
      },
      didOpen: () => {
        Swal.showLoading();
        countdownFunction();
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          //subscribe the user
          const subResponse = await subscribeUser(
            paymentData.user,
            paymentData.planValidity
          );
          console.log(subResponse);

          if (subResponse.status === "success") {
            setIsLoading(false);
            Swal.fire({
              title: "<h6><strong>Merci pour votre achat!<strong><h6/>",
              icon: "success",
              html: `Félicitations ! Vous avez souscrit à notre service premium ${paymentData.reason}.`,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: "Ok",
              confirmButtonColor: "#7cbd1e",
              customClass: {
                popup: "smaller-sweet-alert",
              },
            });

            dispatch(setUser(subResponse.user));

            window.history.back();
          } else {
            setIsLoading(false);
            Swal.fire({
              title:
                "<h6><strong>Oops! Une erreur s'est produite.<strong><h6/>",
              icon: "error",
              html: `Nous sommes désolés, mais une erreur s'est produite lors de votre achat. Veuillez réessayer plus tard.`,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: "Ok",
              confirmButtonColor: "#F31559",
              customClass: {
                popup: "smaller-sweet-alert",
              },
            });
          }
        } catch (error) {
          setIsLoading(false);
          setLocation("/nosignal");
          console.log(error);
          // Close the alert when loading is complete
          Swal.close();
        }
      }
    });
  };



  const updatePayment = async (paymentData, paymentId) => {
    let countdown = 7; // Initial countdown value in seconds

    const updateCountDownText = () => {
      Swal.update({
        html: `Vous avez envoyé ${paymentData.amount} ariary depuis le numéro <u>${paymentData.phoneNumber}</u> pour l'achat d'un ${paymentData.reason}. <br> <small>(${countdown} sec)</small>`,
      });
    };

    const countdownFunction = () => {
      countdown -= 1;
      updateCountDownText();
      Swal.update({
        showConfirmButton: false,
      });

      if (countdown > 0) {
        setTimeout(countdownFunction, 1000); // Update every second
      } else {
        // Show the confirm button after 7 seconds
        Swal.hideLoading();
        Swal.update({
          showConfirmButton: true,
          html: `Vous avez envoyé ${paymentData.amount} ariary depuis le numéro <u>${paymentData.phoneNumber}</u> pour l'achat d'un ${paymentData.reason}.`,
          confirmButtonText: "Oui, confirmer !",
        });
      }
    };
    Swal.fire({
      title: `<h6><strong>Vérifier bien le numéro !</small></h6>`,
      html: `Vous avez envoyé ${paymentData.amount} ariary depuis le numéro <u>${paymentData.phoneNumber}</u> pour l'achat d'un ${paymentData.reason}.`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "",
      confirmButtonColor: "#7cbd1e",
      cancelButtonText: "Annuler",
      cancelButtonColor: "#F31559",
      timerProgressBar: true, // Show progress bar
      customClass: {
        popup: "smaller-sweet-alert",
      },
      didOpen: () => {
        Swal.showLoading();
        countdownFunction();
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/${paymentId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              type: paymentData.type,
              phoneNumber: paymentData.phoneNumber,
              status: "redone",
              created_at: new Date().toISOString()
            }),
          });

          console.log(Date.now);


          const paymentResponse = await response.json();
          console.log(paymentResponse);

          if (response.ok) {
            setIsLoading(false);
            Swal.fire({
              title: "<h6><strong>Merci pour votre achat!<strong><h6/>",
              icon: "success",
              html: `Ok, veuillez à présent patienter ! Nous sommes en train de confirmer votre paiement.`,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: "Ok",
              confirmButtonColor: "#7cbd1e",
              customClass: {
                popup: "smaller-sweet-alert",
              },
            });

            //sent notification
            const notificationData = { user: paymentData.user, payment: paymentResponse._id, message: `Nous sommes en train de confirmer votre paiement de ${paymentData.amount} Ar.`, reason: "payment", img: `images/${paymentData.operator}-avatar.jpg` };
            sendNotification(notificationData);

            window.history.go(-2);
          }
          if (!response.ok) {
            setIsLoading(false);
            Swal.fire({
              title:
                "<h6><strong>Oops! Une erreur s'est produite.<strong><h6/>",
              icon: "error",
              html: `Nous sommes désolés, mais une erreur s'est produite lors de votre achat. Veuillez réessayer plus tard.`,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: "Ok",
              confirmButtonColor: "#F31559",
              customClass: {
                popup: "smaller-sweet-alert",
              },
            });
          }
        } catch (error) {
          setIsLoading(false);
          setLocation("/nosignal");
          console.log(error);
          // Close the alert when loading is complete
          Swal.close();
        }
      }
    });
  };

  return {
    verifyPayment,
    addPayment,
    makeFreePayment,
    updatePayment,
    isLoading,
  };
};
