import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useSelector, useDispatch } from "react-redux";
import { setSearchFormState } from "../redux/redux";

import RangeSlider from "react-range-slider-input";
import "./css/range-slider.css";
import "react-range-slider-input/dist/style.css";
import { useProperty } from "../hooks/useProperty";
import { useMap } from "../hooks/useMap";

import { offlineLoader } from "../hooks/useOfflineLoader";

import { FcGoogle } from "react-icons/fc";
import { MdOutlineLiving, MdBalcony, } from "react-icons/md";
import {
  GiCheckMark,
  GiCircle,
  GiWell,
  GiBrickWall,
  GiFireplace, GiBathtub, GiSolarPower, GiMountainCave, GiSeatedMouse, GiSeaDragon, GiCastle
} from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle } from "react-icons/tb";
import { LuBellPlus } from "react-icons/lu";
import {
  FaCar,
  FaHome,
  FaKey,
  FaUsers,
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

const HouseSearchForm = ({ handleCloseSlideClick }) => {

  const searchForm = useSelector((state) => state.searchForm);
  const properties = useSelector((state) => state.properties);

  const dispatch = useDispatch();
  const [, setLocation] = useLocation("");
  const [budgetMax, setBudgetMax] = useState(null);
  const [budgetMin, setBudgetMin] = useState(null);
  const { searchProperty, getPriceAndRentRanges } = useProperty();

  const [isRent, setIsRent] = useState(true);
  const [isSale, setIsSale] = useState(false);
  const [isColoc, setIsColoc] = useState(false);
  const [priceRange, setPriceRange] = useState(
    properties ? getPriceAndRentRanges(properties) : null
  );
  const [rangeValue, setRangeValue] = useState([0, 0]);
  const [selectedRoom, setSelectedRoom] = useState("1+");
  const [customRoom, setCustomRoom] = useState("");

  // features checkboxs
  const [carAccess, setCarAccess] = useState(false);
  const [motoAccess, setMotoAccess] = useState(false);
  const [wifiAvailability, setWifiAvailability] = useState(false);
  const [parkingSpaceAvailable, setParkingSpaceAvailable] = useState(false);
  const [waterPumpSupply, setWaterPumpSupply] = useState(false);
  const [electricityPower, setElectricityPower] = useState(false);
  const [securitySystem, setSecuritySystem] = useState(false);
  const [waterWellSupply, setWaterWellSupply] = useState(false);
  const [surroundedByWalls, setSurroundedByWalls] = useState(false);
  const [electricityJirama, setElectricityJirama] = useState(false);
  const [waterPumpSupplyJirama, setWaterPumpSupplyJirama] = useState(false);
  const [kitchenFacilities, setKitchenFacilities] = useState(false);
  const [airConditionerAvailable, setAirConditionerAvailable] = useState(false);
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [furnishedProperty, setFurnishedProperty] = useState(false);
  const [hotWaterAvailable, setHotWaterAvailable] = useState(false);
  const [insideToilet, setInsideToilet] = useState("all");
  const [insideBathroom, setInsideBathroom] = useState("all");
  const [elevator, setElevator] = useState(false);
  const [garden, setGarden] = useState(false);
  const [courtyard, setCourtyard] = useState(false);
  const [balcony, setBalcony] = useState(false);
  const [roofTop, setRoofTop] = useState(false);
  const [independentHouse, setIndependentHouse] = useState(false);
  const [garage, setGarage] = useState(false);
  const [guardianHouse, setGuardianHouse] = useState(false);
  const [placardKitchen, setPlacardKitchen] = useState(false);
  const [bathtub, setBathtub] = useState(false);
  const [fireplace, setFireplace] = useState(false);
  const [fiberOpticReady, setFiberOpticReady] = useState(false);
  const [seaView, setSeaView] = useState(false);
  const [mountainView, setMountainView] = useState(false);
  const [panoramicView, setPanoramicView] = useState(false);
  const [solarPanels, setSolarPanels] = useState(false);
  const [searchResults, setSearchResults] = useState("");

  const GenerateCheckbox = ({ state, label, icon, onClickFunction }) => {
    return (
      <div
        style={{ borderRadius: "20px", padding: "10px", cursor: "pointer", border: "1px solid #ccc" }}
        className={`btn-group ${state ? "bg-secondary" : "bg-light"
          }`}
        role="group"
        onClick={onClickFunction}
      >
        {state && <span className="text-light">{icon}</span>}
        <div className="form-check pl-0" style={{ cursor: "pointer" }}>
          <label
            className="form-check-label"
            htmlFor={state}
            style={{ cursor: "pointer" }}
          >
            {!state && icon}
            {!state && (
              <sub>
                <GiCircle />
              </sub>
            )}{" "}
            {state && (
              <sub>
                {" "}
                <GiCheckMark className="text-success" />
              </sub>
            )}{" "}
            <small className={`${state ? "text-white" : ""}`}>
              {label}
            </small>
          </label>
        </div>
      </div>
    );
  };

  const handleRentClick = () => {
    setIsRent(true);
    setIsSale(false);
    setIsColoc(false);
  };

  const handleSaleClick = () => {
    setIsRent(false);
    setIsSale(true);
    setIsColoc(false);
  };

  const handleColocClick = () => {
    setIsRent(false);
    setIsSale(false);
    setIsColoc(true);
  };

  // function to handle the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let type;
    isRent === true ? (type = "rent") : (type = "sale");

    let numberOfRooms = (selectedRoom && selectedRoom.length > 0) ? selectedRoom.split("+")[0] : customRoom;

    const parameters = {
      type,
      budgetMax,
      budgetMin,
      numberOfRooms,
      motoAccess,
      carAccess,
      parkingSpaceAvailable,
      elevator,
      garden,
      courtyard,
      balcony,
      roofTop,
      swimmingPool,
      surroundedByWalls,
      independentHouse,
      garage,
      guardianHouse,
      kitchenFacilities,
      placardKitchen,
      insideToilet,
      insideBathroom,
      bathtub,
      fireplace,
      airConditionerAvailable,
      hotWaterAvailable,
      furnishedProperty,
      electricityPower,
      electricityJirama,
      waterPumpSupply,
      waterPumpSupplyJirama,
      waterWellSupply,
      securitySystem,
      wifiAvailability,
      fiberOpticReady,
      seaView,
      mountainView,
      panoramicView,
      solarPanels,
    };
    searchProperty(parameters);
  };

  useEffect(() => {
    if (searchForm) {
      setIsRent(searchForm.isRent);
      setIsSale(searchForm.isSale);
      setIsColoc(searchForm.isColoc);
      setBudgetMax(searchForm.budgetMax);
      setBudgetMin(searchForm.budgetMin);
      setRangeValue(searchForm.rangeValue);
      setSelectedRoom(searchForm.selectedRoom);
      setCustomRoom(searchForm.customRoom);
      setCarAccess(searchForm.carAccess);
      setMotoAccess(searchForm.motoAccess);
      setWifiAvailability(searchForm.wifiAvailability);
      setParkingSpaceAvailable(searchForm.parkingSpaceAvailable);
      setWaterPumpSupply(searchForm.waterPumpSupply);
      setElectricityPower(searchForm.electricityPower);
      setSecuritySystem(searchForm.securitySystem);
      setWaterWellSupply(searchForm.waterWellSupply);
      setSurroundedByWalls(searchForm.surroundedByWalls);
      setElectricityJirama(searchForm.electricityJirama);
      setWaterPumpSupplyJirama(searchForm.waterPumpSupplyJirama);
      setKitchenFacilities(searchForm.kitchenFacilities);
      setAirConditionerAvailable(searchForm.airConditionerAvailable);
      setSwimmingPool(searchForm.swimmingPool);
      setFurnishedProperty(searchForm.furnishedProperty);
      setHotWaterAvailable(searchForm.hotWaterAvailable);
      setInsideToilet(searchForm.insideToilet);
      setInsideBathroom(searchForm.insideBathroom);
      setElevator(searchForm.elevator);
      setGarden(searchForm.garden);
      setCourtyard(searchForm.courtyard);
      setBalcony(searchForm.balcony);
      setRoofTop(searchForm.roofTop);
      setIndependentHouse(searchForm.independentHouse);
      setGarage(searchForm.garage);
      setGuardianHouse(searchForm.guardianHouse);
      setPlacardKitchen(searchForm.placardKitchen);
      setBathtub(searchForm.bathtub);
      setFireplace(searchForm.fireplace);
      setFiberOpticReady(searchForm.fiberOpticReady);
      setSeaView(searchForm.seaView);
      setMountainView(searchForm.mountainView);
      setPanoramicView(searchForm.panoramicView);
      setSolarPanels(searchForm.solarPanels);
    }
    
  }, []);

  useEffect(() => {
    
    dispatch(setSearchFormState({
      isRent,
      isSale,
      isColoc,
      budgetMax,
      budgetMin,
      rangeValue,
      selectedRoom,
      customRoom,
      carAccess,
      motoAccess,
      wifiAvailability,
      parkingSpaceAvailable,
      waterPumpSupply,
      electricityPower,
      securitySystem,
      waterWellSupply,
      surroundedByWalls,
      electricityJirama,
      waterPumpSupplyJirama,
      kitchenFacilities,
      airConditionerAvailable,
      swimmingPool,
      furnishedProperty,
      hotWaterAvailable,
      insideToilet,
      insideBathroom,
      elevator,
      garden,
      courtyard,
      balcony,
      roofTop,
      independentHouse,
      garage,
      guardianHouse,
      placardKitchen,
      bathtub,
      fireplace,
      fiberOpticReady,
      seaView,
      mountainView,
      panoramicView,
      solarPanels,
    }));
  }, [
    isRent,
    isSale,
    isColoc,
    budgetMax,
    budgetMin,
    rangeValue,
    selectedRoom,
    customRoom,
    carAccess,
    motoAccess,
    wifiAvailability,
    parkingSpaceAvailable,
    waterPumpSupply,
    electricityPower,
    securitySystem,
    waterWellSupply,
    surroundedByWalls,
    electricityJirama,
    waterPumpSupplyJirama,
    kitchenFacilities,
    airConditionerAvailable,
    swimmingPool,
    furnishedProperty,
    hotWaterAvailable,
    insideToilet,
    insideBathroom,
    elevator,
    garden,
    courtyard,
    balcony,
    roofTop,
    independentHouse,
    garage,
    guardianHouse,
    placardKitchen,
    bathtub,
    fireplace,
    fiberOpticReady,
    seaView,
    mountainView,
    panoramicView,
    solarPanels,
  ]);



  useEffect(() => {
    if (properties && properties.length > 0) {

      console.log("Search Form submited");

      let type;
      isRent === true ? (type = "rent") : (type = "sale");

      let numberOfRooms = (selectedRoom && selectedRoom.length > 0) ? selectedRoom.split("+")[0] : customRoom;

      const parameters = {
        type,
        budgetMax,
        budgetMin,
        numberOfRooms,
        motoAccess,
        carAccess,
        parkingSpaceAvailable,
        elevator,
        garden,
        courtyard,
        balcony,
        roofTop,
        swimmingPool,
        surroundedByWalls,
        independentHouse,
        garage,
        guardianHouse,
        kitchenFacilities,
        placardKitchen,
        insideToilet,
        insideBathroom,
        bathtub,
        fireplace,
        airConditionerAvailable,
        hotWaterAvailable,
        furnishedProperty,
        electricityPower,
        electricityJirama,
        waterPumpSupply,
        waterPumpSupplyJirama,
        waterWellSupply,
        securitySystem,
        wifiAvailability,
        fiberOpticReady,
        seaView,
        mountainView,
        panoramicView,
        solarPanels,
      };

      setSearchResults(searchProperty(parameters));
    }
  }, [
    isRent,
    budgetMax,
    budgetMin,
    selectedRoom,
    customRoom,
    motoAccess,
    carAccess,
    parkingSpaceAvailable,
    elevator,
    garden,
    courtyard,
    balcony,
    roofTop,
    swimmingPool,
    surroundedByWalls,
    independentHouse,
    garage,
    guardianHouse,
    kitchenFacilities,
    placardKitchen,
    insideToilet,
    insideBathroom,
    bathtub,
    fireplace,
    airConditionerAvailable,
    hotWaterAvailable,
    furnishedProperty,
    electricityPower,
    electricityJirama,
    waterPumpSupply,
    waterPumpSupplyJirama,
    waterWellSupply,
    securitySystem,
    wifiAvailability,
    fiberOpticReady,
    seaView,
    mountainView,
    panoramicView,
    solarPanels, searchForm]);

  useEffect(() => {
    if (properties) {
      setPriceRange(getPriceAndRentRanges(properties));
    }
  }, []);

  useEffect(() => {
    setBudgetMax(Math.max(...rangeValue));
    setBudgetMin(Math.min(...rangeValue));
  }, [rangeValue]);

useEffect(() => {
  if (!priceRange) return;

  // If we have Redux value, use it directly
  if (searchForm.rangeValue && searchForm.rangeValue[0] !== 0 && searchForm.rangeValue[1] !== 0) {
    setRangeValue(searchForm.rangeValue);
    return;
  }

  let startMin = 0;
  let startMax = 0;

  // Ending values
  const endMin = (isRent && priceRange.minRent) || (isSale && priceRange.minPrice) || 0;
  const endMax = (isRent && priceRange.maxRent) || (isSale && priceRange.maxPrice) || 0;

  // Animation speed
  const interval = 5;
  const stepMin = Math.ceil(endMin / 10);
  const stepMax = Math.ceil(endMax / 10);

  const intervalId = setInterval(() => {
    startMin = Math.min(startMin + stepMin, endMin);
    startMax = Math.min(startMax + stepMax, endMax);

    setRangeValue([startMin, startMax]);

    if (startMin >= endMin && startMax >= endMax) {
      clearInterval(intervalId);
    }
  }, interval);

  return () => clearInterval(intervalId);
}, [isRent, isSale, priceRange, searchForm.rangeValue]);




  return (
    <div className="create-listing">
      <div className="create-listing">
        <div className="site-section site-section-sm">
          <form method="post" onSubmit={handleSubmit}>
            <div className="container pb-3">
              <div id="nav-tab-rent" className="tab-pane fade show active">
                <>
                  <div
                    style={{
                      position: "relative",
                      border: "1px solid #ced4da",
                      borderRadius: "20px",
                      padding: "20px",
                    }}
                  >
                    <label
                      style={{
                        position: "absolute",
                        top: "-10px",
                        left: "15px",
                        background: "#fff",
                        padding: "0 6px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      Type d'offre
                    </label>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        flexWrap: "nowrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleRentClick}
                        style={{
                          minWidth: "100px",
                          padding: "10px 14px",
                          borderRadius: "16px",
                          border: isRent ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: isRent ? "#6b7280" : "#fff",
                          color: isRent ? "#fff" : "#333",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        <FaKey />
                        Location
                      </button>

                      <button
                        type="button"
                        onClick={() => alert("Fonctionnalité en cours de développement")}
                        style={{
                          minWidth: "100px",
                          padding: "10px 14px",
                          borderRadius: "16px",
                          border: isSale ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: isSale ? "#6b7280" : "#fff",
                          color: isSale ? "#fff" : "#333",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        <FaHome />
                        Vente
                      </button>

                      <button
                        type="button"
                        onClick={() => alert("Fonctionnalité en cours de développement")}
                        style={{
                          minWidth: "100px",
                          padding: "10px 14px",
                          borderRadius: "16px",
                          border: isColoc ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: isColoc ? "#6b7280" : "#fff",
                          color: isColoc ? "#fff" : "#333",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        <FaUsers />
                        Colocation
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      position: "relative",
                      borderRadius: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <label htmlFor="cardNumber" style={{ fontSize: "14px", color: "#6b7280" }}>
                      Votre budget {isRent && "(en Ar/mois)"} {isSale && "(en Ar)"}
                    </label>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Minimum */}
                      <div style={{ position: "relative", flex: "1 1 150px" }}>
                        <label
                          style={{
                            position: "absolute",
                            top: "-10px",
                            left: "15px",
                            background: "#fff",
                            padding: "0 6px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          Minimum Ar
                        </label>
                        <input
                          type="number"
                          placeholder="Minimum"
                          value={Math.min(...rangeValue) !== 0 ? Math.min(...rangeValue) : ""}
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "10px",
                            textAlign: "center",
                            fontSize: "13px",
                          }}
                          onChange={(e) =>
                            setRangeValue([
                              Number(e.target.value),
                              Math.max(...rangeValue),
                            ])
                          }
                        />
                      </div>

                      {/* Maximum */}
                      <div style={{ position: "relative", flex: "1 1 150px" }}>
                        <label
                          style={{
                            position: "absolute",
                            top: "-10px",
                            left: "15px",
                            background: "#fff",
                            padding: "0 6px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          Maximum Ar
                        </label>
                        <input
                          type="number"
                          placeholder="Maximum"
                          value={Math.max(...rangeValue) !== 0 ? Math.max(...rangeValue) : ""}
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "10px",
                            textAlign: "center",
                            fontSize: "13px",
                          }}
                          onChange={(e) =>
                            setRangeValue([
                              Math.min(...rangeValue),
                              Number(e.target.value),
                            ])
                          }
                        />
                      </div>
                    </div>

                    <RangeSlider
                      min={
                        priceRange
                          ? (isRent && priceRange.minRent) ||
                          (isSale && priceRange.minPrice)
                          : 0
                      }
                      max={
                        priceRange
                          ? (isRent && priceRange.maxRent) ||
                          (isSale && priceRange.maxPrice)
                          : 0
                      }
                      id="range-slider-yellow"
                      step={10000}
                      value={rangeValue}
                      onInput={setRangeValue}
                    />
                  </div>


                  <div
                    style={{
                      position: "relative",
                      border: "1px solid #ced4da",
                      borderRadius: "20px",
                      padding: "20px",
                      marginTop: "40px",
                    }}
                  >
                    <label
                      style={{
                        position: "absolute",
                        top: "-10px",
                        left: "15px",
                        background: "#fff",
                        padding: "0 6px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      Nombre de pièces
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <span style={{ width: "100px", fontWeight: "400" }}>Sélection :</span>

                      <div
                        style={{
                          display: "inline-flex",
                          gap: "6px",
                          flexWrap: "nowrap",
                          flex: 1,
                        }}
                      >
                        {["1+", "2+", "3+", "4+", "5+"].map((room) => (
                          <button
                            key={room}
                            type="button"
                            onClick={() => setSelectedRoom(room)}
                            style={{
                              minWidth: "50px",
                              padding: "6px 10px",
                              borderRadius: "16px",
                              border: selectedRoom === room ? "2px solid #6b7280" : "1px solid #999",
                              backgroundColor: selectedRoom === room ? "#6b7280" : "#fff",
                              color: selectedRoom === room ? "#fff" : "#333",
                              fontSize: "12px",
                              fontWeight: "500",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {room}
                          </button>
                        ))}
                      </div>

                      <input
                        type="number"
                        placeholder="Autre..."
                        value={customRoom}
                        onChange={(e) => setCustomRoom(e.target.value)}
                        style={{
                          minWidth: "80px",
                          padding: "6px 10px",
                          borderRadius: "16px",
                          border: "1px solid #999",
                          textAlign: "center",
                          fontSize: "12px",
                          flex: "0 0 auto",
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: "20px" }}>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        padding: "0 8px",
                        backgroundColor: "#fff",
                        marginBottom: "6px",
                      }}
                    >
                      <label htmlFor="cardNumber" style={{ fontSize: "14px", color: "#6b7280" }}>
                        Cliquez sur ce que vous souhaitez trouver :
                      </label>
                    </div>

                    <div
                      className="d-flex flex-wrap"
                      style={{
                        gap: "4px",
                        marginBottom: "12px",
                      }}
                    >
                      {/* ⚡ Eau & électricité */}
                      <GenerateCheckbox icon={<FaPlugCircleBolt />} state={electricityJirama} label={"Électricité JIRAMA"} onClickFunction={() => setElectricityJirama(!electricityJirama)} />
                      <GenerateCheckbox icon={<FaFaucetDrip />} state={waterPumpSupplyJirama} label={"Pompe JIRAMA"} onClickFunction={() => setWaterPumpSupplyJirama(!waterPumpSupplyJirama)} />
                      <GenerateCheckbox icon={<GiWell />} state={waterWellSupply} label={"Puits d'eau"} onClickFunction={() => setWaterWellSupply(!waterWellSupply)} />
                      <GenerateCheckbox icon={<FaPlugCircleCheck />} state={electricityPower} label={"Électricité privée"} onClickFunction={() => setElectricityPower(!electricityPower)} />
                      <GenerateCheckbox icon={<FaOilWell />} state={waterPumpSupply} label={"Pompe à eau privée"} onClickFunction={() => setWaterPumpSupply(!waterPumpSupply)} />
                      <GenerateCheckbox icon={<GiSolarPower />} state={solarPanels} label={"Panneaux solaires"} onClickFunction={() => setSolarPanels(!solarPanels)} />

                      {/* 🚪 Accessibilité & extérieur */}
                      <GenerateCheckbox icon={<FaMotorcycle />} state={motoAccess} label={"Accès moto"} onClickFunction={() => { setMotoAccess(!motoAccess); if (carAccess === true) setMotoAccess(true); }} />
                      <GenerateCheckbox icon={<FaCar />} state={carAccess} label={"Accès voiture"} onClickFunction={() => { setCarAccess(!carAccess); if (carAccess === false) setMotoAccess(true); }} />
                      <GenerateCheckbox icon={<GiBrickWall />} state={surroundedByWalls} label={"Clôturée"} onClickFunction={() => setSurroundedByWalls(!surroundedByWalls)} />
                      <GenerateCheckbox icon={<GiBrickWall />} state={courtyard} label={"Cour"} onClickFunction={() => setCourtyard(!courtyard)} />
                      <GenerateCheckbox icon={<FaParking />} state={parkingSpaceAvailable} label={"Parking"} onClickFunction={() => setParkingSpaceAvailable(!parkingSpaceAvailable)} />
                      <GenerateCheckbox icon={<FaCar />} state={garage} label={"Garage"} onClickFunction={() => setGarage(!garage)} />
                      <GenerateCheckbox icon={<GiWell />} state={garden} label={"Jardin"} onClickFunction={() => setGarden(!garden)} />
                      <GenerateCheckbox icon={<TbBuildingCastle />} state={independentHouse} label={"Indépendante"} onClickFunction={() => setIndependentHouse(!independentHouse)} />
                      <GenerateCheckbox icon={<FaShieldAlt />} state={guardianHouse} label={"Maison pour gardien"} onClickFunction={() => setGuardianHouse(!guardianHouse)} />

                      {/* 🏠 Confort intérieur */}
                      <GenerateCheckbox icon={<FaKitchenSet />} state={kitchenFacilities} label={"Cuisine équipée"} onClickFunction={() => setKitchenFacilities(!kitchenFacilities)} />
                      <GenerateCheckbox icon={<FaBed />} state={placardKitchen} label={"Cuisine placardée"} onClickFunction={() => setPlacardKitchen(!placardKitchen)} />
                      <GenerateCheckbox icon={<FaHotTub />} state={hotWaterAvailable} label={"Eau chaude"} onClickFunction={() => setHotWaterAvailable(!hotWaterAvailable)} />
                      <GenerateCheckbox icon={<MdOutlineLiving />} state={furnishedProperty} label={"Meublé"} onClickFunction={() => setFurnishedProperty(!furnishedProperty)} />
                      <GenerateCheckbox icon={<TbAirConditioning />} state={airConditionerAvailable} label={"Climatisation"} onClickFunction={() => setAirConditionerAvailable(!airConditionerAvailable)} />
                      <GenerateCheckbox icon={<GiBathtub />} state={bathtub} label={"Baignoire"} onClickFunction={() => setBathtub(!bathtub)} />
                      <GenerateCheckbox icon={<GiFireplace />} state={fireplace} label={"Cheminée"} onClickFunction={() => setFireplace(!fireplace)} />
                      <GenerateCheckbox icon={<TbBuildingCastle />} state={elevator} label={"Ascenseur"} onClickFunction={() => setElevator(!elevator)} />

                      {/* 🌇 Espaces extérieurs confort */}
                      <GenerateCheckbox icon={<MdBalcony />} state={balcony} label={"Balcon"} onClickFunction={() => setBalcony(!balcony)} />
                      <GenerateCheckbox icon={<GiCastle />} state={roofTop} label={"Toit terrasse"} onClickFunction={() => setRoofTop(!roofTop)} />
                      <GenerateCheckbox icon={<FaSwimmingPool />} state={swimmingPool} label={"Piscine"} onClickFunction={() => setSwimmingPool(!swimmingPool)} />

                      {/* 🛡️ Sécurité */}
                      <GenerateCheckbox icon={<FaShieldAlt />} state={securitySystem} label={"Système de sécurité"} onClickFunction={() => setSecuritySystem(!securitySystem)} />

                      {/* 🌐 Connectivité */}
                      <GenerateCheckbox icon={<FaWifi />} state={wifiAvailability} label={"Wi-Fi"} onClickFunction={() => setWifiAvailability(!wifiAvailability)} />
                      <GenerateCheckbox icon={<FaWifi />} state={fiberOpticReady} label={"Fibre optique"} onClickFunction={() => setFiberOpticReady(!fiberOpticReady)} />

                      {/* 🌅 Vue */}
                      <GenerateCheckbox icon={<GiSeaDragon />} state={seaView} label={"Vue mer"} onClickFunction={() => setSeaView(!seaView)} />
                      <GenerateCheckbox icon={<GiMountainCave />} state={mountainView} label={"Vue montagne"} onClickFunction={() => setMountainView(!mountainView)} />
                      <GenerateCheckbox icon={<GiSeatedMouse />} state={panoramicView} label={"Vue panoramique"} onClickFunction={() => setPanoramicView(!panoramicView)} />
                    </div>
                  </div>

                </>

                <div
                  style={{
                    position: "relative",
                    border: "1px solid #ced4da",
                    borderRadius: "20px",
                    padding: "20px",
                    marginTop: "20px",
                  }}
                >
                  <label
                    style={{
                      position: "absolute",
                      top: "-10px",
                      left: "15px",
                      background: "#fff",
                      padding: "0 6px",
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    Emplacement
                  </label>

                  {/* Ligne WC */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <small style={{ width: "80px", fontWeight: "400" }}>WC:</small>
                    <div
                      style={{
                        display: "inline-flex",
                        gap: "6px",
                        flexWrap: "nowrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setInsideToilet("all")}
                        style={{
                          minWidth: "60px",
                          padding: "6px 10px",
                          borderRadius: "16px",
                          border: insideToilet === "all" ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: insideToilet === "all" ? "#6b7280" : "#fff",
                          color: insideToilet === "all" ? "#fff" : "#333",
                          fontSize: "12px",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Tous
                      </button>

                      <button
                        type="button"
                        onClick={() => setInsideToilet(true)}
                        style={{
                          minWidth: "60px",
                          padding: "6px 10px",
                          borderRadius: "16px",
                          border: insideToilet === true ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: insideToilet === true ? "#6b7280" : "#fff",
                          color: insideToilet === true ? "#fff" : "#333",
                          fontSize: "12px",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Intérieur
                      </button>

                      <button
                        type="button"
                        onClick={() => setInsideToilet(false)}
                        style={{
                          minWidth: "60px",
                          padding: "6px 10px",
                          borderRadius: "16px",
                          border: insideToilet === false ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: insideToilet === false ? "#6b7280" : "#fff",
                          color: insideToilet === false ? "#fff" : "#333",
                          fontSize: "12px",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Extérieur
                      </button>
                    </div>
                  </div>

                  {/* Ligne Douche */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <small style={{ width: "80px", fontWeight: "400" }}>Douche:</small>
                    <div
                      style={{
                        display: "inline-flex",
                        gap: "6px",
                        flexWrap: "nowrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setInsideBathroom("all")}
                        style={{
                          minWidth: "60px",
                          padding: "6px 10px",
                          borderRadius: "16px",
                          border: insideBathroom === "all" ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: insideBathroom === "all" ? "#6b7280" : "#fff",
                          color: insideBathroom === "all" ? "#fff" : "#333",
                          fontSize: "12px",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Tous
                      </button>

                      <button
                        type="button"
                        onClick={() => setInsideBathroom(true)}
                        style={{
                          minWidth: "60px",
                          padding: "6px 10px",
                          borderRadius: "16px",
                          border: insideBathroom === true ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: insideBathroom === true ? "#6b7280" : "#fff",
                          color: insideBathroom === true ? "#fff" : "#333",
                          fontSize: "12px",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Intérieur
                      </button>

                      <button
                        type="button"
                        onClick={() => setInsideBathroom(false)}
                        style={{
                          minWidth: "60px",
                          padding: "6px 10px",
                          borderRadius: "16px",
                          border: insideBathroom === false ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: insideBathroom === false ? "#6b7280" : "#fff",
                          color: insideBathroom === false ? "#fff" : "#333",
                          fontSize: "12px",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Extérieur
                      </button>
                    </div>
                  </div>
                </div>


              </div>
            </div>
            {/* bottom mobile app–style navbar */}
            <div
              className="fixed-bottom bg-white shadow-sm"
              style={{
                position: "sticky",
                bottom: 0,
                borderTop: "1px solid #eee",
                padding: "0.5rem 1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {/* Results display (non-clickable) */}
              <div
                style={{
                  flex: 1,
                  borderRadius: "20px",
                  backgroundColor: "white",
                  border: (searchResults && searchResults.length > 0) ? "1px solid #ddd" : "",
                  color: (searchResults && searchResults.length > 0) ? "#333" : "red",
                  padding: (searchResults && searchResults.length > 0) ? "10px" : "",
                  textAlign: "center",
                  fontWeight: "500",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  userSelect: "none",
                  maxWidth: "200px",
                }}
              >
                {(searchResults && searchResults.length > 0)
                  ? `${searchResults.length} annonces`
                  : "Aucune trouvée"}
              </div>

              {/* Google map submit button */}
              <button
                type="submit"
                name="submitType"
                onClick={() => {
                  (searchResults && searchResults.length > 0)
                    ? handleCloseSlideClick()
                    : alert("Fonctionnalité en cours de développement")
                }}
                value="map"
                style={{
                  flex: 1,
                  borderRadius: "20px",
                  backgroundColor: "#222",
                  border: "none",
                  color: "white",
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  maxWidth: "200px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >

                {(searchResults && searchResults.length > 0)
                  ? <><FcGoogle size={20} /> Voir carte</>
                  : <><LuBellPlus size={20} /> Créer une alerte</>
                }
              </button>
            </div>


          </form>
        </div>
      </div>

    </div>
  );
};

export default HouseSearchForm;
