import React, { useState } from "react";
import { useLocation } from "wouter";
import { MdArrowBackIos, MdOutlineLiving } from "react-icons/md";
import { useSelector } from "react-redux";
import { GiWell, GiCheckMark, GiCircle, GiBrickWall, GiSmokeBomb } from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle } from "react-icons/tb";
import { HashLoader } from "react-spinners";
import Linkify from "linkify-react";
import {
  FaCar,
  FaMotorcycle,
  FaWifi,
  FaParking,
  FaShieldAlt,
  FaPhoneAlt,
  FaSwimmingPool,
  FaHotTub,
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
  const [location, setLocation] = useLocation();
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
    "/property-details/:propertyId/:propertyData/:prevPath"
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
    const currentUrl = `${process.env.REACT_APP_API_URL}/api/preview/${propertiesDetails._id}`;

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

  const GenerateFeaturebox = ({ icon, label }) => {
    return (
      <h6 className="mb-0">
        {icon && React.isValidElement(icon) ? ( // Check if icon prop is a valid React element
          React.cloneElement(icon, { className: `h6 mr-1 mt-1 ${icon.props.className || ''}` }) // Clone and add/merge classes
        ) : null}
        <span className="font-weight-light">{label}</span>
      </h6>
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

  const options = {
    target: '_blank',
    rel: 'noopener noreferrer'
  };

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
                      <Linkify options={options}>
                        {propertiesDetails && propertiesDetails.description}
                      </Linkify>
                    </div>
                    <p className="mt-3 mb-0">
                      {propertiesDetails.features.motoAccess && (
                        <GenerateFeaturebox
                          icon={<FaMotorcycle />}
                          label={"Accès pour moto"}
                        />
                      )}
                      {propertiesDetails.features.carAccess && (
                        <GenerateFeaturebox
                          icon={<FaCar />}
                          label={"Accès pour voiture"}
                        />
                      )}
                      {propertiesDetails.features.wifiAvailability && (
                        <GenerateFeaturebox
                          icon={<FaWifi />}
                          label={"De la connexion Wi-Fi"}
                        />
                      )}
                      {propertiesDetails.features.parkingSpaceAvailable && (
                        <GenerateFeaturebox
                          icon={<FaParking />}
                          label={"Espace de stationnement"}
                        />
                      )}
                      {propertiesDetails.features.waterPumpSupplyJirama && (
                        <GenerateFeaturebox
                          icon={<FaFaucetDrip />}
                          label={"Robinet d'eau de la JI.RA.MA"}
                        />
                      )}
                      {propertiesDetails.features.waterPumpSupply && (
                        <GenerateFeaturebox
                          icon={<FaOilWell />}
                          label={"Pompe à eau privee"}
                        />
                      )}
                      {propertiesDetails.features.waterWellSupply && (
                        <GenerateFeaturebox
                          icon={<GiWell />}
                          label={"Un puits d'eau"}
                        />
                      )}
                      {propertiesDetails.features.electricityPower && (
                        <GenerateFeaturebox
                          icon={<FaPlugCircleCheck />}
                          label={"Alimentation en électricité privee"}
                        />
                      )}
                      {propertiesDetails.features.electricityJirama && (
                        <GenerateFeaturebox
                          icon={<FaPlugCircleBolt />}
                          label={"Électricité fournie par la JI.RA.MA"}
                        />
                      )}
                      {propertiesDetails.features.surroundedByWalls && (
                        <GenerateFeaturebox
                          icon={<GiBrickWall />}
                          label={"Propriété entourée de murs"}
                        />
                      )}
                      {propertiesDetails.features.securitySystem && (
                        <GenerateFeaturebox
                          icon={<FaShieldAlt />}
                          label={"Domaine sécurisé"}
                        />
                      )}
                      {propertiesDetails.features.kitchenFacilities && (
                        <GenerateFeaturebox
                          icon={<FaKitchenSet />}
                          label={"Cuisine déjà équipée"}
                        />
                      )}
                      {propertiesDetails.features.terrace && (
                        <GenerateFeaturebox
                          icon={<TbBuildingCastle />}
                          label={"Avec terrasse disponible."}
                        />
                      )}
                      {propertiesDetails.features.swimmingPool && (
                        <GenerateFeaturebox
                          icon={<FaSwimmingPool />}
                          label={"Avec piscine."}
                        />
                      )}
                      {propertiesDetails.features.hotWaterAvailable && (
                        <GenerateFeaturebox
                          icon={<FaHotTub />}
                          label={"Eau chaude disponible"}
                        />
                      )}
                      {propertiesDetails.features.airConditionerAvailable && (
                        <GenerateFeaturebox
                          icon={<TbAirConditioning />}
                          label={"Climatisation disponible"}
                        />
                      )}
                      {propertiesDetails.features.smokeDetectorsAvailable && (
                        <GenerateFeaturebox
                          icon={<GiSmokeBomb />}
                          label={"Détecteurs de fumée"}
                        />
                      )}
                      {propertiesDetails.features.furnishedProperty && (
                        <GenerateFeaturebox
                          icon={<MdOutlineLiving />}
                          label={"Logement Meublé"}
                        />
                      )}
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
          <div className="page-loader mt-2"></div>
          <div className="spinner-loader mt-5">
            <div className="d-flex justify-content-center align-items-center">
              <small className="mr-2" style={{ color: "#c59d45" }}>
                Chargement
              </small>{" "}
              <HashLoader color="#c59d45" size={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
