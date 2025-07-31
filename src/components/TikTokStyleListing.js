import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSelector } from "react-redux";

import TikTokDescription from "./TikTokDescription";

import { useScrollDirectionLock } from "../hooks/useScrollDirectionLock";
import { useProperty } from "../hooks/useProperty";
import { useLike } from "../hooks/useLike";
import { useLogin } from "../hooks/useLogin";
import { usePopup } from "../hooks/usePopup";
import useSound from "use-sound";

import {
  ChevronLeft,
  Heart,
  MapPinned,
  Phone,
  Forward,
  Plus,
  SendHorizontal
} from "lucide-react";

import { MdOutlineLiving, MdBalcony, MdLandscape } from "react-icons/md";
import {
  GiWell,
  GiBrickWall,
  GiFireplace, GiBathtub, GiSolarPower, GiMountainCave, GiSeatedMouse, GiSeaDragon, GiCastle
} from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle } from "react-icons/tb";
import { ImLocation } from "react-icons/im";
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

const TikTokStyleListing = ({ property }) => {

  const { handleTouchStart, handleTouchMove } = useScrollDirectionLock();
  const { shareProperty } = useProperty();
  const { featureUnderConstructionPopup } = usePopup();
  const [location, setLocation] = useLocation();
  const { like, disLike } = useLike();
  const { notLogedPopUp } = useLogin();
  const [play] = useSound("sounds/Like Sound Effect.mp3");
  const [isliked, setIsliked] = useState(false);
  const user = useSelector((state) => state.user);

  //stringify the property data to pass it as parameter
  const propertyDataString = JSON.stringify(property);


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
    <div
    className="tikTokStyleListing"
      style={{
        width: "100%",
        height: "100vh",
        maxWidth: "1025px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      {/* Image slider */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{
          display: "flex",
          overflowX: "scroll",
          width: "100%",
          height: "100%",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch", // smoother iOS scroll
          overscrollBehaviorX: "contain", // prevent bouncing scroll
          zIndex: 3,
        }}
      >
        {property.images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={`image-${index}`}
            loading="lazy" // This is the magic!
            style={{
              marginTop: img.height > img.width ? "0" : "-80px",
              flexShrink: 0,
              width: "100%",
              height: "100%",
              objectFit: img.height > img.width ? "cover" : "contain",
              scrollSnapAlign: "start",
              backgroundColor: "#000",
            }}
          />
        ))}
      </div>

      {/* Black gradient bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Back button */}
      <div
        onClick={() => window.history.back()}
        style={{
          position: "absolute",
          top: 50,
          left: 5,
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: 20,
        }}
      >
        <ChevronLeft
          style={{ width: 30, height: 30, color: "white", stroke: 3 }}
        />
      </div>

      {/* Vertical action buttons */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          right: 10,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          gap: 20,
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={property.owner.avatar}
            onClick={() => setLocation(`/userProfile/${property.owner._id}`)}
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: "2px solid white",
              pointerEvents: "auto"
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -5,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#FF2D55",
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus onClick={() => featureUnderConstructionPopup()} style={{ color: "white", width: 12, height: 12, pointerEvents: "auto" }} />
          </div>
        </div>
        {isliked && isliked ? (
          <Heart style={{ pointerEvents: "auto" }} size={30} color="white" fill="red" onClick={handleDisLike} />
        ) : (
          <Heart style={{ pointerEvents: "auto" }} size={30} color="white" fill="none" onClick={handleLike} />
        )}
        <MapPinned onClick={() => featureUnderConstructionPopup()} style={{ pointerEvents: "auto" }} size={30} color="white" />
        <Phone onClick={() => featureUnderConstructionPopup()} style={{ pointerEvents: "auto" }} size={30} color="white" />
        <Forward onClick={() => shareProperty(property)} style={{ pointerEvents: "auto" }} size={30} color="white" />
      </div>

      {/* Property infos */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 10,
          right: 100,
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <p style={{ fontWeight: "bold", fontSize: 16, pointerEvents: "auto", width: "max-content" }} onClick={() => setLocation(`/userProfile/${property.owner._id}`)}>
          @{property.owner.username}
        </p>
        <p
          style={{ fontSize: 14, pointerEvents: "auto", width: "max-content" }}
          onClick={() => setLocation(`/property-details/${property._id}/${encodeURIComponent(
            propertyDataString
          )}/${location.split("/")[1]}`)}
        >
          {property.title}
        </p>
        <small>
          {" "}
          <ImLocation className="text-danger mr-1 mb-2" />
          {property.city.fokontany} {property.city.commune}
        </small>
        <TikTokDescription description={property.description} />
        <p>
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
          {property.features.fiberOpticReady && <FaWifi className="h6 mr-1" />}

          {property.features.seaView && <GiSeaDragon className="h6 mr-1" />}
          {property.features.mountainView && <GiMountainCave className="h6 mr-1" />}
          {property.features.panoramicView && <GiSeatedMouse className="h6 mr-1" />}
          <br /><strong style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "30px", padding: "5px" }}>{property.rent && property.rent.toLocaleString("en-US")} <small>Ar / mois</small></strong>
        </p>
      </div>

      {/* Message input with send button */}
      <div
        style={{
          position: "absolute",
          bottom: 95,
          left: 10,
          right: 10,
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <input
            type="text"
            placeholder="Écrivez un message au propriétaire..."
            style={{
              width: "100%",
              padding: "10px 44px 10px 14px",
              borderRadius: 20,
              border: "none",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => {
              // Add send logic here
              featureUnderConstructionPopup();
            }}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              cursor: "pointer",
            }}
          >
            <SendHorizontal style={{ color: "#333", width: 20, height: 20 }} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default TikTokStyleListing;
