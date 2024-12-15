// FeatureUnderConstruction.js or WorkInProgressMessage.js
import React from "react";

const FeatureUnderConstruction = () => {
  return (
    <>
      <div className="container mt-5 justify-content-center align-items-center no-internet-connection">
        <center>
          <img
            className="img-fluid"
            style={{ maxHeight: "45vh", borderRadius: "15px" }}
            src="images/WorkingOn.jpg"
            alt="FeatureUnderConstruction"
          />
        </center>
        <center>
          {" "}
          <p style={{ fontWeight: "400" }}>
            Nos développeurs travaillent actuellement sur cette fonctionnalité,
            qui sera bientôt disponible. Nous nous excusons pour la gêne occasionnée et vous remercions de
            votre patience.
          </p>
        </center>
      </div>
    </>
  );
};

export default FeatureUnderConstruction;
