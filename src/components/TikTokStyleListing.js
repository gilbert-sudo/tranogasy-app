import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useSelector } from "react-redux";

import TikTokDescription from "./TikTokDescription";
import PropertyLocationDisplayer from "./PropertyLocationDisplayer";

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

      {/* Message input */}
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
          {showContact &&
            <div
              className="property-location"
              style={{
                position: "absolute",
                minHeight: "100%",
                minWidth: "100%",
                top: "-53vh",
                padding: "20px 10px 5px 10px",
                backgroundColor: "white",
                borderRadius: 20,
                zIndex: 3000,
                display: "block",
              }}
            >
              {/* mini navbar for the close button to hide the sliding div */}
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
                  onClick={() => setShowContact(false)}
                />
              </div>

              {/* Contact info section */}
              <div className="contact-info" style={{ padding: "15px 0" }}>
                {/* Property info section */}
                <div style={{
                  display: "flex",
                  border: "1px solid #ddd",
                  alignItems: "center",
                  marginBottom: "20px",
                  padding: "10px",
                  borderRadius: "12px"
                }}>
                  <img
                    src={property.images[0]?.src || property.owner.avatar || userProfile}
                    alt={property.title}
                    style={{
                      width: "65px",
                      height: "65px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      marginRight: "12px"
                    }}
                  />
                  <div>
                    <p style={{ margin: "0", fontSize: "15px", fontWeight: "600", color: "#333" }}>
                      {property.title}
                    </p>
                    <p style={{ margin: "3px 0 0 0", fontSize: "11px", color: "#666" }}>
                      <ImLocation className="text-danger mr-1 mb-1" />{property.city.fokontany}, {property.city.commune} , {property.city.district}
                    </p>
                  </div>
                </div>

                {/* Phone numbers section */}
                {(() => {
                  const numbers = [
                    property.phone1,
                    property.phone2,
                    property.phone3,
                  ].map(formatPhone);

                  return (
                    <div style={{ marginBottom: "20px" }}>
                      <h4
                        style={{
                          margin: "0 0 10px 0",
                          fontSize: "15px",
                          fontWeight: "500",
                          color: "#333",
                        }}
                      >
                        Numéros de contact
                      </h4>
                      {numbers.map(
                        (num, i) =>
                          num && (
                            <a
                              key={i}
                              href={`tel:${num}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "12px",
                                marginBottom: "5px",
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #ddd",
                                borderRadius: "30px",
                                color: "#333",
                                fontWeight: "500",
                                textDecoration: "none",
                              }}
                            >
                              <Phone size={18} style={{ marginRight: "10px" }} />
                              {num}
                            </a>
                          )
                      )}
                      {!numbers.some(Boolean) && (
                        <p
                          style={{
                            padding: "12px",
                            backgroundColor: "#fff4e6",
                            borderRadius: "10px",
                            color: "#cc7a00",
                            margin: 0,
                          }}
                        >
                          Aucun numéro de contact disponible pour cette propriété
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* Additional contact options */}
                <div>
                  <h4 style={{
                    margin: "0 0 10px 0",
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "#333"
                  }}>
                    Autres options
                  </h4>

                  <button
                    onClick={() => featureUnderConstructionPopup()}
                    className="btn btn-dark"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "12px 15px",
                      borderRadius: "30px",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginBottom: "10px"
                    }}
                  >
                    <SendHorizontal size={18} style={{ marginRight: "10px" }} />
                    Envoyer un message
                  </button>

                  {/* WhatsApp direct link if phone1 is available */}
                  {/* {property.phone1 && (
                    <a
                      href={`https://wa.me/${property.phone1.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px 15px",
                        backgroundColor: "#25D366",
                        borderRadius: "10px",
                        textDecoration: "none",
                        color: "white",
                        fontWeight: "500"
                      }}
                      onClick={() => {
                        // Track WhatsApp click if needed
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "10px" }}>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
                      </svg>
                      Contact via WhatsApp
                    </a>
                  )} */}
                </div>

                {/* Contact hours suggestion */}
                {/* <div style={{
                  marginTop: "20px",
                  padding: "12px 15px",
                  backgroundColor: "#e6f7ff",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "#0056b3"
                }}>
                  <p style={{ margin: 0 }}>
                    <strong>Tip:</strong> Contact between 9AM-6PM for faster response
                  </p>
                </div> */}
              </div>
            </div>
          }


          {/* <input
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
          </button> */}
        </div>
      </div>

    </div>
  );
};

export default TikTokStyleListing;
