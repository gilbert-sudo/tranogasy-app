import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useProperty } from "../hooks/useProperty";
import { usePopup } from "../hooks/usePopup";
import { useMap as useLocalMapHook } from "../hooks/useMap";
import NotLogedIn from "../components/NotLogedIn";
import AutosuggestInput from "../components/AutosuggestInput";

import { offlineLoader } from "../hooks/useOfflineLoader";

import { MdOutlineEditLocation, MdArrowBackIos, MdOutlineLiving, MdBalcony, MdLocationOn } from "react-icons/md";
import {
  GiCheckMark,
  GiCircle,
  GiWell,
  GiBrickWall,
  GiFireplace, GiBathtub, GiSolarPower, GiMountainCave, GiSeatedMouse, GiSeaDragon, GiCastle
} from "react-icons/gi";
import { TbAirConditioning, TbBuildingCastle } from "react-icons/tb";
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


import ImageUploader from "../components/ImageUploader";
import PropertyLocationSelector from "../components/PropertyLocationSelector";
import Swal from "sweetalert2";

const CreateListing = () => {
  const myRef = useRef(null);
  const user = useSelector((state) => state.user);
  const imgState = useSelector((state) => state.img);
  const [mapData, setMapData] = useState(null);

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

  const { loadMap } = offlineLoader();
  const { addProperty, isLoading } = useProperty();
  const { featureUnderConstructionPopup } = usePopup();
  const { findLocationsWithinDistance } = useLocalMapHook();

  const [isRent, setIsRent] = useState(true);
  const [isSale, setIsSale] = useState(false);
  const [isColoc, setIsColoc] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(false);
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
      if (!mapData) {
        try {
          const result = await loadMap();
          setMapData(result.fokotanyList); // Log the result after it's resolved
        } catch (error) {
          console.error(error);
        }
      }
    };
    console.log(mapData);
    pageLoader();
  }, [mapData]);

  // Callback function for handling the selected item's _id
  const handleItemSelected = (itemId) => {
    console.log("Selected item _id:", itemId);
    setSelectedCity(itemId);
    // Do something with the selected item's _id
  };
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

    const newProperty = {
      title,
      description,
      city,
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
      phone1,
      phone2,
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

    addProperty(newProperty);

    console.log(newProperty);
  };

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
      const selectedCityIsNearby = (nearbyLocations.length > 2) ? nearbyLocations.slice(0, 2).find((nearbyLocation) => nearbyLocation.location._id === selectedCity._id) : nearbyLocations.find((nearbyLocation) => nearbyLocation.location._id === selectedCity._id);
      // console.log(nearbyLocations.slice(0, 3), selectedCityIsNearby);
      if (nearbyLocations.length > 0) {
        if (!selectedCityIsNearby) setSelectedCity(nearbyLocations[0].location);
      }
    }
  }, [isLoading, coords]);

  return (
    <div className="create-listing">
      {user && user ? (
        <div className="create-listing mt-5 pt-3">
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
                        fontSize: "14px",
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
                      Le fokotany où se trouve la propriété
                    </label>

                    {!selectedCity && (
                      <AutosuggestInput
                        data={mapData}
                        onSelectItem={handleItemSelected}
                      />
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
                        Si vous le souhaitez, vous pouvez indiquer sur la carte l'emplacement exact de la propriété.
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
                        fontSize: "14px",
                        resize: "vertical",
                      }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>



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

                  {isRent && (
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
                        Montant du loyer du bien (en Ariary)
                      </label>

                      <div style={{ position: "relative", marginTop: "10px" }}>
                        <input
                          type="number"
                          name="budgetmax"
                          placeholder="Indiquer un montant"
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "15px",
                            fontSize: "14px",
                            textAlign: "left",
                            paddingRight: "80px", // espace pour le suffixe
                          }}
                          value={rent}
                          onChange={(e) => setRent(e.target.value)}
                          required={isRent ? true : false}
                        />
                        <span
                          style={{
                            position: "absolute",
                            right: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#6b7280",
                            fontSize: "14px",
                            pointerEvents: "none",
                          }}
                        >
                          Ar / mois
                        </span>
                      </div>
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
                            fontSize: "13px",
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
                          Salon
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
                            fontSize: "13px",
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
                            fontSize: "13px",
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
                            fontSize: "13px",
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
                            fontSize: "13px",
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
                            fontSize: "13px",
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
                        Cliquez sur ce que vous souhaitez trouver :
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
                        <input
                          type="tel"
                          placeholder="Téléphone 1"
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "10px",
                            fontSize: "13px",
                            textAlign: "center",
                          }}
                          value={phone1}
                          maxLength={10}
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/\D/g, "");
                            setPhone1(numericValue);
                          }}
                          required
                        />
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
                        <input
                          type="tel"
                          placeholder="Téléphone 2"
                          style={{
                            width: "100%",
                            border: "1px solid #999",
                            borderRadius: "16px",
                            padding: "10px",
                            fontSize: "13px",
                            textAlign: "center",
                          }}
                          value={phone2}
                          maxLength={10}
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/\D/g, "");
                            setPhone2(numericValue);
                          }}
                        />
                      </div>
                    </div>
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
          <div class="fixed-bottom bg-white">
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
        </div>
      ) : (
        <NotLogedIn />
      )}
    </div>
  );
};

export default CreateListing;
