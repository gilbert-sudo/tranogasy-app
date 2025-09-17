import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useSelector } from "react-redux";

import TikTokDescription from "./TikTokDescription";
import PropertyLocationDisplayer from "./PropertyLocationDisplayer";
import ContactCard from "./ContactCard";


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
  SendHorizontal,
  ChevronLeft as LeftArrow,
  ChevronRight as RightArrow
} from "lucide-react";

import { MdOutlineLiving, MdBalcony, MdLandscape, MdOutlineFiberSmartRecord } from "react-icons/md";
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
import { IoMdCloseCircle } from "react-icons/io";

import userProfile from "../img/user-avatar.png";

const TikTokStyleListing = ({ property, active }) => {

  const { handleTouchStart, handleTouchMove } = useScrollDirectionLock();
  const { shareProperty } = useProperty();
  const { featureUnderConstructionPopup } = usePopup();
  const [location, setLocation] = useLocation();
  const { like, disLike } = useLike();
  const { notLogedPopUp } = useLogin();
  const [play] = useSound("sounds/Like Sound Effect.mp3");
  const [isliked, setIsliked] = useState(false);
  const user = useSelector((state) => state.user);

  // slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const scrollRef = useRef(null);

  const propertyDataString = JSON.stringify(property);

  // Like handler
  const handleLike = async (e) => {
    e.preventDefault();
    if (user) {
      play();
      setIsliked(true);
      like(property);
    } else {
      notLogedPopUp();
    }
  };

  const handleDisLike = async (e) => {
    e.preventDefault();
    setIsliked(false);
    disLike(property);
  };

  // check like state
  useEffect(() => {
    if (user && user?.favorites?.includes(property._id)) {
      setIsliked(true);
    } else {
      setIsliked(false);
    }


  }, []);

  // navigation functions
  const goToImage = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.offsetWidth * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) goToImage(currentIndex - 1);
  };

  const nextImage = () => {
    if (currentIndex < property.images.length - 1) goToImage(currentIndex + 1);
  };

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short", // Use short month name
    day: "2-digit", // Use 2-digit day format
    timeZone: "Indian/Antananarivo",
  }).format(new Date(property.created_at));

  // 👇 Close map whenever this property is no longer active
  useEffect(() => {
    if (!active) {
      setShowMap(false);
      setShowContact(false);
    }
  }, [active]);

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
        overscrollBehavior: "contain",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >

      {/* Mini horizontal gallery (responsive) */}
      <div
        style={{
          position: "absolute",
          top: 75,                          // margin top
          left: "50%",                      // center horizontally
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          flexDirection: "row",             // horizontal
          gap: 5,
          maxWidth: "98%",
          minWidth: "max-content",              // responsive width
          overflowX: "auto",                // scroll if too many images
          padding: "4px 8px",
          borderRadius: 8,
          background: "rgba(0,0,0,0.4)",    // subtle background for visibility
        }}
      >
        {property.images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={`thumb-${index}`}
            onClick={() => goToImage(index)}
            style={{
              width: 43,
              height: 43,
              objectFit: "cover",
              borderRadius: 6,
              cursor: "pointer",
              border: currentIndex === index ? "3px solid #fff" : "1px solid #555",
              transition: "all 0.3s ease",
              flexShrink: 0,                // prevent shrinking on small screens
            }}
          />
        ))}
      </div>

      {/* Image slider */}
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onScroll={(e) => {
          const newIndex = Math.round(e.target.scrollLeft / e.target.offsetWidth);
          setCurrentIndex(newIndex);
        }}
        style={{
          display: "flex",
          overflowX: "scroll",
          width: "100%",
          height: "100%",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          zIndex: 3,
        }}
      >
        {property.images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={`image-${index}`}
            loading="lazy"
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

      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <button
          onClick={prevImage}
          style={{
            position: "absolute",
            top: "45%",
            left: 10,
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            border: "none",
            borderRadius: "50%",
            padding: 8,
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <LeftArrow color="white" />
        </button>
      )}


      {currentIndex < property.images.length - 1 && (
        <button
          onClick={nextImage}
          style={{
            position: "absolute",
            top: "45%",
            right: 10,
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            border: "none",
            borderRadius: "50%",
            padding: 8,
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <RightArrow color="white" />
        </button>
      )}


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
          top: 30,
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

      {/* date displayer */}
      <div
        style={{
          position: "absolute",
          top: 38,
          right: 10,
          zIndex: 2000,
          display: "flex",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          alignItems: "center",
          padding: "5px 10px",
          fontWeight: "light",
          borderRadius: 20,
        }}
      >
        <small>{formattedDate && formattedDate}</small>
      </div>

      {/* Vertical action buttons */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
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
            src={property.owner.role === "admin" ? "images/Gilbert AI dark square.png" : property.owner.avatar || userProfile}
            onClick={() => property.owner.role === "user" ? setLocation(`/userProfile/${property.owner._id}`) : null}
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
        {isliked ? (
          <Heart style={{ pointerEvents: "auto" }} size={30} color="white" fill="red" onClick={handleDisLike} />
        ) : (
          <Heart style={{ pointerEvents: "auto" }} size={30} color="white" fill="none" onClick={handleLike} />
        )}
        <MapPinned onClick={() => { setShowMap(true); setShowContact(false) }} style={{ pointerEvents: "auto" }} size={30} color="white" />
        <Phone onClick={() => { setShowMap(false); setShowContact(true) }} style={{ pointerEvents: "auto" }} size={30} color="white" />
        <Forward onClick={() => shareProperty(property)} style={{ pointerEvents: "auto" }} size={30} color="white" />

        <div style={{ position: "relative", pointerEvents: "none", height: 10, width: 30 }}>
          <button
            type="button"
            style={{
              position: "absolute",
              transform: "translateX(-70%)",
              top: -13,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "max-content",
              pointerEvents: "auto",
              backgroundColor: "#7cbd1e",
              border: "none",
              borderRadius: 30,
              padding: "12px 15px",
              fontSize: 14,
              fontFamily: "inherit",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => alert("Vous etes deja sur la page de details.")}
          >
            Voir détails
          </button>
        </div>

      </div>

      {/* Property infos */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 10,
          right: 100,
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <p style={{ fontWeight: "bold", fontSize: 16, pointerEvents: "auto", width: "max-content" }} onClick={() => property.owner.role === "user" ? setLocation(`/userProfile/${property.owner._id}`) : null}>
          @{property.owner.role === "admin" ? "Gilbert AI" : property.owner.username}
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
        <TikTokDescription description={property.description} coords={{ city: property.city?.coords, property: property?.coords }} />
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
          {property.features.fiberOpticReady && <MdOutlineFiberSmartRecord className="h6 mr-1" />}

          {property.features.seaView && <GiSeaDragon className="h6 mr-1" />}
          {property.features.mountainView && <GiMountainCave className="h6 mr-1" />}
          {property.features.panoramicView && <GiSeatedMouse className="h6 mr-1" />}
          <br /><strong style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: "30px", padding: "5px" }}>{property.rent && property.rent.toLocaleString("en-US")} <small>Ar / mois</small></strong>
        </p>
      </div>

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
          {showMap &&
            <div
              className="property-location"
              style={{
                position: "absolute",
                minHeight: "100%",
                minWidth: "100%",
                top: "-63vh",
                padding: "20px 10px 5px 10px",
                backgroundColor: "white",
                borderRadius: 20,
                zIndex: 3000,
                display: "block",
              }}
            >
              {/* mini navbar for the lose button to hide the sliding div */}
              <div
                className="fixed-top"
                style={{
                  width: "100%",
                  zIndex: 1000,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "sticky",
                }}
              >
                {/* Close button to hide the sliding div */}
                <IoMdCloseCircle
                  style={{
                    fontSize: "2rem",
                    position: "absolute",
                    top: "-15px",
                    left: 0,
                    zIndex: "9999",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    cursor: "pointer",
                    color: "#333",
                  }}
                  onClick={() => setShowMap(false)}
                />
              </div>
              <PropertyLocationDisplayer
                position={property.coords
                  ? property.coords
                  : property.city.coords
                    ? property.city.coords
                    : {
                      lat: -18.905195365917766,
                      lng: 47.52370521426201,
                    }}
                circle={property.coords ? false : true}
              />
            </div>}
        </div>
      </div>

      {showContact &&
        <ContactCard
          setShowContact={setShowContact}
          property={property}
        />}
    </div>
  );
};

export default TikTokStyleListing;
