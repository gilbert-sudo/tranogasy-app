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
            <div className="container">
              <div id="nav-tab-rent" className="tab-pane fade show active">
                {!byNumber && (
                  <>
                    <div className="form-group">
                      <label htmlFor="cardNumber">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Type d'offre :</strong>
                      </label>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={handleRentClick}
                          style={{
                            flex: "1 1 20%",
                            padding: "12px 16px",
                            borderRadius: "20px",
                            border: isRent ? "2px solid #6b7280" : "1px solid #aaa",
                            backgroundColor: isRent ? "#6b7280" : "#fff",
                            color: isRent ? "#fff" : "#333",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                          }}
                        >
                          <FaKey />
                          Location
                        </button>

                        <button
                          type="button"
                          onClick={handleSaleClick}
                          style={{
                            flex: "1 1 20%",
                            padding: "12px 16px",
                            borderRadius: "20px",
                            border: isSale ? "2px solid #6b7280" : "1px solid #aaa",
                            backgroundColor: isSale ? "#6b7280" : "#fff",
                            color: isSale ? "#fff" : "#333",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                          }}
                        >
                          <FaHome />
                          Vente
                        </button>

                        <button
                          type="button"
                          onClick={handleColocClick}
                          style={{
                            flex: "1 1 20%",
                            padding: "12px 16px",
                            borderRadius: "20px",
                            border: isColoc ? "2px solid #6b7280" : "1px solid #aaa",
                            backgroundColor: isColoc ? "#6b7280" : "#fff",
                            color: isColoc ? "#fff" : "#333",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                          }}
                        >
                          <FaUsers />
                          Colocation
                        </button>
                      </div>
                    </div>


                    <div className="form-group">
                      <label htmlFor="cardNumber">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Votre budget {isRent && "(en Ar/mois)"}
                          {isSale && "(en Ar)"} :</strong> <br />
                      </label>
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px", marginBottom: "20px" }}>
                        {/* Minimum */}
                        <div style={{ position: "relative", flex: 1 }}>
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "15px",
                              background: "white",
                              padding: "0 6px",
                              fontSize: "13px",
                              color: "#333",
                            }}
                          >
                            Minimum Ar
                          </label>
                          <input
                            type="number"
                            placeholder="Minimum"
                            value={
                              Math.min(...rangeValue) !== 0 ? Math.min(...rangeValue) : ""
                            }
                            style={{
                              width: "100%",
                              border: "1px solid #999",
                              borderRadius: "20px",
                              padding: "12px",
                              textAlign: "center",
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
                        <div style={{ position: "relative", flex: 1 }}>
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "15px",
                              background: "white",
                              padding: "0 6px",
                              fontSize: "13px",
                              color: "#333",
                            }}
                          >
                            Maximum Ar
                          </label>
                          <input
                            type="number"
                            placeholder="Maximum"
                            value={
                              Math.max(...rangeValue) !== 0 ? Math.max(...rangeValue) : ""
                            }
                            style={{
                              width: "100%",
                              border: "1px solid #999",
                              borderRadius: "20px",
                              padding: "12px",
                              textAlign: "center",
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

                    <div className="form-group">
                      <label htmlFor="cardNumber">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Sélectionnez le nombre de pièces  :</strong> <br />
                      </label>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                          marginTop: "10px",
                        }}
                      >
                        {/* Exemple boutons pour sélectionner rapidement */}
                        {["1+", "2+", "3+", "4+", "5+"].map((room) => (
                          <button
                            key={room}
                            type="button"
                            onClick={() => setSelectedRoom(room)}
                            style={{
                              flex: "1 1 5%",
                              padding: "8px",
                              borderRadius: "20px",
                              border: selectedRoom === room ? "2px solid #6b7280" : "1px solid #999",
                              backgroundColor: selectedRoom === room ? "#6b7280" : "#fff",
                              color: selectedRoom === room ? "#fff" : "#333",
                              fontWeight: "500",
                              textAlign: "center",
                            }}
                          >
                            {room}
                          </button>
                        ))}

                        {/* Champ personnalisé */}
                        <input
                          type="number"
                          placeholder="Autre..."
                          value={customRoom}
                          onChange={(e) => setCustomRoom(e.target.value)}
                          style={{
                            flex: "1 1 45%",
                            padding: "10px",
                            borderRadius: "20px",
                            border: "1px solid #999",
                            textAlign: "center",
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardNumber">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>
                          Cliquez sur ce que vous souhaitez trouver :
                        </strong>
                      </label>

                      <div className="d-flex flex-wrap"
                        style={{
                          gap: "4px",
                          marginBottom: "12px",
                        }}>
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
                          onClickFunction={() =>
                            setWifiAvailability(!wifiAvailability)
                          }
                        />
                        <GenerateCheckbox
                          icon={<FaParking />}
                          state={parkingSpaceAvailable}
                          label={"Parking"}
                          onClickFunction={() =>
                            setParkingSpaceAvailable(!parkingSpaceAvailable)
                          }
                        />
                        <GenerateCheckbox
                          icon={<FaFaucetDrip />}
                          state={waterPumpSupplyJirama}
                          label={"Eau de la JI.RA.MA"}
                          onClickFunction={() =>
                            setWaterPumpSupplyJirama(!waterPumpSupplyJirama)
                          }
                        />
                        <GenerateCheckbox
                          icon={<FaOilWell />}
                          state={waterPumpSupply}
                          label={"Pompe à eau"}
                          onClickFunction={() =>
                            setWaterPumpSupply(!waterPumpSupply)
                          }
                        />
                        <GenerateCheckbox
                          icon={<GiWell />}
                          state={waterWellSupply}
                          label={"Un puits d'eau"}
                          onClickFunction={() =>
                            setWaterWellSupply(!waterWellSupply)
                          }
                        />
                        <GenerateCheckbox
                          icon={<FaPlugCircleBolt />}
                          state={electricityJirama}
                          label={"Électricité JI.RA.MA"}
                          onClickFunction={() =>
                            setElectricityJirama(!electricityJirama)
                          }
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
                    <div className="form-group" ref={advancedOptionRef}>
                      <label
                        data-toggle="tooltip"
                        title=""
                        data-original-title="le numéro de l'expéditeur"
                        className="text-light"
                      >
                        <span className="hidden-xs">
                          <small className="text-danger">NB:</small>{" "}
                          <small className="text-dark">
                            Cliquez ici pour{" "}
                            {!advancedOption ? "activer" : "désactiver"}{" "}
                            l'option avancee !
                          </small>
                        </span>
                      </label>
                      <p onClick={handleAdvancedOption}>
                        <switch
                          style={{ borderRadius: "10px" }}
                          className="text-success border border-dark p-1 mr-2"
                        // className="text-success border border-dark pl-5 pr-1 py-1 mr-2"
                        >
                          <minilabel
                            style={{
                              borderRadius: "10px",
                              zIndex: `${advancedOption ? "1" : "10"}`,
                              position: "relative",
                            }}
                            className={`text-light border px-2 ${advancedOption ? "bg-default" : "bg-secondary"
                              }`}
                          >
                            <small> Désactivé </small>
                          </minilabel>
                          <minilabel
                            style={{
                              borderRadius: "10px",
                              marginLeft: "-30px",
                              zIndex: `${advancedOption ? "10" : "1"}`,
                              position: "relative",
                            }}
                            className={`text-light border px-2 ${advancedOption ? "bg-success" : "bg-default"
                              }`}
                          >
                            <small> Activée </small>
                          </minilabel>
                        </switch>
                        <strong>Voir plus d'options</strong>
                      </p>
                    </div>
                  </>
                )}

                {advancedOption && !byNumber && (
                  <>
                    <div className="form-group">
                      <label htmlFor="cardNumber">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Emplacement du toilette (WC):</strong>
                      </label>
                      <div className="input-group">
                        <div className="btn-group" role="group">
                          <button
                            style={{ borderRadius: "10px" }}
                            type="button"
                            className={`btn btn-form mx-1 ${insideToilet === "all"
                              ? "btn-outline-secondary active"
                              : "btn-outline-secondary"
                              }`}
                            onClick={() => {
                              setInsideToilet("all");
                            }}
                          >
                            <b>Tous</b>
                          </button>
                          <button
                            style={{ borderRadius: "10px" }}
                            type="button"
                            className={`btn btn-form mr-1 ${insideToilet === true
                              ? "btn-outline-secondary active"
                              : "btn-outline-secondary"
                              }`}
                            onClick={() => {
                              setInsideToilet(true);
                            }}
                          >
                            <b>Intérieur</b>
                          </button>
                          <button
                            type="button"
                            style={{ borderRadius: "10px" }}
                            className={`btn btn-form mr-1 ${!insideToilet
                              ? "btn-outline-secondary active"
                              : "btn-outline-secondary"
                              }`}
                            onClick={() => {
                              setInsideToilet(false);
                            }}
                          >
                            <b>Extérieur</b>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="cardNumber">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Emplacement de la douche :</strong>
                      </label>
                      <div className="input-group">
                        <div className="btn-group" role="group">
                          <button
                            style={{ borderRadius: "10px" }}
                            type="button"
                            className={`btn btn-form mx-1 ${insideBathroom === "all"
                              ? "btn-outline-secondary active"
                              : "btn-outline-secondary"
                              }`}
                            onClick={() => {
                              setInsideBathroom("all");
                            }}
                          >
                            <b>Tous</b>
                          </button>
                          <button
                            style={{ borderRadius: "10px" }}
                            type="button"
                            className={`btn btn-form mr-1 ${insideBathroom === true
                              ? "btn-outline-secondary active"
                              : "btn-outline-secondary"
                              }`}
                            onClick={() => {
                              setInsideBathroom(true);
                            }}
                          >
                            <b>Intérieur</b>
                          </button>
                          <button
                            type="button"
                            style={{ borderRadius: "10px" }}
                            className={`btn btn-form mr-1 ${!insideBathroom
                              ? "btn-outline-secondary active"
                              : "btn-outline-secondary"
                              }`}
                            onClick={() => {
                              setInsideBathroom(false);
                            }}
                          >
                            <b>Extérieur</b>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
