import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useProperty } from "../hooks/useProperty";
import { useMap as useLocalMapHook } from "../hooks/useMap";
import { offlineLoader } from "../hooks/useOfflineLoader";
import NotLogedIn from "../components/NotLogedIn";
import PropertyExistsCard from "../components/PropertyExistsCard";
import RentInput from "../components/RentInput";
import GoogleAutosuggestInput from '../components/GoogleAutosuggestInput';
import PhoneInput from "../components/PhoneInput";

import PropertyDetailsPage from "./PropertyDetailsPage";


import { MdOutlineEditLocation, MdArrowBackIos, MdOutlineLiving, MdBalcony, MdLocationOn, MdLandscape, MdOutlineFiberSmartRecord } from "react-icons/md";
import {
  GiCheckMark,
  GiCircle,
  GiWell,
  GiBrickWall,
  GiFireplace, GiBathtub, GiSolarPower, GiMountainCave, GiSeatedMouse, GiSeaDragon, GiCastle
} from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle, TbWash } from "react-icons/tb";
import { ImCircleDown } from "react-icons/im";
import {
  FaCar,
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
  FaDollarSign,
  FaHouseChimney,
  FaBuilding,
} from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";


import ImageUploader from "../components/ImageUploader";
import PropertyLocationSelector from "../components/PropertyLocationSelector";
import Swal from "sweetalert2";

import {
  APIProvider,
} from "@vis.gl/react-google-maps";

const CreateListing = () => {
  const myRef = useRef(null);
  const floorRef = useRef(null);

  const user = useSelector((state) => state.user);
  const imgState = useSelector((state) => state.img);
  const [mapData, setMapData] = useState(null);
  const [recoveryData, setRecoveryData] = useState(null);

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [rent, setRent] = useState(null);
  const [price, setPrice] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [coords, setCoords] = useState(null);
  const [rooms, setRooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [area, setArea] = useState(0);
  const [toilet, setToilet] = useState(0);
  const [kitchen, setKitchen] = useState(0);
  const [livingRoom, setLivingRoom] = useState(0);
  const [phone1, setPhone1] = useState(user.phone);
  const [phone2, setPhone2] = useState(null);
  const [phone3, setPhone3] = useState(null);
  const [showPhone3, setShowPhone3] = useState(false);

  const { loadMap } = offlineLoader();
  const { addProperty, checkPropertyAlreadyExistsLocal, isLoading } = useProperty();
  const { findLocationsWithinDistance } = useLocalMapHook();
  const { deleteDirectlyProperty } = useProperty();

  const [isRent, setIsRent] = useState(true);
  const [isSale, setIsSale] = useState(false);
  const [isColoc, setIsColoc] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(false);

  const [houseType, setHouseType] = useState("maison");
  const [floor, setFloor] = useState("");
  const [floorError, setFloorError] = useState(false);
  const [propertyExistsCard, setPropertyExistsCard] = useState(null);
  const [isSliderVisible, setIsSlideVisible] = useState(false);

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
  const [insideToilet, setInsideToilet] = useState(true);
  const [insideBathroom, setInsideBathroom] = useState(true);
  const [elevator, setElevator] = useState(false);
  const [garden, setGarden] = useState(false);
  const [courtyard, setCourtyard] = useState(false);
  const [balcony, setBalcony] = useState(false);
  const [roofTop, setRoofTop] = useState(false);
  const [independentHouse, setIndependentHouse] = useState(false);
  const [garage, setGarage] = useState(false);
  const [guardianHouse, setGuardianHouse] = useState(false);
  const [bassin, setBassin] = useState(false);
  const [placardKitchen, setPlacardKitchen] = useState(false);
  const [bathtub, setBathtub] = useState(false);
  const [fireplace, setFireplace] = useState(false);
  const [fiberOpticReady, setFiberOpticReady] = useState(false);
  const [seaView, setSeaView] = useState(false);
  const [mountainView, setMountainView] = useState(false);
  const [panoramicView, setPanoramicView] = useState(false);
  const [solarPanels, setSolarPanels] = useState(false);


  const [imageError, setImageError] = useState(false);
  const [noFeatureSet, setNoFeatureSet] = useState(false);

  const [pendingNewProperty, setPendingNewProperty] = useState(null);



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

  const handleCloseSlideClick = () => {
    setIsSlideVisible(false);
  };

  useEffect(() => {
    const pageLoader = async () => {
      if (!mapData) {
        try {
          const result = await loadMap();
          setMapData(result.fokotanyList); // Log the result after it's resolved
        } catch (error) {
          console.error(error);
        }
      }
    };
    // console.log(mapData);
    pageLoader();
  }, [mapData]);

  // function to handle the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submited");

    let type;
    isRent === true ? (type = "rent") : (type = "sale");

    const city = selectedCity._id;
    const owner = user._id;
    const images = imgState;

    const anyFeatureSelected = () => {
      return [
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
        bassin,
        kitchenFacilities,
        placardKitchen,
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
      ].some(Boolean);
    };

    if (!anyFeatureSelected()) {
      setNoFeatureSet(true);
      myRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    } else {
      setNoFeatureSet(false);
    }

    if (images.length === 0) {
      setImageError(true);
      return;
    } else {
      setImageError(false);
    }

    if (houseType === "appartement" && !floor) {
      setFloorError(true);
      setTimeout(() => {
        setFloorError(false);
      }, 5000);
      floorRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    } else {
      setFloorError(false);
    }

    const newPhone2 = phone2 ? phone2 : phone3;
    const newPhone3 = phone3 && phone3 !== newPhone2 ? phone3 : null;

    const newProperty = {
      title,
      description,
      city,
      selectedCity,
      price,
      rent,
      rooms,
      bathrooms,
      area,
      type,
      toilet,
      kitchen,
      livingRoom,
      images,
      owner,
      houseType,
      floor: houseType === "appartement" ? floor : null,
      phone1,
      phone2: newPhone2,
      phone3: newPhone3,
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
      bassin,
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

    const checkingResult = checkPropertyAlreadyExistsLocal(newProperty);

    if (checkingResult.alreadyExists) {
      setPendingNewProperty(newProperty);
      setPropertyExistsCard(checkingResult.bestMatch);
      console.log({ original: newProperty, checkingResult });
    } else {
      addProperty(newProperty);
    };
  };

  const handlePursueTheSubmit = (bypass) => {
    addProperty(pendingNewProperty);
    setPropertyExistsCard(null);
    console.log("Create a new listing for ", pendingNewProperty);
    if (!bypass) {
      deleteDirectlyProperty(propertyExistsCard);
    }
  }

  useEffect(() => {
    if (isLoading) {
      // Display the alert
      Swal.fire({
        imageUrl: "images/loading-house.gif",
        html: `<p style={{ fontWeight: "400" }}> En train de créer votre annonce </p>`,
        allowOutsideClick: false,
        showConfirmButton: false,
      });
    }
    let nearbyLocations = [];
    if (coords) {
      nearbyLocations = findLocationsWithinDistance(
        mapData,
        coords,
        15000
      ).sort((a, b) => a.distance - b.distance);

      let selectedCityIsNearby = null;

      if (selectedCity) {
        selectedCityIsNearby = (nearbyLocations.length > 2) ? nearbyLocations.slice(0, 2).find((nearbyLocation) => nearbyLocation.location._id === selectedCity._id) : nearbyLocations.find((nearbyLocation) => nearbyLocation.location._id === selectedCity._id);
      }

      // console.log(nearbyLocations.slice(0, 3), selectedCityIsNearby);
      if (nearbyLocations.length > 0) {
        if (!selectedCityIsNearby) {
          setCoords(null);
          setSelectedCity(nearbyLocations[0].location);
        }
      }
    }
  }, [isLoading, coords]);

  useEffect(() => {
    if (selectedCity) {
      console.log("Selected city changed:", selectedCity);  

      let nearbyLocations = [];
      if (selectedCity.isGoogleResult === true && selectedCity.coords) {
        nearbyLocations = findLocationsWithinDistance(
          mapData,
          selectedCity.coords,
          15000
        ).sort((a, b) => a.distance - b.distance);
        const selectedCityIsNearby = (nearbyLocations.length > 2) ? nearbyLocations.slice(0, 2).find((nearbyLocation) => nearbyLocation.location._id === selectedCity._id) : nearbyLocations.find((nearbyLocation) => nearbyLocation.location._id === selectedCity._id);
        // console.log(nearbyLocations.slice(0, 3), selectedCityIsNearby);
        if (nearbyLocations.length > 0) {
          if (!selectedCityIsNearby) setSelectedCity(nearbyLocations[0].location);
        }
      }
    }
  }, [selectedCity]);


  return (
    <div
      className="create-listing"
    >
      {user && user ? (
        <div className="create-listing mt-5 pt-3 position-relative">
          <div className="site-section site-section-sm">
            <form action="#" method="post" onSubmit={handleSubmit}>
              <div className="container" style={{ paddingBottom: "80px" }}>
                <h6 className="font-weight-light text-uppercase mb-4">
                  Créer une annonce :
                </h6>
                <div id="nav-tab-rent" className="tab-pane fade show active">
                  <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#333",
                        marginLeft: "10px",
                      }}
                    >
                      Un titre <i className="fa fa-question-circle" style={{ fontSize: "13px" }} />
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="Donnez un titre à votre annonce"
                      style={{
                        width: "100%",
                        border: "1px solid #ced4da",
                        borderRadius: "20px",
                        padding: "15px",
                        fontSize: "16px",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#6b7280")}
                      onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group position-relative mb-4">
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#333",
                        marginLeft: "10px",
                      }}
                    >
                      L'endroit où se trouve la propriété
                    </label>
                    {!selectedCity && (
                      <APIProvider apiKey="AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs">
                          <GoogleAutosuggestInput onPlaceSelect={setCoords} />
                      </APIProvider>
                    )}

                    {selectedCity && (
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "16px",
                          padding: "20px",
                          marginTop: "10px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        {/* Petit icône map en haut */}
                        <MdLocationOn
                          style={{
                            fontSize: "28px",
                            color: "#6b7280",
                            marginBottom: "6px",
                          }}
                        />

                        <div
                          style={{
                            border: "1px solid #6b7280",
                            borderRadius: "12px",
                            color: "#333",
                            padding: "14px 20px",
                            textAlign: "center",
                            backgroundColor: "#f9fafb",
                            width: "100%",
                            fontSize: "15px",
                            fontWeight: "500",
                            lineHeight: "1.4",
                          }}
                        >
                          <b>{`${selectedCity.fokontany}, ${selectedCity.commune.charAt(0).toUpperCase() + selectedCity.commune.slice(1)}`}</b>
                          <br />
                          <small style={{ fontSize: "13px", color: "#6b7280" }}>
                            {`${selectedCity.district.toUpperCase()} (${selectedCity.region})`}
                          </small>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCity(null);
                            setCoords(null);
                          }}
                          style={{
                            marginTop: "15px",
                            border: "none",
                            backgroundColor: "#6b7280",
                            color: "#fff",
                            borderRadius: "30px",
                            padding: "10px 18px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            transition: "background 0.2s, transform 0.1s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#525c6b")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6b7280")}
                          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          Changer <MdOutlineEditLocation style={{ fontSize: "18px" }} />
                        </button>
                      </div>
                    )}
                  </div>
                  {selectedCity && (
                    <div className="form-group">
                      <label
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontWeight: "600",
                          fontSize: "14px",
                          color: "#333",
                          marginLeft: "10px",
                          marginRight: "10px",
                          marginBottom: "15px",
                        }}
                      >
                        Si vous le souhaitez, vous pouvez indiquer sur la carte l'emplacement exact de la propriété en cliquant.
                      </label>
                      <PropertyLocationSelector
                        defaultPosition={
                          coords
                            ? coords
                            : selectedCity.coords
                        }
                        setCoords={setCoords}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      position: "relative",
                      border: "1px solid #6b7280",
                      borderRadius: "20px",
                      padding: "20px",
                      marginTop: "20px",
                      marginBottom: "20px",
                      backgroundColor: "#fff",
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
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      Une description
                      <i className="fa fa-question-circle" style={{ fontSize: "14px" }} />
                    </label>

                    <textarea
                      required
                      id="exampleFormControlTextarea1"
                      rows={5}
                      placeholder="Donnez plus de détails pour attirer les visiteurs (500 caractères max)"
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        borderRadius: "16px",
                        padding: "10px",
                        fontSize: "16px",
                        resize: "vertical",
                      }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>


                  <div
                    ref={floorRef}
                    style={{
                      position: "relative",
                      border: "1px solid #ced4da",
                      borderRadius: "20px",
                      padding: "20px",
                      marginBottom: "15px",
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

                    {/* First row: Location, Vente, Colocation */}
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
                        <FaDollarSign />
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
                        <FaUsers style={{ minWidth: "20px" }} />
                        Colocation
                      </button>
                    </div>

                    {/* Second row title */}
                    <div
                      style={{
                        marginTop: "14px",
                        marginBottom: "4px",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#6b7280",
                        textAlign: "left",
                        paddingLeft: "4px",
                      }}
                    >
                      Plus de critères :
                    </div>

                    {/* Second row: Maison / Appartement */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: "10px",
                        flexWrap: "nowrap",
                        marginTop: "10px",
                        paddingLeft: "15px"
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setHouseType("maison")}
                        style={{
                          minWidth: "100px",
                          minHeight: "80px",
                          padding: "10px 10px",
                          borderRadius: "16px",
                          border: houseType === "maison" ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: houseType === "maison" ? "#6b7280" : "#fff",
                          color: houseType === "maison" ? "#fff" : "#333",
                          fontWeight: "500",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          fontSize: "13px",
                        }}
                      >
                        <FaHouseChimney size={20} />
                        Maison
                      </button>

                      <button
                        type="button"
                        onClick={() => setHouseType("appartement")}
                        style={{
                          minWidth: "100px",
                          minHeight: "80px",
                          padding: "10px 10px",
                          borderRadius: "16px",
                          border: houseType === "appartement" ? "2px solid #6b7280" : "1px solid #aaa",
                          backgroundColor: houseType === "appartement" ? "#6b7280" : "#fff",
                          color: houseType === "appartement" ? "#fff" : "#333",
                          fontWeight: "500",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          fontSize: "13px",
                        }}
                      >
                        <FaBuilding size={20} />
                        Appartement
                      </button>
                    </div>

                    {/* Étage input */}
                    {houseType === "appartement" &&
                      <div style={{ marginTop: "14px" }}>
                        <label
                          style={{
                            fontSize: "14px",
                            color: "#6b7280",
                            marginBottom: "6px",
                            display: "block",
                          }}
                        >
                          Étage
                        </label>

                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            marginTop: "8px",
                            paddingLeft: "15px"
                          }}
                        >
                          <select
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 40px 10px 12px",
                              borderRadius: "30px",
                              border: "1px solid #ddd",
                              background: "#f9f9f9",
                              fontSize: "14px",
                              outline: "none",
                              appearance: "none",
                              WebkitAppearance: "none",
                              MozAppearance: "none",
                              cursor: "pointer",
                              color: "black",
                            }}
                          >
                            <option value="">Sélectionner l'étage</option>
                            <option value="rez-de-chaussée">Rez-de-chaussée</option>
                            <option value="1">1er étage</option>
                            <option value="2">2e étage</option>
                            <option value="3">3e étage</option>
                            <option value="4">4e étage</option>
                            <option value="5+">5e étage ou plus</option>
                          </select>

                          <ImCircleDown
                            size={18}
                            color="#555"
                            style={{
                              position: "absolute",
                              right: "12px",
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                        {floorError && (
                          <div
                            style={{
                              color: "#b91c1c",
                              backgroundColor: "#fee2e2",
                              border: "1px solid #fca5a5",
                              padding: "6px 10px",
                              borderRadius: "8px",
                              marginTop: "6px",
                              fontSize: "13px",
                            }}
                          >
                            Veuillez préciser l’étage pour un appartement.
                          </div>
                        )}

                      </div>
                    }


                  </div>

                  {isRent &&
                    <RentInput
                      rent={rent}
                      setRent={setRent}
                      isRent={isRent}
                    />}

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
                      Le nombre des choses suivantes
                    </label>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      {/* Chambre */}
                      <div style={{ position: "relative" }}>
                        <label
                          style={{
                            position: "absolute",
                            top: "-10px",
                            left: "10px",
                            background: "#fff",
                            padding: "0 4px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          Chambre
                        </label>
                        <input
                          type="number"
                          placeholder="00"
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "10px",
                            textAlign: "center",
                            fontSize: "16px",
                          }}
                          value={rooms}
                          onChange={(e) => setRooms(e.target.value)}
                          required
                        />
                      </div>

                      {/* Salon */}
                      <div style={{ position: "relative" }}>
                        <label
                          style={{
                            position: "absolute",
                            top: "-10px",
                            left: "10px",
                            background: "#fff",
                            padding: "0 4px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          Living
                        </label>
                        <input
                          type="number"
                          placeholder="00"
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "10px",
                            textAlign: "center",
                            fontSize: "16px",
                          }}
                          value={livingRoom}
                          onChange={(e) => setLivingRoom(e.target.value)}
                          required
                        />
                      </div>

                      {/* Cuisine */}
                      <div style={{ position: "relative" }}>
                        <label
                          style={{
                            position: "absolute",
                            top: "-10px",
                            left: "10px",
                            background: "#fff",
                            padding: "0 4px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          Cuisine
                        </label>
                        <input
                          type="number"
                          placeholder="00"
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "10px",
                            textAlign: "center",
                            fontSize: "16px",
                          }}
                          value={kitchen}
                          onChange={(e) => setKitchen(e.target.value)}
                          required
                        />
                      </div>

                      {/* Douche */}
                      <div style={{ position: "relative" }}>
                        <label
                          style={{
                            position: "absolute",
                            top: "-10px",
                            left: "10px",
                            background: "#fff",
                            padding: "0 4px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          Douche
                        </label>
                        <input
                          type="number"
                          placeholder="00"
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "10px",
                            textAlign: "center",
                            fontSize: "16px",
                          }}
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                          required
                        />
                      </div>

                      {/* W.C */}
                      <div style={{ position: "relative" }}>
                        <label
                          style={{
                            position: "absolute",
                            top: "-10px",
                            left: "10px",
                            background: "#fff",
                            padding: "0 4px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          W.C
                        </label>
                        <input
                          type="number"
                          placeholder="00"
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "10px",
                            textAlign: "center",
                            fontSize: "16px",
                          }}
                          value={toilet}
                          onChange={(e) => setToilet(e.target.value)}
                          required
                        />
                      </div>

                      {/* Surface m² */}
                      <div style={{ position: "relative" }}>
                        <label
                          style={{
                            position: "absolute",
                            top: "-10px",
                            left: "10px",
                            background: "#fff",
                            padding: "0 4px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          Surface m²
                        </label>
                        <input
                          type="number"
                          placeholder="00 m²"
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "10px",
                            textAlign: "center",
                            fontSize: "16px",
                          }}
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>


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
                        Ce que propose ce logement :
                      </label>
                    </div>

                    <div
                      className="d-flex flex-wrap"
                      style={{
                        gap: "4px",
                        marginBottom: "12px",
                      }}
                      ref={myRef}
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
                      <GenerateCheckbox icon={<MdLandscape />} state={courtyard} label={"Cour"} onClickFunction={() => setCourtyard(!courtyard)} />
                      <GenerateCheckbox icon={<FaParking />} state={parkingSpaceAvailable} label={"Parking"} onClickFunction={() => setParkingSpaceAvailable(!parkingSpaceAvailable)} />
                      <GenerateCheckbox icon={<FaCar />} state={garage} label={"Garage"} onClickFunction={() => setGarage(!garage)} />
                      <GenerateCheckbox icon={<GiWell />} state={garden} label={"Jardin"} onClickFunction={() => setGarden(!garden)} />
                      <GenerateCheckbox icon={<TbBuildingCastle />} state={independentHouse} label={"Indépendante"} onClickFunction={() => setIndependentHouse(!independentHouse)} />
                      <GenerateCheckbox icon={<FaShieldAlt />} state={guardianHouse} label={"Maison pour gardien"} onClickFunction={() => setGuardianHouse(!guardianHouse)} />
                      <GenerateCheckbox icon={<TbWash />} state={bassin} label={"Bassin"} onClickFunction={() => setBassin(!bassin)} />

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
                      <GenerateCheckbox icon={<MdOutlineFiberSmartRecord />} state={fiberOpticReady} label={"Pré-fibrée"} onClickFunction={() => setFiberOpticReady(!fiberOpticReady)} />

                      {/* 🌅 Vue */}
                      <GenerateCheckbox icon={<GiSeaDragon />} state={seaView} label={"Vue mer"} onClickFunction={() => setSeaView(!seaView)} />
                      <GenerateCheckbox icon={<GiMountainCave />} state={mountainView} label={"Vue montagne"} onClickFunction={() => setMountainView(!mountainView)} />
                      <GenerateCheckbox icon={<GiSeatedMouse />} state={panoramicView} label={"Vue panoramique"} onClickFunction={() => setPanoramicView(!panoramicView)} />
                    </div>

                  </div>
                  {noFeatureSet && (
                    <div className="alert alert-danger">
                      Veuillez d'abord sélectionner tout ce que votre propriété
                      propose aux clients.
                    </div>
                  )}

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
                      Numéro pour vous contacter
                    </label>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      {/* Téléphone 1 */}
                      <div style={{ position: "relative" }}>
                        <label
                          style={{
                            position: "absolute",
                            top: "-10px",
                            left: "10px",
                            background: "#fff",
                            padding: "0 4px",
                            fontSize: "12px",
                            color: "#dc3545", // red for "Obligatoire"
                          }}
                        >
                          Obligatoire
                        </label>
                        <PhoneInput phone={phone1} setPhone={setPhone1} required={true} />
                      </div>

                      {/* Téléphone 2 */}
                      <div style={{ position: "relative" }}>
                        <label
                          style={{
                            position: "absolute",
                            top: "-10px",
                            left: "10px",
                            background: "#fff",
                            padding: "0 4px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          Facultatif
                        </label>
                        <PhoneInput phone={phone2} setPhone={setPhone2} required={false} />
                      </div>

                      {/* Téléphone 3 (only if user clicks Add More) */}
                      {showPhone3 && (
                        <div style={{ position: "relative", marginTop: "10px" }}>
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "10px",
                              background: "#fff",
                              padding: "0 4px",
                              fontSize: "12px",
                              color: "#6b7280",
                            }}
                          >
                            Facultatif
                          </label>
                          <PhoneInput phone={phone3} setPhone={setPhone3} required={false} />
                        </div>
                      )}
                    </div>

                    {/* Add more button on border bottom-left */}
                    {!showPhone3 && (
                      <button
                        type="button"
                        onClick={() => setShowPhone3(true)}
                        style={{
                          position: "absolute",
                          bottom: "-12px",
                          right: "20px",
                          fontSize: "12px",
                          padding: "3px 8px",
                          border: "1px solid #999",
                          borderRadius: "10px",
                          backgroundColor: "rgb(107, 114, 128)",
                          color: "rgb(255, 255, 255)",
                          cursor: "pointer",
                        }}
                      >
                        + Ajouter plus
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      position: "relative",
                      border: "1px solid #e0e0e0",
                      borderRadius: "20px",
                      padding: "20px",
                      marginTop: "20px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <h4 style={{ margin: 0, fontSize: "16px", color: "#333" }}>
                        Ajouter des photos
                      </h4>
                      <span
                        style={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: "12px",
                          padding: "4px 8px",
                          fontSize: "12px",
                          color: "#6b7280",
                          fontWeight: "500",
                        }}
                      >
                        Jusqu'à 8 photos
                      </span>
                    </div>

                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      <div style={{ marginTop: "15px" }}>
                        <ImageUploader
                          payload={null}
                          setImageIsLoading={setImageIsLoading}
                        />
                      </div>

                      {imageError && imgState.length === 0 && (
                        <div
                          style={{
                            backgroundColor: "#fdecea",
                            color: "#b71c1c",
                            padding: "10px",
                            borderRadius: "8px",
                            marginTop: "15px",
                            fontSize: "13px",
                          }}
                        >
                          L'annonce doit comporter au moins une image !
                        </div>
                      )}
                    </div>
                  </div>


                  <button
                    type="submit"
                    style={{ borderRadius: "20px", padding: "10px 20px", marginTop: "20px" }}
                    className="btn btn-success btn-block shadow-sm"
                    disabled={imageIsLoading}
                  >
                    {" "}
                    {imageIsLoading
                      ? "En attente des images ..."
                      : "Créer l'annonce"}
                  </button>
                  {/* <p className="alert alert-success mt-3">
                    <small>Some text success or error</small>
                  </p> */}
                </div>
              </div>
            </form>
          </div>
          {/* bottom navbar */}
          <div
            class="fixed-bottom bg-white"
            style={{
              display: isSliderVisible ? "none" : ""
            }}
          >
            <nav className="d-flex justify-content-start navbar navbar-expand-lg navbar-light">
              <button
                onClick={() => window.history.back()}
                style={{ fontSize: "15px" }}
                className="text-capitalize font-weight-light btn btn-outline-dark border-0"
              >
                <MdArrowBackIos
                  style={{ fontSize: "15px", marginBottom: "3px" }}
                />
                Retour
              </button>
            </nav>
          </div>
          {/* bottom navbar */}
          {propertyExistsCard && !isSliderVisible &&
            <PropertyExistsCard
              handlePursueTheSubmit={handlePursueTheSubmit}
              property={propertyExistsCard}
              setPropertyExistsCard={setPropertyExistsCard}
              setIsSlideVisible={setIsSlideVisible}
              setRecoveryData={setRecoveryData}
            />
          }

          <div
            className={`property-details-slide ${isSliderVisible ? "show" : ""}`}
            style={{
              position: "fixed",
              left: "50%",
              bottom: 0,
              transform: isSliderVisible
                ? "translate(-50%, 0)"
                : "translate(-50%, 100%)",
              width: "100%",
              height: "95vh",
              overflowY: "auto",
              backgroundColor: "#fff",
              borderRadius: "30px 30px 0 0",
              boxShadow: "0 -1px 12px hsla(var(--hue), var(--sat), 15%, 0.30)",
              transition: "transform 0.5s ease",
              boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
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
              <IoMdCloseCircle
                style={{
                  fontSize: "2rem",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: "9999",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={handleCloseSlideClick}
              />
            </div>
            {/* Close button to hide the sliding div */}

            {propertyExistsCard && isSliderVisible && (
              <PropertyDetailsPage
                key={propertyExistsCard._id}
                fastPreviewProperty={propertyExistsCard}
                handleCloseSlideClick={handleCloseSlideClick}
              />
            )}

          </div>

        </div >
      ) : (
        <NotLogedIn />
      )}
    </div >
  );
};

export default CreateListing;
