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

import useSound from "use-sound";

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
        {(route === "MyHouseListingPage") &&
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
        {!(route === "MyHouseListingPage") &&
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
        </Link>
      </div>
    </div>
  );
}

export default PropertyDetails;
