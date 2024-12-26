import { useState } from "react";
import { useLocation } from "wouter";
import { MdArrowBackIos, MdOutlineLiving } from "react-icons/md";
import { useSelector } from "react-redux";
import { GiWell, GiCheckMark, GiCircle, GiBrickWall, GiSmokeBomb } from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle } from "react-icons/tb";
import {
  FaCar,
  FaMotorcycle,
  FaWifi,
  FaParking,
  FaShieldAlt,
  FaPhoneAlt,
  FaSwimmingPool,
} from "react-icons/fa";
import {
  FaPlugCircleBolt,
  FaPlugCircleCheck,
  FaOilWell,
  FaKitchenSet,
  FaFaucetDrip,
} from "react-icons/fa6";
import { useRoute } from "wouter";
import CarouselDetails from "../components/CarouselDetails";
import CardDetails from "../components/CardDetails";
import PhotoGallery from "../components/PhotoGallery";

import { useLogin } from "../hooks/useLogin";
import { useSubscription } from "../hooks/useSubscription";
import { usePopup } from "../hooks/usePopup";

import "../components/css/sweetalert.css";
import PropertyLocationDisplayer from "../components/PropertyLocationDisplayer";

//redux data

const PropertyDetailsPage = () => {
  const [, setLocation] = useLocation();
  const user = useSelector((state) => state.user);
  const timer = useSelector((state) => state.timer.timer);
  const loader = useSelector((state) => state.loader);

  const payments = useSelector((state) => state.payments);
  const [oneTimeTask, setOneTimeTask] = useState(null);
  const [propertyPreview, setPropertyPreview] = useState(null);

  if (oneTimeTask === null) {
    // scroll to top of the page
    window.scrollTo(0, 0);
    setOneTimeTask("done");
  }

  const [match, params] = useRoute(
    "/property-details/:propertyId/:propertyData"
  );
  const propertyData = match ? params.propertyData : null;
  const propertyId = match ? params.propertyId : null;

  const fetchProperty = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/properties/${propertyId}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "aplication/json",
          },
        }
      );
      const json = await response.json();

      if (response.ok) {
        setPropertyPreview(json);
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
    }
  };

  if (propertyData !== "preview" && !loader) {
    setLocation("/loader")
  }

  if (!propertyPreview && propertyData === "preview") {
    console.log(propertyId);
    fetchProperty();
  }

  const propertiesDetails =
    propertyData !== "preview"
      ? JSON.parse(decodeURIComponent(propertyData))
      : propertyPreview;

  const { notLogedPopUp } = useLogin();
  const { notSubscribedPopup } = useSubscription();
  const { unpaidBillPopup } = usePopup();

  const copyToClipboard = () => {
    // Get the current URL
    const currentPath = window.location.href;
    const serverUrl = currentPath.split("/#/")[0]; // This will split at the "#/" and take the second part
    const currentUrl = `${serverUrl}/#/property-details/${propertiesDetails._id}/preview`;

    // Create a textarea element to hold the URL temporarily
    const textarea = document.createElement("textarea");
    textarea.value = currentUrl;
    document.body.appendChild(textarea);

    // Select the text in the textarea
    textarea.select();

    // Copy the selected text to clipboard
    document.execCommand("copy");

    // Remove the textarea from the DOM
    document.body.removeChild(textarea);

    // Show the popup
    alert("Vous venez de copier le lien vers cette annonce! Vous pouvez maintenant le coller où vous voulez.");
  };

  const GenerateCheckbox = ({ state, label, icon, onClickFunction }) => {
    return (
      <div
        style={{ borderRadius: "15px", cursor: "pointer" }}
        className={`btn-group w-100 border py-1 border-dark px-2 mx-2 my-1 ${state ? "bg-secondary" : "bg-light"
          }`}
        role="group"
        onClick={onClickFunction}
      >
        {state && <span className="text-light">{icon}</span>}
        <div className="form-check pl-0" style={{ cursor: "pointer" }}>
          <label
            className="form-check-label"
            htmlFor={state}
            style={{ cursor: "pointer" }}
          >
            {!state && icon}
            {!state && (
              <sub>
                <GiCircle />
              </sub>
            )}{" "}
            {state && (
              <sub>
                {" "}
                <GiCheckMark className="text-success" />
              </sub>
            )}{" "}
            <feature className={`${state ? "text-white" : ""}`}>
              {label}
            </feature>
          </label>
        </div>
      </div>
    );
  };

  const handleGoBack = () => {
    propertyData !== "preview" ? window.history.back() : setLocation("/explore");
  };
  const handleShowContact = () => {
    if (user) {
      if (!timer && !user.leftTime && propertiesDetails.owner._id !== user._id) {
        notSubscribedPopup();
      }
      if (payments.filter((payment) => (payment.status === "refused" || payment.status === "redone")).length > 0) {
        unpaidBillPopup();
      }
    } else {
      notLogedPopUp();
    }

  };

  let position;

  if ((propertyData !== "preview" || propertyPreview) && !(propertyData !== "preview" && !loader)) {
    position = propertiesDetails.coords
      ? propertiesDetails.coords
      : propertiesDetails.city.coords
        ? propertiesDetails.city.coords
        : {
          lat: -18.905195365917766,
          lng: 47.52370521426201,
        };
  }

  return (
    <div>
      {(propertyData !== "preview" || propertyPreview) && !(propertyData !== "preview" && !loader) && (
        <>
          <CarouselDetails
            handleShowContact={handleShowContact}
            property={propertiesDetails}
          />
          <div className="site-section site-section-sm">
            <div className="container pb-5">
              <div className="row">
                <div className="col-lg-12 pb-3">
                  <div className="bg-white widget mt-3 p-3 mb-0 rounded">
                    <div
                      style={{ cursor: "pointer" }}
                      className="d-flex justify-content-between"
                    >
                      <h3 className="h4 text-black widget-title">
                        {propertiesDetails && propertiesDetails.title}
                      </h3>
                      <div
                        onClick={copyToClipboard}
                        style={{ height: "0px", overflow: "visible" }}
                        title="copied"
                        className="share-button d-flex flex-column share-btn align-self-start align-items-center"
                      >
                        <img
                          src="images/share-button.png"
                          alt="share-btn"
                          style={{ height: "25px" }}
                        />
                        <> Partager</>
                      </div>
                    </div>
                    <div
                      style={{ whiteSpace: "break-spaces", wordBreak: "break-word" }}
                      className="font-weight-normal"
                    >
                      {propertiesDetails && propertiesDetails.description}
                    </div>
                    <p className="ml-3 mt-3 mb-0">
                      {propertiesDetails.features.motoAccess && (
                        <h6 className="mb-0">
                          <FaMotorcycle className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Accès pour moto disponible</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.carAccess && (
                        <h6 className="mb-0">
                          <FaCar className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Accès pour voiture disponible</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.wifiAvailability && (
                        <h6 className="mb-0">
                          <FaWifi className="text-success h5 mr-1" />

                          <feature className="font-weight-normal">Disponibilité de la connexion Wi-Fi</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.parkingSpaceAvailable && (
                        <h6 className="mb-0">
                          <FaParking className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Espace de stationnement disponible</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.waterPumpSupplyJirama && (
                        <h6 className="mb-0">
                          <FaFaucetDrip className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Robinet d'eau de la JI.RA.MA</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.waterPumpSupply && (
                        <h6 className="mb-0">
                          <FaOilWell className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Pompe à eau privee</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.waterWellSupply && (
                        <h6 className="mb-0">
                          <GiWell className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Approvisionnement en puits d'eau</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.electricityPower && (
                        <h6 className="mb-0">
                          <FaPlugCircleCheck className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Alimentation en électricité privee</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.electricityJirama && (
                        <h6 className="mb-0">
                          <FaPlugCircleBolt className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Électricité fournie par la JI.RA.MA</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.surroundedByWalls && (
                        <h6 className="mb-0">
                          <GiBrickWall className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Propriété entourée de murs</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.securitySystem && (
                        <h6 className="mb-0">
                          <FaShieldAlt className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Domaine sécurisé</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.kitchenFacilities && (
                        <h6 className="mb-0">
                          <FaKitchenSet className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Équipements de cuisine disponibles</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.terrace && (
                        <h6 className="mb-0">
                          <TbBuildingCastle className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Avec terrasse disponible.</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.swimmingPool && (
                        <h6 className="mb-0">
                          <FaSwimmingPool className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Avec piscine.</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.airConditionerAvailable && (
                        <h6 className="mb-0">
                          <TbAirConditioning className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Climatisation disponible</feature>
                        </h6>
                      )}
                      {propertiesDetails.features.smokeDetectorsAvailable && (
                        <h6 className="mb-0">
                          <GiSmokeBomb className="text-success h5 mr-1" />
                          <feature className="font-weight-normal">Détecteurs de fumée disponibles</feature>
                        </h6>
                      )}

                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<MdOutlineLiving />}
                          state={propertiesDetails.features.furnishedProperty}
                          label={"Logement Meublé"}
                          onClickFunction={() => {}}
                        />
                      </div>
                    </p>
                  </div>
                  <CardDetails property={propertiesDetails} />
                  <PhotoGallery images={propertiesDetails.images} />
                </div>
              </div>
              <PropertyLocationDisplayer
                position={position}
                circle={propertiesDetails.coords ? false : true}
              />
            </div>
          </div>
          {/* details navbar */}
          <div class="fixed-bottom bg-white">
            <nav className="d-flex justify-content-between navbar navbar-expand-lg navbar-light">
              <button
                onClick={handleGoBack}
                style={{ fontSize: "15px" }}
                className="text-capitalize font-weight-light btn btn-outline-dark border-0"
              >
                <MdArrowBackIos
                  style={{ fontSize: "15px", marginBottom: "3px" }}
                />
                {propertyData !== "preview" ? "Retour" : "Accueil"}
              </button>

              <button
                onClick={handleShowContact}
                className="btn btn-success text-white font-weight-bold my-2 my-sm-0"
                style={{ padding: "1.5vh", borderRadius: "10px" }}
                type="submit"
              >
                <FaPhoneAlt className="mr-2 mb-1" />
                {user && user
                  ? propertiesDetails.owner._id === user._id
                    ? propertiesDetails.phone1
                    : !user || !timer || user.leftTime
                      ? "Voir contact"
                      : propertiesDetails.phone1
                  : "Voir contact"}
              </button>
            </nav>
          </div>
          {/* details navbar */}
        </>
      )}
      {(!(propertyData !== "preview" || propertyPreview) || (propertyData !== "preview" && !loader)) && (
        <div>
          <div className="logo-loader"></div>
          <div className="page-loader"></div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
