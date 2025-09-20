import { useSelector } from "react-redux";
import { useProperty } from "../hooks/useProperty";

import { MdOutlineLiving, MdBalcony, MdOutlineFiberSmartRecord, MdLandscape, MdOutlineBedroomChild } from "react-icons/md";
import {
  GiWell,
  GiBrickWall,
  GiFireplace, GiBathtub, GiSolarPower, GiMountainCave, GiSeatedMouse, GiSeaDragon, GiCastle
} from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle, TbWash } from "react-icons/tb";
import {
  FaCar,
  FaHome,
  FaMotorcycle,
  FaWifi,
  FaParking,
  FaShieldAlt,
  FaSwimmingPool,
  FaHotTub,
  FaBed,
  FaMoneyBillWave
} from "react-icons/fa";
import {
  FaFaucetDrip,
  FaPlugCircleBolt,
  FaKitchenSet,
} from "react-icons/fa6";

const FilterInfoBox = () => {

  // Access filter states from Redux store
  const searchForm = useSelector((state) => state.searchForm);
  const tranogasyMap = useSelector((state) => state.tranogasyMap);

  const { formatPrice } = useProperty();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "55px",
        left: "50%",
        transform: "translateX(-50%)",
        color: "#374151", // elegant dark gray for base text
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "30px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.12)",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: tranogasyMap.activeFiltersCount > 0 ? "space-between" : "center",
        maxWidth: "max-content",
        minWidth: "40vh",
        fontSize: "12px",
        fontWeight: 400,
        zIndex: 1000,
      }}
    >
      {/* Active filters summary */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#1f2937" }}>
            <FaHome size={14} color="#4b5563" />
            <strong style={{ fontWeight: 500 }}>Location</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto", marginRight: "auto", color: "#1f2937" }}>
            <FaMoneyBillWave size={14} color="#16a34a" />
            <strong style={{ fontWeight: 500 }}>{formatPrice(searchForm.rangeValue[0])} Ar - {formatPrice(searchForm.rangeValue[1])} Ar</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#1f2937" }}>
            <MdOutlineBedroomChild size={14} color="#4b5563" />
            <strong style={{ fontWeight: 500 }}>{searchForm.selectedRoom} pièces</strong>
          </div>
        </div>
        {true && (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Extra icons row */}
            <div
              style={{
                alignItems: "center",
                flexWrap: "nowrap",
                overflowX: "auto",
                scrollbarWidth: "none",
                color: "#6b7280", // muted gray for secondary icons
                display: "flex",
                gap: "8px",
              }}
            >
              {/* ⚡ Eau & électricité */}
              {searchForm.electricity && <FaPlugCircleBolt size={16} />}
              {searchForm.waterPumpSupply && <FaFaucetDrip size={16} />}
              {searchForm.waterWellSupply && <GiWell size={16} />}
              {searchForm.solarPanels && <GiSolarPower size={16} />}

              {/* 🚪 Accessibilité & extérieur */}
              {searchForm.motoAccess && <FaMotorcycle size={16} />}
              {searchForm.carAccess && <FaCar size={16} />}
              {searchForm.surroundedByWalls && <GiBrickWall size={16} />}
              {searchForm.courtyard && <MdLandscape size={16} />}
              {searchForm.parkingSpaceAvailable && <FaParking size={16} />}
              {searchForm.garage && <FaCar size={16} />}
              {searchForm.garden && <GiWell size={16} />}
              {searchForm.independentHouse && <TbBuildingCastle size={16} />}
              {searchForm.guardianHous && <FaShieldAlt size={16} />}
              {searchForm.bassi && <TbWash size={16} />}
              {/* 🏠 Confort intérieur */}
              {searchForm.kitchenFacilitie && <FaKitchenSet size={16} />}
              {searchForm.placardKitche && <FaBed size={16} />}
              {searchForm.hotWaterAvailable && <FaHotTub size={16} />}
              {searchForm.furnishedProperty && <MdOutlineLiving size={16} />}
              {searchForm.airConditionerAvailable && <TbAirConditioning size={16} />}
              {searchForm.bathtub && <GiBathtub size={16} />}
              {searchForm.fireplace && <GiFireplace size={16} />}
              {searchForm.elevator && <TbBuildingCastle size={16} />}

              {/* 🌇 Espaces extérieurs confort */}
              {searchForm.balcony && <MdBalcony size={16} />}
              {searchForm.roofTop && <GiCastle size={16} />}
              {searchForm.swimmingPool && <FaSwimmingPool size={16} />}

              {/* 🛡️ Sécurité */}
              {searchForm.securitySystem && <FaShieldAlt size={16} />}

              {/* 🌐 Connectivité */}
              {searchForm.wifiAvailability && <FaWifi size={16} />}
              {searchForm.fiberOpticReady && <MdOutlineFiberSmartRecord size={16} />}

              {/* 🌅 Vue */}
              {searchForm.seaView && <GiSeaDragon size={16} />}
              {searchForm.mountainView && <GiMountainCave size={16} />}
              {searchForm.panoramicView && <GiSeatedMouse size={16} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterInfoBox;
