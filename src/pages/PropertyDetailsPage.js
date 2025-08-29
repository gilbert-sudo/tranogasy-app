import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useSelector } from "react-redux";
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
  FaBed,
} from "react-icons/fa";
import {
  FaPlugCircleBolt,
  FaPlugCircleCheck,
  FaOilWell,
  FaKitchenSet,
  FaFaucetDrip,
} from "react-icons/fa6";
import { MdArrowBackIos, MdOutlineLiving, MdBalcony, MdLandscape } from "react-icons/md";
import {
  GiWell,
  GiBrickWall,
  GiFireplace, GiBathtub, GiSolarPower, GiMountainCave, GiSeatedMouse, GiSeaDragon, GiCastle
} from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle, TbWash } from "react-icons/tb";
import { IoMdShareAlt } from "react-icons/io";

import { useRoute } from "wouter";
import CarouselDetails from "../components/CarouselDetails";
import CardDetails from "../components/CardDetails";
import PhotoGallery from "../components/PhotoGallery";

import { useLogin } from "../hooks/useLogin";
import { useProperty } from "../hooks/useProperty";
import { useSubscription } from "../hooks/useSubscription";
import { usePopup } from "../hooks/usePopup";

import "../components/css/sweetalert.css";
import PropertyLocationDisplayer from "../components/PropertyLocationDisplayer";

//redux data

const PropertyDetailsPage = ({ fastPreviewProperty, handleCloseSlideClick }) => {

  const [location, setLocation] = useLocation();
  const myRef = useRef(null);
  const { shareProperty } = useProperty();

  const user = useSelector((state) => state.user);
  const timer = useSelector((state) => state.timer.timer);
  const loader = useSelector((state) => state.loader);

  const payments = useSelector((state) => state.payments);
  const [oneTimeTask, setOneTimeTask] = useState(null);
  const [propertyPreview, setPropertyPreview] = useState(null);


  const [match, params] = useRoute(
    "/property-details/:propertyId/:propertyData/:prevPath"
  );
  const propertyData = match ? params.propertyData : null;
  const propertyId = match ? params.propertyId : null;

  useEffect(() => {
    if (!oneTimeTask && myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth" });
      setOneTimeTask(true);
    }
  }, [oneTimeTask]);


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
        localStorage.setItem(
          "propertyPreview",
          JSON.stringify(json)
        );
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("propertyPreview");
      setPropertyPreview(null);
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

  let propertiesDetails;

  propertiesDetails =
    (propertyData !== "preview"
      ? JSON.parse(decodeURIComponent(propertyData))
      : propertyPreview) ||
    fastPreviewProperty;


  const { notLogedPopUp } = useLogin();
  const { notSubscribedPopup } = useSubscription();
  const { unpaidBillPopup } = usePopup();

  const GenerateFeaturebox = ({ icon, label }) => {
    return (
      <div
        style={{ borderRadius: "20px", padding: "10px", cursor: "pointer", border: "1px solid #ccc" }}
        className={`btn-group bg-light`}
        role="group"
      >
        <div className="form-check pl-0" style={{ cursor: "pointer" }}>
          <label
            className="form-check-label"
            htmlFor={label}
            style={{ cursor: "pointer" }}
          >
            {icon && icon}
            {" "}
            <small>
              {label}
            </small>
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

  const options = {
    target: '_blank',
    rel: 'noopener noreferrer'
  };
 
  console.log(propertiesDetails);
  

  return (
    <div
      style={{
        zIndex: 2000,
      }}
      ref={myRef}
    >
      {(propertyData !== "preview" || propertyPreview) && !(propertyData !== "preview" && !loader) && (
        <>
          <CarouselDetails
            handleShowContact={handleShowContact}
            property={propertiesDetails}
          />
          <div className="site-section site-section-sm">
            <div className={`container ${fastPreviewProperty ? "" : "pb-3"}`}>
              <div className="row">
                <div className="col-lg-12 pb-1 pt-4">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                      padding: "0 4px",
                      width: "100%",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "20px",            // Slightly bigger for mobile impact
                        fontWeight: "500",           // Medium, elegant weight
                        margin: 0,
                        color: "#222",               // Slightly darker for better contrast
                        flex: 1,
                        lineHeight: "1.3",
                        letterSpacing: "0.3px",     // Subtle spacing to breathe
                        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {propertiesDetails && propertiesDetails.title}
                    </h4>


                    <button
                      onClick={() => shareProperty(propertiesDetails)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "6px 10px",
                        border: "1px solid #ddd",
                        borderRadius: "20px",
                        backgroundColor: "transparent",
                        color: "#333",
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      title="Partager"
                    >
                      <IoMdShareAlt style={{ fontSize: "16px" }} />
                      Partager
                    </button>
                  </div>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      padding: "16px",
                      marginBottom: "5px",
                      color: "#333",
                      backgroundColor: "transparent",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      whiteSpace: "break-spaces",
                      wordBreak: "break-word",
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    <Linkify options={options}>
                      {propertiesDetails && propertiesDetails.description}
                    </Linkify>
                  </div>
                  <div
                    className="d-flex flex-wrap p-3"
                    style={{
                      gap: "4px",
                      marginBottom: "12px",
                    }}
                  >
                    {/* ⚡ Eau & électricité */}
                    {propertiesDetails.features?.electricityJirama && <GenerateFeaturebox icon={<FaPlugCircleBolt />} label={"Électricité JIRAMA"} />}
                    {propertiesDetails.features?.waterPumpSupplyJirama && <GenerateFeaturebox icon={<FaFaucetDrip />} label={"Pompe JIRAMA"} />}
                    {propertiesDetails.features?.waterWellSupply && <GenerateFeaturebox icon={<GiWell />} label={"Puits d'eau"} />}
                    {propertiesDetails.features?.electricityPower && <GenerateFeaturebox icon={<FaPlugCircleCheck />} label={"Électricité privée"} />}
                    {propertiesDetails.features?.waterPumpSupply && <GenerateFeaturebox icon={<FaOilWell />} label={"Pompe à eau privée"} />}
                    {propertiesDetails.features?.solarPanels && <GenerateFeaturebox icon={<GiSolarPower />} label={"Panneaux solaires"} />}
                    {/* 🚪 Accessibilité & extérieur */}
                    {propertiesDetails.features?.motoAccess && <GenerateFeaturebox icon={<FaMotorcycle />} label={"Accès moto"} />}
                    {propertiesDetails.features?.carAccess && <GenerateFeaturebox icon={<FaCar />} label={"Accès voiture"} />}
                    {propertiesDetails.features?.surroundedByWalls && <GenerateFeaturebox icon={<GiBrickWall />} label={"Clôturée"} />}
                    {propertiesDetails.features?.courtyard && <GenerateFeaturebox icon={<MdLandscape />} label={"Cour"} />}
                    {propertiesDetails.features?.parkingSpaceAvailable && <GenerateFeaturebox icon={<FaParking />} label={"Parking"} />}
                    {propertiesDetails.features?.garage && <GenerateFeaturebox icon={<FaCar />} label={"Garage"} />}
                    {propertiesDetails.features?.garden && <GenerateFeaturebox icon={<GiWell />} label={"Jardin"} />}
                    {propertiesDetails.features?.independentHouse && <GenerateFeaturebox icon={<TbBuildingCastle />} label={"Indépendante"} />}
                    {propertiesDetails.features?.guardianHouse && <GenerateFeaturebox icon={<FaShieldAlt />} label={"Maison pour gardien"} />}
                    {propertiesDetails.features?.bassin && <GenerateFeaturebox icon={<TbWash />} label={"Bassin"} />}
                    {/* 🏠 Confort intérieur */}
                    {propertiesDetails.features?.kitchenFacilities && <GenerateFeaturebox icon={<FaKitchenSet />} label={"Cuisine équipée"} />}
                    {propertiesDetails.features?.placardKitchen && <GenerateFeaturebox icon={<FaBed />} label={"Cuisine placardée"} />}
                    {propertiesDetails.features?.hotWaterAvailable && <GenerateFeaturebox icon={<FaHotTub />} label={"Eau chaude"} />}
                    {propertiesDetails.features?.furnishedProperty && <GenerateFeaturebox icon={<MdOutlineLiving />} label={"Meublé"} />}
                    {propertiesDetails.features?.airConditionerAvailable && <GenerateFeaturebox icon={<TbAirConditioning />} label={"Climatisation"} />}
                    {propertiesDetails.features?.bathtub && <GenerateFeaturebox icon={<GiBathtub />} label={"Baignoire"} />}
                    {propertiesDetails.features?.fireplace && <GenerateFeaturebox icon={<GiFireplace />} label={"Cheminée"} />}
                    {propertiesDetails.features?.elevator && <GenerateFeaturebox icon={<TbBuildingCastle />} label={"Ascenseur"} />}
                    {/* 🌇 Espaces extérieurs confort */}
                    {propertiesDetails.features?.balcony && <GenerateFeaturebox icon={<MdBalcony />} label={"Balcon"} />}
                    {propertiesDetails.features?.roofTop && <GenerateFeaturebox icon={<GiCastle />} label={"Toit terrasse"} />}
                    {propertiesDetails.features?.swimmingPool && <GenerateFeaturebox icon={<FaSwimmingPool />} label={"Piscine"} />}
                    {/* 🛡️ Sécurité */}
                    {propertiesDetails.features?.securitySystem && <GenerateFeaturebox icon={<FaShieldAlt />} label={"Système de sécurité"} />}
                    {/* 🌐 Connectivité */}
                    {propertiesDetails.features?.wifiAvailability && <GenerateFeaturebox icon={<FaWifi />} label={"Wi-Fi"} />}
                    {propertiesDetails.features?.fiberOpticReady && <GenerateFeaturebox icon={<FaWifi />} label={"Fibre optique"} />}
                    {/* 🌅 Vue */}
                    {propertiesDetails.features?.seaView && <GenerateFeaturebox icon={<GiSeaDragon />} label={"Vue mer"} />}
                    {propertiesDetails.features?.mountainView && <GenerateFeaturebox icon={<GiMountainCave />} label={"Vue montagne"} />}
                    {propertiesDetails.features?.panoramicView && <GenerateFeaturebox icon={<GiSeatedMouse />} label={"Vue panoramique"} />}
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
          <div class="bg-white"
            style={{
              position: "sticky",
              bottom: 0,
              width: "100%",
              zIndex: 100000,
              borderTop: "1px solid #eee",
            }}
          >
            <nav className="d-flex justify-content-between navbar navbar-expand-lg navbar-light">
              <button
                onClick={fastPreviewProperty ? () => handleCloseSlideClick() : handleGoBack}
                style={{ fontSize: "15px" }}
                className="text-capitalize font-weight-light btn btn-outline-dark border-0"
              >
                <MdArrowBackIos
                  style={{ fontSize: "15px", marginBottom: "3px" }}
                />
                {fastPreviewProperty ? "Fermer" : (propertyData !== "preview" ? "Retour" : "Accueil")}
              </button>

              <button
                onClick={handleShowContact}
                className="btn btn-success text-white font-weight-bold my-2 my-sm-0"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  color: "#fff",
                }}
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
