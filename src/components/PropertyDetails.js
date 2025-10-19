import { Link, useLocation } from "wouter";
import { useSelector } from "react-redux";
import { useLike } from "../hooks/useLike";
import { useLogin } from "../hooks/useLogin";
import { useProperty } from "../hooks/useProperty";
import { useEffect, useState } from "react";
import MiniCarousel from "../components/MiniCarousel";

import { FaHeart, FaRegEdit } from "react-icons/fa";
import { BsHeartFill, BsTrash3Fill } from "react-icons/bs";
import { ImLocation } from "react-icons/im";
import { MdOutlineLiving, MdBalcony, MdLandscape, MdOutlineFiberSmartRecord } from "react-icons/md";
import {
  GiWell,
  GiBrickWall,
  GiFireplace, GiBathtub, GiSolarPower, GiMountainCave, GiSeatedMouse, GiSeaDragon, GiCastle
} from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle, TbWash } from "react-icons/tb";
import {
  FaCar,
  FaMotorcycle,
  FaWifi,
  FaParking,
  FaShieldAlt,
  FaSwimmingPool,
  FaHotTub,
  FaBed,
} from "react-icons/fa";
import {
  FaFaucetDrip,
  FaPlugCircleBolt,
  FaPlugCircleCheck,
  FaOilWell,
  FaKitchenSet,
} from "react-icons/fa6";
import { Phone } from "lucide-react";

import useSound from "use-sound";
import userProfile from "../img/user-avatar.png";

const formatPhone = (phone) => {
  if (!phone) return null;

  // Remove all non-digit characters except plus at the beginning
  let digits = phone.replace(/\D/g, "");

  // Check if the original had a plus to preserve it
  const hadPlus = phone.trim().startsWith('+');

  // Handle different input formats
  if (digits.startsWith("0")) {
    digits = "261" + digits.substring(1);
  } else if (digits.startsWith("261")) {
    // Already in correct format
    digits = digits;
  } else if (!digits.startsWith("261") && digits.length === 9) {
    // Assume it's a local number without prefix
    digits = "261" + digits;
  } else if (digits.length === 12 && digits.startsWith("261")) {
    // Already in correct format without plus
    digits = digits;
  }

  // Add the plus sign if it was there originally or we're formatting an international number
  const shouldAddPlus = hadPlus || digits.length >= 9;
  const prefix = shouldAddPlus ? "+" : "";

  // Format with spaces for better readability
  if (digits.length === 12 && digits.startsWith("261")) {
    // Format: +261 XX XX XXX XX
    return `${prefix}${digits.substring(0, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 10)} ${digits.substring(10)}`;
  } else if (digits.length === 9) {
    // Format local numbers differently: XXX XX XXX XX
    return `${digits.substring(0, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 8)} ${digits.substring(8)}`;
  }

  // Fallback for other formats
  return prefix + digits;
};

function PropertyDetails({ property, route }) {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Indian/Antananarivo",
  }).format(new Date(property.created_at));

  const { like, disLike } = useLike();
  const { notLogedPopUp } = useLogin();
  const { deleteProperty } = useProperty();

  const [isliked, setIsliked] = useState(false);
  const [play] = useSound("sounds/Like Sound Effect.mp3");
  const [location, setLocation] = useLocation();
  //redux
  const user = useSelector((state) => state.user);

  //click the like button
  const handleLike = async (e) => {
    e.preventDefault();
    if (user) {
      play();
      setIsliked(true);
      like(property);
    }
    if (!user) {
      notLogedPopUp();
    }
  };
  //click the disLike button
  const handleDisLike = async (e) => {
    e.preventDefault();
    setIsliked(false);
    disLike(property);
  };

  //stringify the property data to pass it as parameter
  const propertyDataString = JSON.stringify(property);

  //check the like button state
  useEffect(() => {
    function loadingPage() {
      if (user && user?.favorites?.includes(property._id)) {
        setIsliked(true);
      } else {
        setIsliked(false);
      }
    }
    loadingPage();
  }, []);

  return (
    <div className="property-entry h-100 mx-1">
      <div
        className="property-thumbnail"
        onClick={() => {
          if (route !== "PropertyExistsCard") {
            setLocation(`/property-details/${property._id}/${encodeURIComponent(
              propertyDataString
            )}/${location.split("/")[1]}`);
          }
        }}
      >
        <div className="d-flex justify-content-end">
          <div className="offer-type-wrap">
            {property.type === "rent" ? (
              <span className="offer-type bg-success">Location</span>
            ) : (
              <span className="offer-type bg-danger">Vente</span>
            )}
          </div>
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              zIndex: 10,
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              alignItems: "center",
              padding: "3px 8px",
              fontWeight: "light",
              borderRadius: 10,
              color: "white"
            }}
          >
            <small>{formattedDate && formattedDate}</small>
          </div>

        </div>
        <MiniCarousel images={property.images} />
      </div>
      <div className="p-2 property-body">
        {user && (route === "MyHouseListingPage") && !user.banned &&
          (
            <div className="d-flex justify-content-end offer-type-wrap w-100 position-relative">
              <div className="d-flex position-absolute"
                style={{
                  bottom: "32px"
                }}
              >
                <button
                  type="button"
                  className="btn btn-light btn-sm mr-1"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation(`/update-property/${encodeURIComponent(propertyDataString)}`);
                  }}
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: "7px",
                    borderRadius: "50%",
                    zIndex: 2,
                  }}
                >
                  <FaRegEdit
                    style={{
                      fontWeight: 600
                    }}
                  />
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm mr-3"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteProperty(property);
                  }}
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: "7px",
                    borderRadius: "50%",
                    zIndex: 2,
                  }}
                >
                  <BsTrash3Fill />
                </button>
              </div>


            </div>
          )
        }
        {(route === "PropertyExistsCard") &&
          (
            <div className="d-flex justify-content-center offer-type-wrap w-100 position-relative" style={{ pointerEvents: "none" }}>
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  transform: "translate(0, -160%)",
                  marginRight: "20px",
                  minWidth: "100%",
                  fontWeight: 900,
                  alignItems: "center",
                  padding: "5px 12px",
                  border: "1px solid #dcdcdc", // Soft light grey border (lighter than original #eee)
                  borderRadius: "30px",
                  background: "rgba(243, 243, 243, 0.8)", // Light grey background (darker than original #fafafa)
                }}
              >
                <img
                  src={property.owner.avatar || userProfile}
                  alt={property.owner.username}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "12px",
                  }}
                />
                <div>
                  <p style={{ margin: 0, fontSize: "15px", color: "#222" }}>
                    {property.owner.username}
                  </p>
                  <small>
                    Propriétaire actuel
                  </small>
                  <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>
                    {/* Medium-dark grey secondary text */}
                    <Phone size={12} style={{ marginRight: "4px", color: "#d9534f" }} />
                    {formatPhone(property.phone1)}
                  </p>
                </div>
              </div>
            </div>
          )
        }
        {((route === "ExplorePage") || (route === "TranogasyList")) &&
          (
            isliked && isliked ? (
              <div
                className="property-favorite"
                style={{ background: "#f23a2e", zIndex: "1" }}
                onClick={handleDisLike}
              >
                <BsHeartFill className="text-white" />
              </div>
            ) : (
              <div
                className="property-favorite"
                style={{ zIndex: "2" }}
                onClick={handleLike}
              >
                <FaHeart />
              </div>
            )
          )
        }
        <div
          className="text text-dark"
          onClick={() => {
            if (route !== "PropertyExistsCard") {
              setLocation(`/property-details/${property._id}/${encodeURIComponent(
                propertyDataString
              )}/${location.split("/")[1]}`);
            }
          }}
        >
          <h4 className="ml-1 property-title">
            <label className="text-danger">#</label> {property.title}
          </h4>
          <p
            className="property-description"
            style={{ whiteSpace: "break-spaces", fontWeight: "400" }}
          >
            {property.description}
          </p>
          <span className="property-location d-block">
            <ImLocation className="ml-1 text-danger mb-1" />{" "}
            {property.city.fokontany} <small>{property.city.commune}</small>
          </span>
          <div className="d-flex justify-content-between align-items-center">
            <div className="mt-2 ml-2">
              {property.features.electricityJirama && <FaPlugCircleBolt className="h6 mr-1" />}
              {property.features.waterPumpSupplyJirama && <FaFaucetDrip className="h6 mr-1" />}
              {property.features.waterWellSupply && <GiWell className="h6 mr-1" />}
              {property.features.electricityPower && <FaPlugCircleCheck className="h6 mr-1" />}
              {property.features.waterPumpSupply && <FaOilWell className="h6 mr-1" />}
              {property.features.solarPanels && <GiSolarPower className="h6 mr-1" />}

              {property.features.motoAccess && <FaMotorcycle className="h6 mr-1" />}
              {property.features.carAccess && <FaCar className="h6 mr-1" />}
              {property.features.surroundedByWalls && <GiBrickWall className="h6 mr-1" />}
              {property.features.courtyard && <MdLandscape className="h6 mr-1" />}
              {property.features.parkingSpaceAvailable && <FaParking className="h6 mr-1" />}
              {property.features.garage && <FaCar className="h6 mr-1" />}
              {property.features.garden && <GiWell className="h6 mr-1" />}
              {property.features.independentHouse && <TbBuildingCastle className="h6 mr-1" />}
              {property.features.guardianHouse && <FaShieldAlt className="h6 mr-1" />}
              {property.features.bassin && <TbWash className="h6 mr-1" />}

              {property.features.kitchenFacilities && <FaKitchenSet className="h6 mr-1" />}
              {property.features.placardKitchen && <FaBed className="h6 mr-1" />}
              {property.features.hotWaterAvailable && <FaHotTub className="h6 mr-1" />}
              {property.features.furnishedProperty && <MdOutlineLiving className="h6 mr-1" />}
              {property.features.airConditionerAvailable && <TbAirConditioning className="h6 mr-1" />}
              {property.features.bathtub && <GiBathtub className="h6 mr-1" />}
              {property.features.fireplace && <GiFireplace className="h6 mr-1" />}
              {property.features.elevator && <TbBuildingCastle className="h6 mr-1" />}

              {property.features.balcony && <MdBalcony className="h6 mr-1" />}
              {property.features.roofTop && <GiCastle className="h6 mr-1" />}
              {property.features.swimmingPool && <FaSwimmingPool className="h6 mr-1" />}

              {property.features.securitySystem && <FaShieldAlt className="h6 mr-1" />}

              {property.features.wifiAvailability && <FaWifi className="h6 mr-1" />}
              {property.features.fiberOpticReady && <MdOutlineFiberSmartRecord className="h6 mr-1" />}

              {property.features.seaView && <GiSeaDragon className="h6 mr-1" />}
              {property.features.mountainView && <GiMountainCave className="h6 mr-1" />}
              {property.features.panoramicView && <GiSeatedMouse className="h6 mr-1" />}

            </div>
            <div className="mt-2 property-title">
              {property.type === "rent" ? (
                <small className="d-flex text-success justify-content-end">
                  <strong>{property.rent.toLocaleString("en-US")} <small>Ar/mois</small></strong>
                </small>
              ) : (
                <small className="d-flex text-danger justify-content-end">
                  <strong>{property.price.toLocaleString("en-US")} <small>Ar</small></strong>
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
