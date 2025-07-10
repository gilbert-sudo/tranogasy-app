import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useSelector, useDispatch } from "react-redux";
import RangeSlider from "react-range-slider-input";
import "./css/range-slider.css";
import "react-range-slider-input/dist/style.css";
import {
  setReduxByNumber,
  setReduxPropertyNumber,
  setReduxSelectedCity,
  setReduxSelectedCommune,
  setReduxSelectedDistrict,
} from "../redux/redux";
import { useProperty } from "../hooks/useProperty";
import { useMap } from "../hooks/useMap";
import RoomSelector from "./RoomSelector";

import { offlineLoader } from "../hooks/useOfflineLoader";

import { MdOutlineEditLocation, MdOutlineLiving } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import {
  GiCheckMark,
  GiCircle,
  GiWell,
  GiBrickWall,
  GiSmokeBomb,
} from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle } from "react-icons/tb";
import {
  FaCar,
  FaMotorcycle,
  FaWifi,
  FaParking,
  FaShieldAlt,
  FaSwimmingPool,
  FaHotTub,
  FaHome,
  FaKey,
  FaUsers,
} from "react-icons/fa";
import {
  FaFaucetDrip,
  FaPlugCircleBolt,
  FaPlugCircleCheck,
  FaOilWell,
  FaKitchenSet,
} from "react-icons/fa6";

const HouseSearchForm = () => {
  const targetDivRef = useRef(null);
  const advancedOptionRef = useRef(null);

  const searchForm = useSelector((state) => state.searchForm);
  const properties = useSelector((state) => state.properties);
  const [mapData, setMapData] = useState({
    fokotanyList: null,
    communeList: null,
    districtList: null,
  });

  const dispatch = useDispatch();
  const [, setLocation] = useLocation("");

  const [selectedMapType, setSelectedMapType] = useState("district");
  const [mapInputOnFocus, setMapInputOnFocus] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(
    searchForm.selectedDistrict
  );
  const [selectedCommune, setSelectedCommune] = useState(
    searchForm.selectedCommune
  );
  const [selectedCity, setSelectedCity] = useState(searchForm.selectedCity);
  const [gmapValue, setGmapValue] = useState(null);
  const [budgetMax, setBudgetMax] = useState(null);
  const [budgetMin, setBudgetMin] = useState(null);
  const [advancedOption, setAdvancedOption] = useState(false);

  const { loadMap } = offlineLoader();
  const { findLocationsWithinDistance } = useMap();
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

  const [byNumber, setByNumber] = useState(searchForm.byNumber);
  const [propertyNumber, setPropertyNumber] = useState(
    searchForm.propertyNumber
  );
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
  const [furnishedProperty, setFurnishedProperty] = useState(false);
  const [airConditionerAvailable, setAirConditionerAvailable] = useState(false);
  const [hotWaterAvailable, setHotWaterAvailable] = useState(false);
  const [smokeDetectorsAvailable, setSmokeDetectorsAvailable] = useState(false);
  const [terrace, setTerrace] = useState(false);
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [insideToilet, setInsideToilet] = useState("all");
  const [insideBathroom, setInsideBathroom] = useState("all");
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


  useEffect(() => {
    const pageLoader = async () => {
      if (!mapData.fokotanyList || !mapData.districtList) {
        try {
          const result = await loadMap();
          console.log(result);

          setMapData(result); // Log the result after it's resolved
        } catch (error) {
          console.error(error);
        }
      }
    };

    pageLoader();
  }, [mapData]);

  useEffect(() => {
    if (selectedDistrict) {
      setSelectedMapType("district");
    } else if (selectedCommune) {
      setSelectedMapType("commune");
    } else if (selectedCity) {
      setSelectedMapType("fokotany");
    }
  }, []);

  // Callback function for handling the selected item's _id
  const handleDistrictSelected = (itemId) => {
    setMapInputOnFocus(false);
    console.log("Selected district:", itemId);
    setSelectedDistrict(itemId);
    dispatch(setReduxSelectedDistrict({ selectedDistrict: itemId }));
  };

  const handleCommuneSelected = (itemId) => {
    setMapInputOnFocus(false);
    console.log("Selected commune:", itemId);
    setSelectedCommune(itemId);
    dispatch(setReduxSelectedCommune({ selectedCommune: itemId }));
  };

  const handleItemSelected = (itemId) => {
    setMapInputOnFocus(false);
    console.log("Selected item _id:", itemId);
    setSelectedCity(itemId);
    dispatch(setReduxSelectedCity({ selectedCity: itemId }));
  };

  const handleGmapSelected = () => {
    setMapInputOnFocus(false);
    // console.log("Selected item _id:", itemId);
    // dispatch(setReduxSelectedCity({ selectedCity: itemId }));
    setTimeout(() => {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const onMapInputFocus = () => {
    setMapInputOnFocus(true);
    // Queue the subsequent code to be executed in the next tick
    setTimeout(() => {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleAdvancedOption = () => {
    setAdvancedOption(!advancedOption);
    setTimeout(() => {
      advancedOptionRef.current.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  // function to handle the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMapInputOnFocus(false);

    const submitType = e.nativeEvent.submitter.value; // Get the value of the clicked button

    console.log("Search Form submited");

    let type;
    let nearbyLocations = [];
    isRent === true ? (type = "rent") : (type = "sale");

    let fokontany;
    if (selectedCity) {
      fokontany = selectedCity._id;
    } else {
      fokontany = null;
    }

    if (selectedMapType === "gmap") {
      nearbyLocations = findLocationsWithinDistance(
        mapData.fokotanyList,
        searchForm.gmapValue.circleCenter,
        searchForm.gmapValue.circleRadius
      ).sort((a, b) => a.distance - b.distance);
    }

    let numberOfRooms = (selectedRoom && selectedRoom.length > 0) ? selectedRoom.split("+")[0] : customRoom;

    const parameters = {
      submitType,
      selectedMapType,
      type,
      budgetMax,
      budgetMin,
      numberOfRooms,
      fokontany,
      selectedDistrict,
      selectedCommune,
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
      furnishedProperty,
      hotWaterAvailable,
      airConditionerAvailable,
      smokeDetectorsAvailable,
      terrace,
      swimmingPool,
      insideToilet,
      insideBathroom,
      byNumber,
      propertyNumber,
      nearbyLocations,
    };
    console.log(parameters);

    if ((selectedCity || selectedDistrict || selectedCommune || selectedMapType === "gmap") && !byNumber) {
      searchProperty(parameters);
      if (submitType === "list") setLocation("/searchResult");
      if (submitType === "map") setLocation("/tranogasyMap");
    } else {
      onMapInputFocus();
    }
  };

  useEffect(() => {
    if (properties && properties.length > 0 && (selectedCity || selectedDistrict || selectedCommune || selectedMapType === "gmap")) {

      console.log("Search Form submited");

      let type;
      let nearbyLocations = [];
      isRent === true ? (type = "rent") : (type = "sale");

      let fokontany;
      if (selectedCity) {
        fokontany = selectedCity._id;
      } else {
        fokontany = null;
      }

      if (selectedMapType === "gmap") {
        nearbyLocations = findLocationsWithinDistance(
          mapData.fokotanyList,
          searchForm.gmapValue.circleCenter,
          searchForm.gmapValue.circleRadius
        ).sort((a, b) => a.distance - b.distance);
      }

      let numberOfRooms = (selectedRoom && selectedRoom.length > 0) ? selectedRoom.split("+")[0] : customRoom;

      const parameters = {
        selectedMapType,
        type,
        budgetMax,
        budgetMin,
        numberOfRooms,
        fokontany,
        selectedDistrict,
        selectedCommune,
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
        furnishedProperty,
        hotWaterAvailable,
        airConditionerAvailable,
        smokeDetectorsAvailable,
        terrace,
        swimmingPool,
        insideToilet,
        insideBathroom,
        byNumber,
        propertyNumber,
        nearbyLocations,
      };

      setSearchResults(searchProperty(parameters));
    }
  }, [
    selectedMapType,
    isRent,
    budgetMax,
    budgetMin,
    selectedRoom,
    customRoom,
    selectedCity,
    selectedDistrict,
    selectedCommune,
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
    furnishedProperty,
    hotWaterAvailable,
    airConditionerAvailable,
    smokeDetectorsAvailable,
    terrace,
    swimmingPool,
    insideToilet,
    insideBathroom,
    byNumber,
    propertyNumber,
    selectedMapType, searchForm]);

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
    let startMin = 0;
    let startMax = 0;

    // Define ending values based on conditions
    const endMin = priceRange
      ? (isRent && priceRange.minRent) || (isSale && priceRange.minPrice)
      : 0;
    const endMax = priceRange
      ? (isRent && priceRange.maxRent) || (isSale && priceRange.maxPrice)
      : 0;

    // Define faster animation speed
    const interval = 5; // Faster interval (lower value = quicker updates)
    const stepMin = Math.ceil(endMin / 10); // Larger step size for quicker animation
    const stepMax = Math.ceil(endMax / 10);

    const intervalId = setInterval(() => {
      // Increment startMin and startMax
      startMin = Math.min(startMin + stepMin, endMin);
      startMax = Math.min(startMax + stepMax, endMax);

      setRangeValue([startMin, startMax]);

      // Stop the animation when end values are reached
      if (startMin >= endMin && startMax >= endMax) {
        clearInterval(intervalId);
      }
    }, interval);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [isRent, isSale]);



  return (
    <div className="create-listing">
      <div className="create-listing">
        <div className="site-section site-section-sm">
          <form method="post" onSubmit={handleSubmit}>
            <div className="container pb-3">
              <div id="nav-tab-rent" className="tab-pane fade show active">
                {!byNumber && (
                  <>
                    <div
                      style={{
                        position: "relative",
                        border: "1px solid #6b7280",
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
                          onClick={handleSaleClick}
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
                          onClick={handleColocClick}
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
                        border: "1px solid #6b7280",
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
                        <span style={{ width: "100px", fontWeight: "500" }}>Sélection :</span>

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
                        <GenerateCheckbox
                          icon={<FaMotorcycle />}
                          state={motoAccess}
                          label={"Accès moto"}
                          onClickFunction={() => {
                            setMotoAccess(!motoAccess);
                            if (carAccess === true) setMotoAccess(true);
                          }}
                        />
                        <GenerateCheckbox
                          icon={<FaCar />}
                          state={carAccess}
                          label={"Accès voiture"}
                          onClickFunction={() => {
                            setCarAccess(!carAccess);
                            if (carAccess === false) setMotoAccess(true);
                          }}
                        />
                        <GenerateCheckbox
                          icon={<FaWifi />}
                          state={wifiAvailability}
                          label={"Wi-Fi"}
                          onClickFunction={() => setWifiAvailability(!wifiAvailability)}
                        />
                        <GenerateCheckbox
                          icon={<FaParking />}
                          state={parkingSpaceAvailable}
                          label={"Parking"}
                          onClickFunction={() => setParkingSpaceAvailable(!parkingSpaceAvailable)}
                        />
                        <GenerateCheckbox
                          icon={<FaFaucetDrip />}
                          state={waterPumpSupplyJirama}
                          label={"Eau de la JI.RA.MA"}
                          onClickFunction={() => setWaterPumpSupplyJirama(!waterPumpSupplyJirama)}
                        />
                        <GenerateCheckbox
                          icon={<FaOilWell />}
                          state={waterPumpSupply}
                          label={"Pompe à eau"}
                          onClickFunction={() => setWaterPumpSupply(!waterPumpSupply)}
                        />
                        <GenerateCheckbox
                          icon={<GiWell />}
                          state={waterWellSupply}
                          label={"Un puits d'eau"}
                          onClickFunction={() => setWaterWellSupply(!waterWellSupply)}
                        />
                        <GenerateCheckbox
                          icon={<FaPlugCircleBolt />}
                          state={electricityJirama}
                          label={"Électricité JI.RA.MA"}
                          onClickFunction={() => setElectricityJirama(!electricityJirama)}
                        />
                        <GenerateCheckbox
                          icon={<FaPlugCircleCheck />}
                          state={electricityPower}
                          label={"Électricité privée"}
                          onClickFunction={() =>
                            setElectricityPower(!electricityPower)
                          }
                        />
                        <GenerateCheckbox
                          icon={<GiBrickWall />}
                          state={surroundedByWalls}
                          label={"Clôturé"}
                          onClickFunction={() =>
                            setSurroundedByWalls(!surroundedByWalls)
                          }
                        />
                        <GenerateCheckbox
                          icon={<FaShieldAlt />}
                          state={securitySystem}
                          label={"Sécurisé"}
                          onClickFunction={() =>
                            setSecuritySystem(!securitySystem)
                          }
                        />
                        <GenerateCheckbox
                          icon={<TbBuildingCastle />}
                          state={terrace}
                          label={"Terrasse."}
                          onClickFunction={() => setTerrace(!terrace)}
                        />
                        <GenerateCheckbox
                          icon={<FaSwimmingPool />}
                          state={swimmingPool}
                          label={"Piscine."}
                          onClickFunction={() => setSwimmingPool(!swimmingPool)}
                        />
                        <GenerateCheckbox
                          icon={<FaKitchenSet />}
                          state={kitchenFacilities}
                          label={"Cuisine déjà équipée"}
                          onClickFunction={() =>
                            setKitchenFacilities(!kitchenFacilities)
                          }
                        />
                        <GenerateCheckbox
                          icon={<MdOutlineLiving />}
                          state={furnishedProperty}
                          label={"Logement Meublé"}
                          onClickFunction={() =>
                            setFurnishedProperty(!furnishedProperty)
                          }
                        />
                        <GenerateCheckbox
                          icon={<FaHotTub />} // Hot water icon
                          state={hotWaterAvailable}
                          label={"Eau chaude"} // Appropriate label in French
                          onClickFunction={() => {
                            setHotWaterAvailable(!hotWaterAvailable);
                          }}
                        />
                        <GenerateCheckbox
                          icon={<TbAirConditioning />}
                          state={airConditionerAvailable}
                          label={"Climatiseur"}
                          onClickFunction={() =>
                            setAirConditionerAvailable(!airConditionerAvailable)
                          }
                        />
                        <GenerateCheckbox
                          icon={<GiSmokeBomb />}
                          state={smokeDetectorsAvailable}
                          label={"Détecteurs de fumée"}
                          onClickFunction={() =>
                            setSmokeDetectorsAvailable(!smokeDetectorsAvailable)
                          }
                        />
                      </div>
                    </div>

                  </>
                )}

                <div
                  style={{
                    position: "relative",
                    border: "1px solid #6b7280",
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
                    <span style={{ width: "80px", fontWeight: "500" }}>WC:</span>
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
                        Int
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
                        Ext
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
                    <span style={{ width: "80px", fontWeight: "500" }}>Douche:</span>
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
                        Int
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
                        Ext
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
                  borderRadius: "12px",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  color: "#333",
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "500",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  userSelect: "none",
                  maxWidth: "200px",
                }}
              >
                {byNumber
                  ? "Chercher"
                  : (selectedCity || selectedDistrict || selectedCommune || selectedMapType === "gmap")
                    ? (searchResults && searchResults.length > 0)
                      ? `${searchResults.length} résultats`
                      : "Aucune trouvée"
                    : `${properties && properties.length} annonces`}
              </div>

              {/* Google map submit button */}
              {!byNumber && (
                <button
                  type="submit"
                  name="submitType"
                  value="map"
                  style={{
                    flex: 1,
                    borderRadius: "12px",
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
                  disabled={
                    !(searchResults && searchResults.length > 0) ||
                    !(selectedCity || selectedDistrict || selectedCommune || selectedMapType === "gmap")
                  }
                >
                  <FcGoogle size={20} /> Voir carte
                </button>
              )}
            </div>


          </form>
        </div>
      </div>

    </div>
  );
};

export default HouseSearchForm;
