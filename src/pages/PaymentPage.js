import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NotLogedIn from "../components/NotLogedIn";
import { GiCircle } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { usePayment } from "../hooks/usePayment";
import Swal from "sweetalert2";

import "./css/payment.css";
import "../components/css/sweetalert.css";

const PaymentPage = () => {

  // redux
  const user = useSelector((state) => state.user);
  const [isMvola, setisMvola] = useState(true);
  const [isOrangemoney, setisOrangemoney] = useState(false);
  const [isAirtelmoney, setisAirtelmoney] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const { verifyPayment, addPayment, updatePayment, isLoading } = usePayment();

  const [match, params] = useRoute("/payment/:planData/:option");
  const planData = match ? params.planData : null;
  const payments = useSelector((state) => state.payments);
  const payment = payments.length > 0 ? payments.filter((payment) => payment.status === "refused")[0] : null;
  const option = match ? params.option : null;

  const planDetails = JSON.parse(decodeURIComponent(planData));

  const amount = planDetails.amount;

  const paymentInfo = {
    operator: isAirtelmoney
      ? "airtel"
      : isMvola
      ? "telma"
      : isOrangemoney && "orange",
    name: isAirtelmoney
      ? "tranogasy_airtel"
      : isMvola
      ? "tranogasy_telma"
      : isOrangemoney && "tranogasy_orange",
    mobileMoney: isAirtelmoney
      ? "Airtel money"
      : isMvola
      ? "Mvola"
      : isOrangemoney && "Orange money",
    number: isAirtelmoney
      ? "0335562455"
      : isMvola
      ? "0345189896"
      : isOrangemoney && "0321902559",
    color: isAirtelmoney
      ? "red"
      : isMvola
      ? "#00703c"
      : isOrangemoney
      ? "#ff6600"
      : "black",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentData = {
      user: user._id,
      type: paymentInfo.mobileMoney,
      reason: planDetails.planName,
      amount,
      phoneNumber,
      planValidity: planDetails.planValidity,
      operator: paymentInfo.operator
    };

    const phone = phoneNumber.trim().replace(/\s/g, "");
    const phoneNumberRegex = /^(03[2,3,4,8])|^(3[2,3,4,8])/;

    if (!phone) {
      setError("Veuillez saisir un numéro !");
    } else if (!phoneNumberRegex.test(phone)) {
      console.log(phone);
      setError("le numéro doit commencé par 032, 033 ou 034 !");
    } else if (phone.length < 10) {
      setError("Ce numéro est trop court !");
    } else if (phone.length > 10) {
      setError("Ce numéro est trop long !");
    } else if (phone === paymentInfo.number) {
      setError(
        "Veuillez entrer le numéro avec lequel vous avez envoyé l'argent ! ( Ilay numero mpandefa )"
      );
    } else {
      if (option === "init") {
        addPayment(paymentData);
      } else if (option === "recovery") {
        updatePayment(paymentData, payment._id);   
      }
    }

    // Set setError to false after 5 seconds to hide the  msg
    setTimeout(() => {
      setError(null);
    }, 8500);
  };

  useEffect(() => {
    if (isLoading) {
      // Display the alert
      Swal.fire({
        imageUrl: "images/purchage.gif",
        allowOutsideClick: false,
        showConfirmButton: false,
      });
    } 
  }, [isLoading]);

  return (
    <div className="payment">
      {user && user ? (
        <div className="payment mt-5 pt-1">
          <div className="site-section site-section-sm bg-light">
            <div className="container" style={{ paddingBottom: "80px" }}>
              <div className="d-flex align-items-center justify-content-end mb-3">
                <button
                  style={{ borderRadius: "15px" }}
                  className="btn btn-sm btn-danger"
                  onClick={() => window.history.back()}
                >
                  <RxCross2 className="mb-1" /> Annuler
                </button>
              </div>
              {/* payment form */}
              <form method="post" onSubmit={handleSubmit}>
                <div className="container" style={{ paddingBottom: "80px" }}>
                  {currentPage && currentPage === 1 && (
                    <h6 className="font-weight-light text-uppercase mb-4">
                      Méthode de paiement :
                    </h6>
                  )}
                  <div id="nav-tab-rent" className="tab-pane fade show active">
                    <center>
                      <div className="form-group">
                        {currentPage && currentPage === 1 && (
                          <>
                            {" "}
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                setisMvola(true);
                                setisOrangemoney(false);
                                setisAirtelmoney(false);
                              }}
                              className="d-flex justify-content-between align-items-center col-lg-4 col-sm-10 col-md-12 mb-2 w-100 pl-0"
                            >
                              <span>
                                <GiCircle
                                  style={{ borderRadius: "50%" }}
                                  className={`font-weight-bold mr-2 ${
                                    isMvola ? "bg-success" : ""
                                  }`}
                                />
                              </span>
                              <img
                                className={`img-fluid btn-group w-100 mr-2 ${
                                  isMvola
                                    ? "gradient-border"
                                    : "border border-dark"
                                }`}
                                style={{
                                  borderRadius: "15px",
                                  cursor: "pointer",
                                  maxHeight: "70px",
                                  opacity: `${isMvola ? "1" : "0.8"}`,
                                }}
                                src="images/telma.png"
                                alt="telma"
                              />
                            </div>
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                setisOrangemoney(true);
                                setisMvola(false);
                                setisAirtelmoney(false);
                              }}
                              className="d-flex justify-content-between align-items-center col-lg-4 col-sm-10 col-md-12 mb-2 w-100 pl-0"
                            >
                              <span>
                                <GiCircle
                                  style={{ borderRadius: "50%" }}
                                  className={`font-weight-bold mr-2 ${
                                    isOrangemoney ? "bg-success" : ""
                                  }`}
                                />
                              </span>
                              <img
                                className={`img-fluid btn-group w-100 mr-2 ${
                                  isOrangemoney
                                    ? "gradient-border"
                                    : "border border-dark"
                                }`}
                                style={{
                                  borderRadius: "15px",
                                  cursor: "pointer",
                                  maxHeight: "70px",
                                  opacity: `${isOrangemoney ? "1" : "0.8"}`,
                                }}
                                src="images/orange.png"
                                alt="orange"
                              />
                            </div>
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                setisAirtelmoney(true);
                                setisMvola(false);
                                setisOrangemoney(false);
                              }}
                              className="d-flex justify-content-between align-items-center col-lg-4 col-sm-10 col-md-12 mb-2 w-100 pl-0"
                            >
                              <span>
                                <GiCircle
                                  style={{ borderRadius: "50%" }}
                                  className={`font-weight-bold mr-2 ${
                                    isAirtelmoney ? "bg-success" : ""
                                  }`}
                                />
                              </span>
                              <img
                                className={`img-fluid btn-group w-100 mr-2 ${
                                  isAirtelmoney
                                    ? "gradient-border"
                                    : "border border-dark"
                                }`}
                                style={{
                                  borderRadius: "15px",
                                  cursor: "pointer",
                                  maxHeight: "70px",
                                  opacity: `${isAirtelmoney ? "1" : "0.8"}`,
                                }}
                                src="images/airtel.png"
                                alt="airtel"
                              />
                            </div>
                          </>
                        )}
                        {currentPage && currentPage === 2 && (
                          <>
                            <div
                              style={{ borderRadius: "15px" }}
                              className="align-items-center col-lg-4 col-sm-10 col-md-12 mb-2 w-100 p-3 bg-white border border-dark"
                            >
                              <img
                                className="img-fluid btn-group w-100"
                                style={{
                                  cursor: "pointer",
                                  maxHeight: "70px",
                                }}
                                src={`images/${paymentInfo.operator}.png`}
                                alt={`${paymentInfo.operator}`}
                              />
                              <p className="mt-3">
                                Veuillez maintenant envoyer{" "}
                                <price
                                  style={{ color: paymentInfo.color }}
                                  className="font-weight-bold h6"
                                >
                                  {amount && amount} Ar{" "}
                                </price>
                                par {paymentInfo.mobileMoney} au numéro{" "}
                              </p>
                              <name>
                                <numero
                                  style={{ color: paymentInfo.color }}
                                  className="h4"
                                >
                                  {paymentInfo.number}
                                </numero>{" "}
                              </name>
                              <br />
                              <strong>Nom du compte:</strong>
                              <br />
                              <name>{paymentInfo.name}</name>
                            </div>
                          </>
                        )}
                      </div>
                      {currentPage && currentPage === 3 && (
                        <div className="d-flex justify-content-center col-lg-6 col-sm-10 col-md-12 mb-2 w-100 pl-0 pr-0">
                          <div
                            style={{ borderRadius: "15px" }}
                            className="form-group mt-3 bg-secondary p-3"
                          >
                            <label
                              data-toggle="tooltip"
                              title=""
                              data-original-title="le numéro de l'expéditeur"
                              className="text-light"
                            >
                              <center>
                                <small>
                                Veuillez indiquer le numéro avec lequel vous avez effectué le transfert d'argent!
                                </small>
                              </center>
                              <span className="hidden-xs">
                                <small className="text-danger">NB:</small>{" "}
                                <small className="text-light">
                                  Sorato eto iLay numero nandefa ilay vola !
                                </small>
                              </span>
                            </label>
                            <input
                              type="tel"
                              required="ON" 
                              maxLength={10} // Set maxLength to 10 to limit input to 10 characters
                              pattern="[0-9]*" // Allow only numeric characters
                              className="form-control pl-3"
                              placeholder="Entrer le numéro de l'expéditeur"
                              style={{
                                border: error ? "1px solid red" : "",
                                borderRadius: "15px",
                              }}
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      <div className="d-flex justify-content-between col-lg-6 col-sm-12 col-md-12">
                        {currentPage && currentPage === 1 && (
                          <button
                            style={{ borderRadius: "30px" }}
                            className="btn btn-success btn-block btn-sm mt-0"
                            onClick={(e) => setCurrentPage(2)}
                          >
                            Continuer
                          </button>
                        )}
                        {currentPage && currentPage === 2 && (
                          <>
                            <button
                              style={{ borderRadius: "30px" }}
                              className="btn btn-outline-default btn-block btn-sm mr-2"
                              onClick={(e) => setCurrentPage(1)}
                            >
                              Retour
                            </button>
                            <button
                            type="button"
                              style={{ borderRadius: "30px" }}
                              className="btn btn-success btn-block btn-sm mt-0"
                              onClick={(e) => verifyPayment(paymentInfo, amount, setCurrentPage)}
                            >
                              Je l'ai envoyé
                            </button>
                          </>
                        )}
                        {currentPage && currentPage === 3 && (
                          <>
                            <button
                            type="button"
                              style={{ borderRadius: "30px" }}
                              className="btn btn-outline-default btn-block btn-sm mr-2"
                              onClick={(e) => setCurrentPage(2)}
                            >
                              Retour
                            </button>
                            <button
                              type="submit"
                              style={{ borderRadius: "30px" }}
                              className="btn btn-success btn-block btn-sm mt-0"
                            >
                              Confirmer
                            </button>
                          </>
                        )}
                      </div>
                      {error && (
                        <p className="alert alert-danger mt-3">{error}</p>
                      )}
                    </center>
                  </div>
                </div>
              </form>
              {/* end payment form */}
            </div>
          </div>
        </div>
      ) : (
        <NotLogedIn />
      )}
    </div>
  );
};

export default PaymentPage;
