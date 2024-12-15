import React from "react";
import { useLocation } from "wouter";
import { useSelector } from "react-redux";


const formatDateTime = (isoString) => {
  const date = new Date(isoString);

  // Format the date as 'DD-MM-YYYY' and time as 'HH:MM:SS'
  const formattedDate = date.toLocaleDateString('en-GB'); // 'en-GB' gives DD/MM/YYYY
  const formattedTime = date.toLocaleTimeString('en-GB', { hour12: false }); // 24-hour time format

  // Replace '/' with '-' in the date format
  return `${formattedDate.replace(/\//g, '-')} \u00A0 ${formattedTime}`;
};

const PaymentRecoveryPage = () => {
  const [ , setLocation] = useLocation("");
  const payments = useSelector((state) => state.payments);
  const plans = useSelector((state) => state.plans);
  const unpaidbill = payments.filter((payment) => payment.status === "refused" || payment.status === "redone")[0];
  const plan = plans.filter((plan) => plan.planName === unpaidbill.reason)[0];

  return (
    <div className="container receipt-container">
      <div
        className="row d-flex justify-content-center"
        style={{ marginTop: "70px", marginBottom: "100px" }}
      >
        <div className="receipt col mt-5 m-3 p-3">
          <div className="receipt-tittle text-center font-weight-light mt-4">
            {unpaidbill && unpaidbill.status === "refused" ? "Paiement refusé" : null}
            {unpaidbill && unpaidbill.status === "redone" ? "Traitement en cours" : null}
          </div>
          <div className="receipt-exp font-weight-light">
            Exp: {unpaidbill && unpaidbill.phoneNumber} || {unpaidbill && unpaidbill.type}<br /> 
            Date: {unpaidbill && formatDateTime(unpaidbill.created_at)} <br />
            Réf: {unpaidbill && unpaidbill.ref} 
          </div>
          <div className="receipt-th d-flex justify-content-between w-100">
            <div class="align-items-start">1 x {unpaidbill && unpaidbill.reason}</div>
            <div class="align-items-end">{unpaidbill && unpaidbill.amount}.00 Ar</div>
          </div>
          <div className="receipt-th2 d-flex justify-content-between w-100">
            <div class="align-items-start">TVA</div>
            <div class="align-items-end">00 Ar</div>
          </div>
          <div className="receipt-amount d-flex justify-content-between w-100">
            <div class="align-items-start">TOTAL:</div>
            <div class="align-items-end">{unpaidbill && unpaidbill.amount}.00 Ar</div>
          </div>
          <div className="receipt-message w-100">
            {unpaidbill && unpaidbill.status === "refused" ? "N'hésitez pas à nous contacter si vous souhaitez obtenir plus d'informations." : null}
            {unpaidbill && unpaidbill.status === "redone" ? "Veuillez patienter, notre équipe est en train de confirmer de votre paiement." : null}
          </div>
          <div className="receipt-footer d-flex justify-content-between mb-3">
            <button className="btn btn-success" type="button" onClick={() => setLocation(`/payment/${encodeURIComponent(JSON.stringify(plan))}/recovery`)} disabled={unpaidbill && unpaidbill.status === "redone"}>
              {unpaidbill && unpaidbill.status === "refused" ? "Payer" : null}
              {unpaidbill && unpaidbill.status === "redone" ? "En attente" : null}
            </button>
            <button className="btn btn-default border" type="button" onClick={() => window.history.back()}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRecoveryPage;
