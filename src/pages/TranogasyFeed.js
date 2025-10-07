import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual, Mousewheel, Keyboard, FreeMode } from 'swiper/modules';
import TranogasyFeedSkeleton from "../components/skeletons/TranogasyFeedSkeleton";
import TikTokStyleListing from "../components/TikTokStyleListing";
import CardDetails from "../components/CardDetails";
import Linkify from 'linkify-react';

// Import icons
import { MdOutlineLiving, MdBalcony, MdLandscape, MdOutlineFiberSmartRecord } from "react-icons/md";
import {
  GiWell,
  GiBrickWall,
  GiFireplace, GiBathtub, GiSolarPower, GiMountainCave, GiSeatedMouse, GiSeaDragon, GiCastle
} from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle, TbRuler2Off, TbWash } from "react-icons/tb";
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
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import {
  FaFaucetDrip,
  FaPlugCircleBolt,
  FaPlugCircleCheck,
  FaOilWell,
  FaKitchenSet,
} from "react-icons/fa6";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/virtual';
import 'swiper/css/mousewheel';
import 'swiper/css/keyboard';
import 'swiper/css/free-mode';

// Feature box component
const GenerateFeaturebox = ({ icon, label }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      border: "1px solid #e9ecef",
      fontSize: "12px",
      color: "#495057",
    }}
  >
    <span style={{ color: "#6c757d" }}>{icon}</span>
    <span>{label}</span>
  </div>
);

const TranogasyFeed = () => {
  const properties = useSelector((state) => state.properties);
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768); // 768px as breakpoint for desktop/tablet
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle slide change
  const handleSlideChange = (swiper) => {
    setCurrentIndex(swiper.activeIndex);
  };

  // Programmatic slide control
  const goToSlide = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  // Scroll to next/previous slide
  const scrollNext = () => {
    if (swiperRef.current && swiperRef.current.swiper && currentIndex < properties.length - 1) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const scrollPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper && currentIndex > 0) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  // Lock/unlock swiper
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      
      if (scrollLocked) {
        swiper.mousewheel.disable();
        swiper.keyboard.disable();
        swiper.allowTouchMove = false;
      } else {
        swiper.mousewheel.enable();
        swiper.keyboard.enable();
        swiper.allowTouchMove = true;
      }
    }
  }, [scrollLocked]);

  const currentProperty = properties[currentIndex];

  // Linkify options
  const options = {
    target: "_blank",
    rel: "noopener noreferrer"
  };

  if (!properties) {
    return <TranogasyFeedSkeleton />;
  }

  return (
    <div style={{ 
      height: '97.9vh', 
      backgroundColor: '#000',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {isDesktop ? (
        // DESKTOP LAYOUT - Two columns
        <div style={{
          display: 'flex',
          height: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          gap: 'min(50px, 4vw)',
          padding: '0 20px',
          boxSizing: 'border-box'
        }}>
          {/* Left Column - Video Feed */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 0 // Prevents flex item from overflowing
          }}>
            <Swiper
              ref={swiperRef}
              direction="vertical"
              slidesPerView={1}
              mousewheel={{
                forceToAxis: true,
                sensitivity: 1,
                releaseOnEdges: true,
              }}
              keyboard={{
                enabled: true,
                onlyInViewport: true,
              }}
              freeMode={{
                enabled: false,
                sticky: false,
              }}
              speed={400}
              resistance={true}
              resistanceRatio={0.85}
              longSwipesRatio={0.1}
              followFinger={true}
              threshold={15}
              virtual={{
                enabled: true,
                addSlidesAfter: 1,
                addSlidesBefore: 1,
              }}
              modules={[Virtual, Mousewheel, Keyboard, FreeMode]}
              style={{
                height: '100%',
                touchAction: 'pan-y',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              onSlideChange={handleSlideChange}
            >
              {properties.map((property, index) => (
                <SwiperSlide
                  key={property.id || index}
                  virtualIndex={index}
                  style={{
                    height: '98vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#000',
                  }}
                >
                  <TikTokStyleListing
                    property={property}
                    lockScroll={() => setScrollLocked(true)}
                    unlockScroll={() => setScrollLocked(false)}
                    isActive={currentIndex === index}
                    isDesktop={isDesktop}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Column - Description Box */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            padding: '75px 0',
            boxSizing: 'border-box'
          }}>
            {currentProperty && (
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '30px',
                padding: '24px',
                minHeight: 'calc(100vh - 150px)',
                boxSizing: 'border-box',
                overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                {/* Property Title */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  padding: "0 4px",
                  width: "100%",
                }}>
                  <h5 style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    margin: "0",
                    color: "#222",
                    flex: 1,
                    letterSpacing: "0.3px",
                    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    lineHeight: "1.3"
                  }}>
                    {currentProperty.title}
                  </h5>
                </div>

                {/* Property Description */}
                <div style={{
                  border: "1px solid #e9ecef",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "20px",
                  color: "#333",
                  backgroundColor: "#f8f9fa",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  whiteSpace: "break-spaces",
                  wordBreak: "break-word",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "1.6",
                }}>
                  <Linkify options={options}>
                    {currentProperty.description}
                  </Linkify>
                </div>

                {/* Features Grid */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "24px",
                }}>
                  {/* ⚡ Eau & électricité */}
                  {currentProperty.features?.electricityJirama && <GenerateFeaturebox icon={<FaPlugCircleBolt />} label={"Électricité JIRAMA"} />}
                  {currentProperty.features?.waterPumpSupplyJirama && <GenerateFeaturebox icon={<FaFaucetDrip />} label={"Pompe JIRAMA"} />}
                  {currentProperty.features?.waterWellSupply && <GenerateFeaturebox icon={<GiWell />} label={"Puits d'eau"} />}
                  {currentProperty.features?.electricityPower && <GenerateFeaturebox icon={<FaPlugCircleCheck />} label={"Électricité privée"} />}
                  {currentProperty.features?.waterPumpSupply && <GenerateFeaturebox icon={<FaOilWell />} label={"Pompe à eau privée"} />}
                  {currentProperty.features?.solarPanels && <GenerateFeaturebox icon={<GiSolarPower />} label={"Panneaux solaires"} />}
                  {/* 🚪 Accessibilité & extérieur */}
                  {currentProperty.features?.motoAccess && <GenerateFeaturebox icon={<FaMotorcycle />} label={"Accès moto"} />}
                  {currentProperty.features?.carAccess && <GenerateFeaturebox icon={<FaCar />} label={"Accès voiture"} />}
                  {currentProperty.features?.surroundedByWalls && <GenerateFeaturebox icon={<GiBrickWall />} label={"Clôturée"} />}
                  {currentProperty.features?.courtyard && <GenerateFeaturebox icon={<MdLandscape />} label={"Cour"} />}
                  {currentProperty.features?.parkingSpaceAvailable && <GenerateFeaturebox icon={<FaParking />} label={"Parking"} />}
                  {currentProperty.features?.garage && <GenerateFeaturebox icon={<FaCar />} label={"Garage"} />}
                  {currentProperty.features?.garden && <GenerateFeaturebox icon={<GiWell />} label={"Jardin"} />}
                  {currentProperty.features?.independentHouse && <GenerateFeaturebox icon={<TbBuildingCastle />} label={"Indépendante"} />}
                  {currentProperty.features?.guardianHouse && <GenerateFeaturebox icon={<FaShieldAlt />} label={"Maison pour gardien"} />}
                  {currentProperty.features?.bassin && <GenerateFeaturebox icon={<TbWash />} label={"Bassin"} />}
                  {/* 🏠 Confort intérieur */}
                  {currentProperty.features?.kitchenFacilities && <GenerateFeaturebox icon={<FaKitchenSet />} label={"Cuisine équipée"} />}
                  {currentProperty.features?.placardKitchen && <GenerateFeaturebox icon={<FaBed />} label={"Cuisine placardée"} />}
                  {currentProperty.features?.hotWaterAvailable && <GenerateFeaturebox icon={<FaHotTub />} label={"Eau chaude"} />}
                  {currentProperty.features?.furnishedProperty && <GenerateFeaturebox icon={<MdOutlineLiving />} label={"Meublé"} />}
                  {currentProperty.features?.airConditionerAvailable && <GenerateFeaturebox icon={<TbAirConditioning />} label={"Climatisation"} />}
                  {currentProperty.features?.bathtub && <GenerateFeaturebox icon={<GiBathtub />} label={"Baignoire"} />}
                  {currentProperty.features?.fireplace && <GenerateFeaturebox icon={<GiFireplace />} label={"Cheminée"} />}
                  {currentProperty.features?.elevator && <GenerateFeaturebox icon={<TbBuildingCastle />} label={"Ascenseur"} />}
                  {/* 🌇 Espaces extérieurs confort */}
                  {currentProperty.features?.balcony && <GenerateFeaturebox icon={<MdBalcony />} label={"Balcon"} />}
                  {currentProperty.features?.roofTop && <GenerateFeaturebox icon={<GiCastle />} label={"Toit terrasse"} />}
                  {currentProperty.features?.swimmingPool && <GenerateFeaturebox icon={<FaSwimmingPool />} label={"Piscine"} />}
                  {/* 🛡️ Sécurité */}
                  {currentProperty.features?.securitySystem && <GenerateFeaturebox icon={<FaShieldAlt />} label={"Système de sécurité"} />}
                  {/* 🌐 Connectivité */}
                  {currentProperty.features?.wifiAvailability && <GenerateFeaturebox icon={<FaWifi />} label={"Wi-Fi"} />}
                  {currentProperty.features?.fiberOpticReady && <GenerateFeaturebox icon={<MdOutlineFiberSmartRecord />} label={"Pré-fibrée"} />}
                  {/* 🌅 Vue */}
                  {currentProperty.features?.seaView && <GenerateFeaturebox icon={<GiSeaDragon />} label={"Vue mer"} />}
                  {currentProperty.features?.mountainView && <GenerateFeaturebox icon={<GiMountainCave />} label={"Vue montagne"} />}
                  {currentProperty.features?.panoramicView && <GenerateFeaturebox icon={<GiSeatedMouse />} label={"Vue panoramique"} />}
                </div>

                {/* Card Details */}
                <CardDetails property={currentProperty} />
              </div>
            )}
          </div>

          {/* Scroll Buttons - Positioned on right center of viewport */}
          <div style={{
            position: 'fixed',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 1000
          }}>
            <button
              onClick={scrollPrev}
              disabled={currentIndex === 0}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentIndex === 0 ? '#6c757d' : '#fff',
                color: currentIndex === 0 ? '#adb5bd' : '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
                fontSize: '18px'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              <FaChevronUp />
            </button>
            
            <button
              onClick={scrollNext}
              disabled={currentIndex === properties.length - 1}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentIndex === properties.length - 1 ? '#6c757d' : '#fff',
                color: currentIndex === properties.length - 1 ? '#adb5bd' : '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentIndex === properties.length - 1 ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
                fontSize: '18px'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== properties.length - 1) {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== properties.length - 1) {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              <FaChevronDown />
            </button>
          </div>
        </div>
      ) : (
        // MOBILE LAYOUT - Original single column
        <Swiper
          ref={swiperRef}
          direction="vertical"
          slidesPerView={1}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          freeMode={{
            enabled: false,
            sticky: false,
          }}
          speed={400}
          resistance={true}
          resistanceRatio={0.85}
          longSwipesRatio={0.1}
          followFinger={true}
          threshold={15}
          virtual={{
            enabled: true,
            addSlidesAfter: 1,
            addSlidesBefore: 1,
          }}
          modules={[Virtual, Mousewheel, Keyboard, FreeMode]}
          style={{
            height: '100%',
            touchAction: 'pan-y',
          }}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => {
            if (currentIndex > 0) {
              swiper.slideTo(currentIndex, 0);
            }
          }}
        >
          {properties.map((property, index) => (
            <SwiperSlide
              key={property.id || index}
              virtualIndex={index}
              style={{
                height: '98vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000',
              }}
            >
              <TikTokStyleListing
                property={property}
                lockScroll={() => setScrollLocked(true)}
                unlockScroll={() => setScrollLocked(false)}
                isActive={currentIndex === index}
                isDesktop={isDesktop}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default TranogasyFeed;