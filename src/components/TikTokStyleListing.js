import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useSelector, useDispatch } from "react-redux";
import { setTranogasyFeedField } from "../redux/redux";
import Linkify from "linkify-react";

import TikTokDescription from "./TikTokDescription";
import PropertyLocationDisplayer from "./PropertyLocationDisplayer";
import ContactCard from "./ContactCard";
import CardDetails from "./CardDetails";

import { useScrollDirectionLock } from "../hooks/useScrollDirectionLock";
import { useProperty } from "../hooks/useProperty";
import { useLike } from "../hooks/useLike";
import { useLogin } from "../hooks/useLogin";
import { usePopup } from "../hooks/usePopup";
import { useSubscription } from "../hooks/useSubscription";
import { useFormater } from "../hooks/useFormater";
import useSound from "use-sound";

import {
  ChevronLeft,
  Heart,
  MapPinned,
  Phone,
  Forward,
  Plus,
  ChevronLeft as LeftArrow,
  ChevronRight as RightArrow
} from "lucide-react";

import { MdOutlineLiving, MdBalcony, MdLandscape, MdOutlineFiberSmartRecord } from "react-icons/md";
import {
  GiWell,
  GiBrickWall,
  GiFireplace, GiBathtub, GiSolarPower, GiMountainCave, GiSeatedMouse, GiSeaDragon, GiCastle
} from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle, TbWash } from "react-icons/tb";
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

const TikTokStyleListing = ({ property, lockScroll, unlockScroll, isDesktop }) => {

  const { handleTouchStart, handleTouchMove } = useScrollDirectionLock();
  const { shareProperty } = useProperty();
  const dispatch = useDispatch();
  const [location, setLocation] = useLocation();
  const { like, disLike } = useLike();
  const { notLogedPopUp } = useLogin();
  const { featureUnderConstructionPopup, unpaidBillPopup } = usePopup();
  const { notSubscribedPopup } = useSubscription();
  const { formatDateAgo } = useFormater();
  const [play] = useSound("sounds/Like Sound Effect.mp3");
  const [isliked, setIsliked] = useState(false);

  const user = useSelector((state) => state.user);
  const timer = useSelector((state) => state.timer.timer);
  const tranogasyFeed = useSelector((state) => state.tranogasyFeed);
  const payments = useSelector((state) => state.payments);

  // slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isInSearchPage, setIsInSearchPage] = useState(false);

  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const scrollRef = useRef(null);

  const propertyDataString = JSON.stringify(property);

  const options = {
    target: '_blank',
    rel: 'noopener noreferrer'
  };

  function setIsSlideVisible(state) {
    dispatch(setTranogasyFeedField({ key: "isFeedSliderVisible", value: state }));
  }

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

  const handleShowContact = () => {
    // Guard clause 1: User not logged in
    if (!user) {
      notLogedPopUp();
      return; // Exit early
    }

    // Guard clause 2: Check for specific subscription/timer conditions
    // if (!timer && !user.leftTime && property.owner._id !== user._id) {
    //   notSubscribedPopup();
    //   return; // Exit early
    // }

    // Guard clause 3: Check for unpaid bills
    const hasUnpaidBills = payments.some(
      (payment) => payment.status === "refused" || payment.status === "redone"
    );
    
    if (hasUnpaidBills) {
      unpaidBillPopup();
      return; // Exit early
    }

    // Happy Path: All conditions passed, show contact
    setShowContact(true);
  };

  // check like state
  useEffect(() => {
    if (user && user?.favorites?.includes(property._id)) {
      setIsliked(true);
    } else {
      setIsliked(false);
    }


  }, []);

  // Enhanced navigation functions
  const goToImage = useCallback((index) => {
    if (scrollRef.current && index >= 0 && index < property.images.length) {
      const scrollWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: scrollWidth * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  }, [property.images.length]);

  const prevImage = useCallback(() => {
    if (currentIndex > 0) goToImage(currentIndex - 1);
  }, [currentIndex, goToImage]);

  const nextImage = useCallback(() => {
    if (currentIndex < property.images.length - 1) goToImage(currentIndex + 1);
  }, [currentIndex, property.images.length, goToImage]);

  const touchStartX = useRef(0);

  const handleImageTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    handleTouchStart(e); // keep your existing lock logic
  };

  const handleImageTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX.current;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        prevImage(); // swipe right → previous image
      } else {
        nextImage(); // swipe left → next image
      }
    } else {
      goToImage(currentIndex); // snap back if swipe too small
    }
  };


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
            style={{ cursor: "pointer", color: "#333", fontWeight: "500" }}
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

  // 👇 Close map whenever this property is no longer active
  useEffect(() => {
    if (tranogasyFeed.isFeedSliderVisible || showMap || showContact) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [tranogasyFeed.isFeedSliderVisible, showMap, showContact]);

  useEffect(() => {
    (location.startsWith("/tranogasyMap")) ? setIsInSearchPage(true) : setIsInSearchPage(false);
  }, [location]);

  return (
    <div
      className="tikTokStyleListing"
      style={{
        width: "100%",
        height: "100dvh",
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
        zIndex: 3
      }}
    >

      {/* Mini horizontal gallery (responsive) */}
      <div
        style={{
          position: "absolute",
          top: 110,                          // margin top
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
        onTouchStart={handleImageTouchStart}
        onTouchMove={handleTouchMove}  // still from your hook
        onTouchEnd={handleImageTouchEnd}
        onScroll={(e) => {
          const newIndex = Math.round(e.target.scrollLeft / e.target.offsetWidth);
          setCurrentIndex(newIndex);
        }}

        style={{
          display: "flex",
          overflowX: "hidden",
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
              marginTop: img.height > img.width ? "0" : "-50px",
              flexShrink: 0,
              width: "100%",
              height: "100%",
              objectFit: img.height > img.width ? "contain" : "contain",
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
            top: "40%",
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
            top: "40%",
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
      {!isInSearchPage &&
        <div
          onClick={() => window.history.back()}
          style={{
            position: "absolute",
            top: 60,
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
        </div>}

      {/* date displayer */}
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 10,
          zIndex: 10,
          display: "flex",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          alignItems: "center",
          padding: "5px 10px",
          fontWeight: "light",
          borderRadius: "9999px",
        }}
      >
        <small>{formatDateAgo(property.created_at)}</small>
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
            src={property.owner.role === "admin" ? (property?.sources?.avatar || "images/Gilbert AI dark square.png") : property.owner.avatar || userProfile}
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
        <Phone onClick={() => { setShowMap(false); handleShowContact() }} style={{ pointerEvents: "auto" }} size={30} color="white" />
        <Forward onClick={() => shareProperty(property)} style={{ pointerEvents: "auto" }} size={30} color="white" />

        <div style={{ display: isDesktop ? "none" : "block", position: "relative", pointerEvents: "none", height: 10, width: 30 }}>
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
            onClick={() => {
              setIsSlideVisible(true);
            }}
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
          @{property.owner.role === "admin" ? (property?.sources?.username || "Gilbert AI") : property.owner.username}
        </p>

        <p
          style={{
            fontSize: 14,
            fontWeight: "bold",
            pointerEvents: "auto",
            width: "40ch",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          onClick={() => {
            setIsSlideVisible(true)
          }}
        >
          {property.title}
        </p>
        {isDesktop ?
          <strong>
            {" "}
            <ImLocation className="text-danger mr-1 mb-2" />
            {property.city.fokontany} {property.city.commune}
          </strong>
          :
          <>
            <small>
              {" "}
              <ImLocation className="text-danger mr-1 mb-2" />
              {property.city.fokontany} {property.city.commune}
            </small>
            <TikTokDescription description={property.description} coords={{ city: property.city?.coords, property: property?.coords }} setIsSlideVisible={setIsSlideVisible} />
          </>
        }


        <p>
          {!isDesktop && property.features.electricityJirama && <FaPlugCircleBolt className="h6 mr-1" />}
          {!isDesktop && property.features.waterPumpSupplyJirama && <FaFaucetDrip className="h6 mr-1" />}
          {!isDesktop && property.features.waterWellSupply && <GiWell className="h6 mr-1" />}
          {!isDesktop && property.features.electricityPower && <FaPlugCircleCheck className="h6 mr-1" />}
          {!isDesktop && property.features.waterPumpSupply && <FaOilWell className="h6 mr-1" />}
          {!isDesktop && property.features.solarPanels && <GiSolarPower className="h6 mr-1" />}

          {!isDesktop && property.features.motoAccess && <FaMotorcycle className="h6 mr-1" />}
          {!isDesktop && property.features.carAccess && <FaCar className="h6 mr-1" />}
          {!isDesktop && property.features.surroundedByWalls && <GiBrickWall className="h6 mr-1" />}
          {!isDesktop && property.features.courtyard && <MdLandscape className="h6 mr-1" />}
          {!isDesktop && property.features.parkingSpaceAvailable && <FaParking className="h6 mr-1" />}
          {!isDesktop && property.features.garage && <FaCar className="h6 mr-1" />}
          {!isDesktop && property.features.garden && <GiWell className="h6 mr-1" />}
          {!isDesktop && property.features.independentHouse && <TbBuildingCastle className="h6 mr-1" />}
          {!isDesktop && property.features.guardianHouse && <FaShieldAlt className="h6 mr-1" />}

          {!isDesktop && property.features.kitchenFacilities && <FaKitchenSet className="h6 mr-1" />}
          {!isDesktop && property.features.placardKitchen && <FaBed className="h6 mr-1" />}
          {!isDesktop && property.features.hotWaterAvailable && <FaHotTub className="h6 mr-1" />}
          {!isDesktop && property.features.furnishedProperty && <MdOutlineLiving className="h6 mr-1" />}
          {!isDesktop && property.features.airConditionerAvailable && <TbAirConditioning className="h6 mr-1" />}
          {!isDesktop && property.features.bathtub && <GiBathtub className="h6 mr-1" />}
          {!isDesktop && property.features.fireplace && <GiFireplace className="h6 mr-1" />}
          {!isDesktop && property.features.elevator && <TbBuildingCastle className="h6 mr-1" />}

          {!isDesktop && property.features.balcony && <MdBalcony className="h6 mr-1" />}
          {!isDesktop && property.features.roofTop && <GiCastle className="h6 mr-1" />}
          {!isDesktop && property.features.swimmingPool && <FaSwimmingPool className="h6 mr-1" />}

          {!isDesktop && property.features.securitySystem && <FaShieldAlt className="h6 mr-1" />}

          {!isDesktop && property.features.wifiAvailability && <FaWifi className="h6 mr-1" />}
          {!isDesktop && property.features.fiberOpticReady && <MdOutlineFiberSmartRecord className="h6 mr-1" />}

          {!isDesktop && property.features.seaView && <GiSeaDragon className="h6 mr-1" />}
          {!isDesktop && property.features.mountainView && <GiMountainCave className="h6 mr-1" />}
          {!isDesktop && property.features.panoramicView && <GiSeatedMouse className="h6 mr-1" />}
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
            <>
              {/* Semi-transparent backdrop */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 10,
                  cursor: "pointer",
                }}
                onClick={() => setShowMap(false)}
              />
              <div
                className="property-location"
                style={{
                  position: "absolute",
                  minHeight: "100%",
                  minWidth: "100%",
                  top: "-63dvh",
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
              </div>
            </>
          }
        </div>
      </div>

      {
        showContact &&
        <ContactCard
          setShowContact={setShowContact}
          property={property}
        />
      }
      <div
        ref={sliderRef}
        className={`property-details-slide ${tranogasyFeed.isFeedSliderVisible ? "show" : ""}`}
        style={{
          position: "fixed",
          left: "50%",
          bottom: 0,
          paddingBottom: "80px",
          transform: tranogasyFeed.isFeedSliderVisible
            ? `translate(-50%, ${Math.min(0, currentY)}px)`
            : "translate(-50%, 100%)",
          width: "100%",
          height: "93dvh",
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRadius: "30px 30px 0 0",
          boxShadow: "0 -1px 12px hsla(var(--hue), var(--sat), 15%, 0.30)",
          transition: isDragging ? "none" : "transform 0.5s ease",
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 9000000000000,
          touchAction: "pan-y", // Improve touch scrolling
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          setStartY(touch.clientY);
          setCurrentY(0);
          setIsDragging(true);
        }}
        onTouchMove={(e) => {
          if (!isDragging) return;

          const touch = e.touches[0];
          const deltaY = touch.clientY - startY;

          // Only allow dragging downward (positive deltaY)
          if (deltaY > 0) {
            setCurrentY(deltaY);
            e.preventDefault(); // Prevent page scroll when dragging down
          }
        }}
        onTouchEnd={() => {
          if (!isDragging) return;

          setIsDragging(false);

          // If dragged more than 100px down, close the slider
          if (currentY > 100) {
            setIsSlideVisible(false);
          }

          // Reset position
          setCurrentY(0);
          setStartY(0);
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
          <div
            style={{
              width: "100%",
              fontWeight: "bold",
              fontSize: "15px",
              padding: "10px",
              borderRadius: "30px",
              backgroundColor: "white",
              color: "#333",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            <small>
              Détails de la propriété {" "}
              <num className="text-danger font-weight-bold" style={{ border: "1px solid #ccc", padding: "2px 6px", borderRadius: "8px" }}>
                n°:{property.propertyNumber}
              </num>
            </small>
          </div>
          <IoMdCloseCircle
            style={{
              fontSize: "2rem",
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 9999,
              backgroundColor: "#fff",
              borderRadius: "50%",
              cursor: "pointer",
              color: "#333",
            }}
            onClick={() => {
              setIsSlideVisible(false);
            }}
          />
        </div>
        {/* Close button to hide the sliding div */}
        {tranogasyFeed.isFeedSliderVisible && (
          <div className="container">
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
                  <h5
                    style={{
                      fontSize: "16px",            // Slightly bigger for mobile impact
                      fontWeight: "500",           // Medium, elegant weight
                      margin: "0 10px 0 10px",      // Top margin for spacing
                      color: "#222",               // Slightly darker for better contrast
                      flex: 1,
                      letterSpacing: "0.3px",     // Subtle spacing to breathe
                      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    {property && property.title}
                  </h5>
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
                    {property && property.description}
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
                  {property.features?.electricityJirama && <GenerateFeaturebox icon={<FaPlugCircleBolt />} label={"Électricité JIRAMA"} />}
                  {property.features?.waterPumpSupplyJirama && <GenerateFeaturebox icon={<FaFaucetDrip />} label={"Pompe JIRAMA"} />}
                  {property.features?.waterWellSupply && <GenerateFeaturebox icon={<GiWell />} label={"Puits d'eau"} />}
                  {property.features?.electricityPower && <GenerateFeaturebox icon={<FaPlugCircleCheck />} label={"Électricité privée"} />}
                  {property.features?.waterPumpSupply && <GenerateFeaturebox icon={<FaOilWell />} label={"Pompe à eau privée"} />}
                  {property.features?.solarPanels && <GenerateFeaturebox icon={<GiSolarPower />} label={"Panneaux solaires"} />}
                  {/* 🚪 Accessibilité & extérieur */}
                  {property.features?.motoAccess && <GenerateFeaturebox icon={<FaMotorcycle />} label={"Accès moto"} />}
                  {property.features?.carAccess && <GenerateFeaturebox icon={<FaCar />} label={"Accès voiture"} />}
                  {property.features?.surroundedByWalls && <GenerateFeaturebox icon={<GiBrickWall />} label={"Clôturée"} />}
                  {property.features?.courtyard && <GenerateFeaturebox icon={<MdLandscape />} label={"Cour"} />}
                  {property.features?.parkingSpaceAvailable && <GenerateFeaturebox icon={<FaParking />} label={"Parking"} />}
                  {property.features?.garage && <GenerateFeaturebox icon={<FaCar />} label={"Garage"} />}
                  {property.features?.garden && <GenerateFeaturebox icon={<GiWell />} label={"Jardin"} />}
                  {property.features?.independentHouse && <GenerateFeaturebox icon={<TbBuildingCastle />} label={"Indépendante"} />}
                  {property.features?.guardianHouse && <GenerateFeaturebox icon={<FaShieldAlt />} label={"Maison pour gardien"} />}
                  {property.features?.bassin && <GenerateFeaturebox icon={<TbWash />} label={"Bassin"} />}
                  {/* 🏠 Confort intérieur */}
                  {property.features?.kitchenFacilities && <GenerateFeaturebox icon={<FaKitchenSet />} label={"Cuisine équipée"} />}
                  {property.features?.placardKitchen && <GenerateFeaturebox icon={<FaBed />} label={"Cuisine placardée"} />}
                  {property.features?.hotWaterAvailable && <GenerateFeaturebox icon={<FaHotTub />} label={"Eau chaude"} />}
                  {property.features?.furnishedProperty && <GenerateFeaturebox icon={<MdOutlineLiving />} label={"Meublé"} />}
                  {property.features?.airConditionerAvailable && <GenerateFeaturebox icon={<TbAirConditioning />} label={"Climatisation"} />}
                  {property.features?.bathtub && <GenerateFeaturebox icon={<GiBathtub />} label={"Baignoire"} />}
                  {property.features?.fireplace && <GenerateFeaturebox icon={<GiFireplace />} label={"Cheminée"} />}
                  {property.features?.elevator && <GenerateFeaturebox icon={<TbBuildingCastle />} label={"Ascenseur"} />}
                  {/* 🌇 Espaces extérieurs confort */}
                  {property.features?.balcony && <GenerateFeaturebox icon={<MdBalcony />} label={"Balcon"} />}
                  {property.features?.roofTop && <GenerateFeaturebox icon={<GiCastle />} label={"Toit terrasse"} />}
                  {property.features?.swimmingPool && <GenerateFeaturebox icon={<FaSwimmingPool />} label={"Piscine"} />}
                  {/* 🛡️ Sécurité */}
                  {property.features?.securitySystem && <GenerateFeaturebox icon={<FaShieldAlt />} label={"Système de sécurité"} />}
                  {/* 🌐 Connectivité */}
                  {property.features?.wifiAvailability && <GenerateFeaturebox icon={<FaWifi />} label={"Wi-Fi"} />}
                  {property.features?.fiberOpticReady && <GenerateFeaturebox icon={<MdOutlineFiberSmartRecord />} label={"FPré-fibrée"} />}
                  {/* 🌅 Vue */}
                  {property.features?.seaView && <GenerateFeaturebox icon={<GiSeaDragon />} label={"Vue mer"} />}
                  {property.features?.mountainView && <GenerateFeaturebox icon={<GiMountainCave />} label={"Vue montagne"} />}
                  {property.features?.panoramicView && <GenerateFeaturebox icon={<GiSeatedMouse />} label={"Vue panoramique"} />}
                </div>

                <CardDetails property={property} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div >
  );
};

export default TikTokStyleListing;
