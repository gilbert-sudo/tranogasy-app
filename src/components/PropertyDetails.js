import { Link, useLocation } from "wouter";
import { FaHeart } from "react-icons/fa";
import { BsHeartFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useLike } from "../hooks/useLike";
import { useLogin } from "../hooks/useLogin";
import { useEffect, useState } from "react";
import MiniCarousel from "../components/MiniCarousel";
import { ImLocation } from "react-icons/im";
import { GiWell, GiBrickWall, GiSmokeBomb } from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle } from "react-icons/tb";
import { MdOutlineLiving } from "react-icons/md";
import {
  FaCar,
  FaMotorcycle,
  FaWifi,
  FaParking,
  FaShieldAlt,
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

import useSound from "use-sound";

function PropertyDetails({ property }) {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Indian/Antananarivo",
  }).format(new Date(property.created_at));

  const { like, disLike } = useLike();
  const { notLogedPopUp } = useLogin();
  const [isliked, setIsliked] = useState(false);
  const [play] = useSound("sounds/Like Sound Effect.mp3");
  const [location] = useLocation();
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
      <Link
        to={`/property-details/${property._id}/${encodeURIComponent(
          propertyDataString
        )}/${location.split("/")[1]}`}
        className="property-thumbnail"
      >
        <div className="d-flex justify-content-end">
          <div className="offer-type-wrap">
            {property.type === "rent" ? (
              <span className="offer-type bg-success">Location</span>
            ) : (
              <span className="offer-type bg-danger">Vente</span>
            )}
          </div>
          <div className="date-details-wrap text-light">
            {property.created_at && formattedDate}
          </div>
          <div className="quarter-details-wrap text-light">
            {property.city && property.city.district}
          </div>
        </div>
        <MiniCarousel images={property.images} />
      </Link>
      <div className="p-2 property-body">
        {isliked && isliked ? (
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
        )}
        <Link
          className="text text-dark"
          to={`/property-details/${property._id}/${encodeURIComponent(
            propertyDataString
          )}/${location.split("/")[1]}`}
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
              {" "}
              {property.features.motoAccess && (
                <FaMotorcycle className="h6 mr-1" />
              )}
              {property.features.carAccess && <FaCar className="h6 mr-1" />}
              {property.features.wifiAvailability && (
                <FaWifi className="h6 mr-1" />
              )}
              {property.features.parkingSpaceAvailable && (
                <FaParking className="h6 mr-1" />
              )}
              {property.features.waterPumpSupplyJirama && (
                <FaFaucetDrip className="h6 mr-1" />
              )}
              {property.features.waterPumpSupply && (
                <FaOilWell className="h6 mr-1" />
              )}
              {property.features.waterWellSupply && (
                <GiWell className="h6 mr-1" />
              )}
              {property.features.electricityPower && (
                <FaPlugCircleCheck className="h6 mr-1" />
              )}
              {property.features.electricityJirama && (
                <FaPlugCircleBolt className="h6 mr-1" />
              )}
              {property.features.surroundedByWalls && (
                <GiBrickWall className="h6 mr-1" />
              )}
              {property.features.securitySystem && (
                <FaShieldAlt className="h6 mr-1" />
              )}
              {property.features.kitchenFacilities && (
                <FaKitchenSet className="h6 mr-1" />
              )}
              {property.features.terrace && (
                <TbBuildingCastle className="h6 mr-1" />
              )}
              {property.features.swimmingPool && (
                <FaSwimmingPool className="h6 mr-1" />
              )}
              {property.features.furnishedProperty && (
                <MdOutlineLiving className="h6 mr-1" />
              )}
              {property.features.hotWaterAvailable && (
                <FaHotTub className="h6 mr-1" />
              )}
              {property.features.airConditionerAvailable && (
                <TbAirConditioning className="h6 mr-1" />
              )}
              {property.features.smokeDetectorsAvailable && (
                <GiSmokeBomb className="h6 mr-1" />
              )}
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
        </Link>
      </div>
    </div>
  );
}

export default PropertyDetails;
