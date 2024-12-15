import React, { useEffect, useState, useRef } from "react";
import { useRoute } from "wouter";
import { useSelector, useDispatch } from "react-redux";
import { setPreviousUrl } from "../redux/redux";
import { useProperty } from "../hooks/useProperty";
import NotLogedIn from "../components/NotLogedIn";
import AutosuggestInput from "../components/AutosuggestInput";

import { offlineLoader } from "../hooks/useOfflineLoader";

import { MdOutlineEditLocation, MdArrowBackIos } from "react-icons/md";
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
  FaRegSave,
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
import { useMap as useLocalMapHook } from "../hooks/useMap";
import Swal from "sweetalert2";

const UpdatePropertyPage = () => {
  const myRef = useRef(null);
  const user = useSelector((state) => state.user);
  const imgState = useSelector((state) => state.img);
  const dispatch = useDispatch();
  const [mapData, setMapData] = useState(null);
  const [oneTimeTask, setOneTimeTask] = useState(null);
  const [imageIsLoading, setImageIsLoading] = useState(false);

  if (oneTimeTask === null) {
    // scroll to top of the page
    dispatch(setPreviousUrl("/update-property"));
    window.scrollTo(0, 0);
    setOneTimeTask("done");
  }

  const [match, params] = useRoute("/update-property/:propertyData");
  const propertyData = match ? params.propertyData : null;

  const oldPropertyDetails = JSON.parse(decodeURIComponent(propertyData));
  // console.log(oldPropertyDetails);

  const [status, setStatus] = useState(oldPropertyDetails.status);
  const [title, setTitle] = useState(oldPropertyDetails.title);
  const [description, setDescription] = useState(
    oldPropertyDetails.description
  );
  const [rent, setRent] = useState(oldPropertyDetails.rent);
  const [price, setPrice] = useState(oldPropertyDetails.price);
  const [selectedCity, setSelectedCity] = useState(oldPropertyDetails.city);
  const [coords, setCoords] = useState(null);
  const [rooms, setRooms] = useState(oldPropertyDetails.rooms);
  const [bathrooms, setBathrooms] = useState(oldPropertyDetails.bathrooms);
  const [area, setArea] = useState(oldPropertyDetails.area);
  const [toilet, setToilet] = useState(oldPropertyDetails.toilet);
  const [kitchen, setKitchen] = useState(oldPropertyDetails.kitchen);
  const [livingRoom, setLivingRoom] = useState(oldPropertyDetails.livingRoom);
  const [phone1, setPhone1] = useState(oldPropertyDetails.phone1);
  const [phone2, setPhone2] = useState(oldPropertyDetails.phone2);

  const { loadMap } = offlineLoader();
  const { updateProperty, isLoading } = useProperty();
  const { findLocationsWithinDistance } = useLocalMapHook();

  const [isRent, setIsRent] = useState(oldPropertyDetails.type === "rent");
  const [isSale, setIsSale] = useState(oldPropertyDetails.type === "sale");
  // features checkboxs
  const [carAccess, setCarAccess] = useState(
    oldPropertyDetails.features.carAccess
  );
  const [motoAccess, setMotoAccess] = useState(
    oldPropertyDetails.features.motoAccess
  );
  const [wifiAvailability, setWifiAvailability] = useState(
    oldPropertyDetails.features.wifiAvailability
  );
  const [parkingSpaceAvailable, setParkingSpaceAvailable] = useState(
    oldPropertyDetails.features.parkingSpaceAvailable
  );
  const [waterPumpSupply, setWaterPumpSupply] = useState(
    oldPropertyDetails.features.waterPumpSupply
  );
  const [electricityPower, setElectricityPower] = useState(
    oldPropertyDetails.features.electricityPower
  );
  const [securitySystem, setSecuritySystem] = useState(
    oldPropertyDetails.features.securitySystem
  );
  const [waterWellSupply, setWaterWellSupply] = useState(
    oldPropertyDetails.features.waterPumpSupply
  );
  const [surroundedByWalls, setSurroundedByWalls] = useState(
    oldPropertyDetails.features.surroundedByWalls
  );
  const [electricityJirama, setElectricityJirama] = useState(
    oldPropertyDetails.features.electricityJirama
  );
  const [waterPumpSupplyJirama, setWaterPumpSupplyJirama] = useState(
    oldPropertyDetails.features.waterPumpSupplyJirama
  );
  const [kitchenFacilities, setKitchenFacilities] = useState(
    oldPropertyDetails.features.kitchenFacilities
  );
  const [airConditionerAvailable, setAirConditionerAvailable] = useState(
    oldPropertyDetails.features.airConditionerAvailable
  );
  const [smokeDetectorsAvailable, setSmokeDetectorsAvailable] = useState(
    oldPropertyDetails.features.smokeDetectorsAvailable
  );
  const [terrace, setTerrace] = useState(oldPropertyDetails.features.terrace);
  const [swimmingPool, setSwimmingPool] = useState(
    oldPropertyDetails.features.swimmingPool
  );
  const [insideToilet, setInsideToilet] = useState(
    oldPropertyDetails.features.insideToilet
  );
  const [insideBathroom, setInsideBathroom] = useState(
    oldPropertyDetails.features.insideBathroom
  );

  const [noFeatureSet, setNoFeatureSet] = useState(false);

  const areSameCity =
    selectedCity &&
    oldPropertyDetails.city.coords.lat === selectedCity.coords.lat &&
    oldPropertyDetails.city.coords.lng === selectedCity.coords.lng;

  const GenerateCheckbox = ({ state, label, icon, onClickFunction }) => {
    return (
      <div
        style={{ borderRadius: "15px", cursor: "pointer" }}
        className={`btn-group w-100 border py-1 border-dark px-2 mx-2 my-1 ${
          state ? "bg-secondary" : "bg-light"
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
            <feature className={`${state ? "text-white" : ""}`}>
              {label}
            </feature>
          </label>
        </div>
      </div>
    );
  };
  const handleGoBack = () => {
    window.history.back();
  };

  const handleRentClick = () => {
    setIsRent(true);
    setIsSale(false);
  };

  const handleSaleClick = () => {
    setIsRent(false);
    setIsSale(true);
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
        console.log(areSameCity);
      }
    };

    pageLoader();
  }, [mapData]);

  // Callback function for handling the selected item's _id
  const handleItemSelected = (itemId) => {
    // Do something with the selected item's _id
    console.log("Selected item _id:", itemId);
    setSelectedCity(itemId);
    setCoords(null);
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

    if (
      carAccess ||
      motoAccess ||
      wifiAvailability ||
      parkingSpaceAvailable ||
      waterPumpSupply ||
      electricityPower ||
      securitySystem ||
      waterWellSupply ||
      surroundedByWalls ||
      electricityJirama ||
      waterPumpSupplyJirama ||
      kitchenFacilities ||
      airConditionerAvailable ||
      smokeDetectorsAvailable ||
      terrace ||
      swimmingPool
    ) {
      setNoFeatureSet(false);
    } else {
      setNoFeatureSet(true);
      myRef.current.scrollIntoView();
      return;
    }

    if (images.length === 0) {
      return;
    }

    const newProperty = {
      propertyId: oldPropertyDetails._id,
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
      coords,
      phone1,
      phone2,
      motoAccess,
      carAccess,
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
      smokeDetectorsAvailable,
      terrace,
      swimmingPool,
      insideToilet,
      insideBathroom,
    };

    console.log(newProperty);

    updateProperty(oldPropertyDetails, newProperty);
  };

  useEffect(() => {
    if (isLoading) {
      // Display the alert
      Swal.fire({
        imageUrl: "images/loading-house.gif",
        html: `<p style={{ fontWeight: "400" }}> En train de modifier votre annonce </p>`,
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
    <>
      <form method="post" onSubmit={handleSubmit}>
        <div className="update-property">
          {user && user ? (
            <div
              className="update-property mt-5 pt-3"
              style={{ backgroundColor: "#F0F5F9" }}
            >
              <div
                className="site-section site-section-sm"
                style={{ backgroundColor: "#F0F5F9" }}
              >
                <div
                  className="custom-container"
                  style={{ paddingBottom: "80px" }}
                >
                  <div className="mb-3 d-flex align-items-center justify-content-between">
                    <h6 className="font-weight-light text-uppercase mt-1">
                      Modifier une annonce :
                    </h6>
                    <div className="select-status">
                      <select
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value);
                        }}
                        className="form-control form-control-sm d-block rounded-0"
                      >
                        <option value="available">Disponible</option>
                        <option value="unavailable">Indisponible</option>
                        <option value="occupated">Occupé</option>
                      </select>
                    </div>
                  </div>
                  <div id="nav-tab-rent" className="tab-pane fade show active">
                    <div className="form-group position-relative">
                      <label htmlFor="username">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Le fokotany où se trouve la propriété:</strong>
                      </label>

                      {!selectedCity && (
                        <AutosuggestInput
                          data={mapData}
                          onSelectItem={handleItemSelected}
                        />
                      )}

                      {selectedCity && (
                        <div
                          style={{ backgroundColor: "#6c757d" }}
                          className="fokotany border"
                        >
                          <div
                            style={{
                              border: "2px solid #6c757d",
                              color: "#6c757d",
                            }}
                            className="alert alert-light mb-0"
                            role="alert"
                          >
                            <b>{`${selectedCity.fokontany}, ${
                              selectedCity.commune.charAt(0).toUpperCase() +
                              selectedCity.commune.slice(1)
                            }`}</b>{" "}
                            <br />
                            <small>{`${selectedCity.district.toUpperCase()}`}</small>{" "}
                            {`(${selectedCity.region})`}
                          </div>
                          <div className="d-flex justify-content-end">
                            <button
                              type="button"
                              onClick={(e) => {
                                setSelectedCity(null);
                                setCoords(null);
                              }}
                              className="btn btn-sm btn-danger"
                            >
                              Changer <MdOutlineEditLocation />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {selectedCity && (
                      <div className="form-group">
                        <label
                          data-toggle="tooltip"
                          title=""
                          data-original-title="3 digits code on back side of the card"
                        >
                          <strong className="text-danger">*</strong>{" "}
                          <strong>
                            Si vous le souhaitez, vous pouvez indiquer sur la
                            carte l'emplacement exact de la propriété.
                          </strong>
                        </label>
                        <PropertyLocationSelector
                          defaultPosition={
                            areSameCity
                              ? oldPropertyDetails.coords
                                ? oldPropertyDetails.coords
                                : oldPropertyDetails.city.coords
                              : selectedCity.coords
                          }
                          setCoords={setCoords}
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label
                        data-toggle="tooltip"
                        title=""
                        data-original-title="3 digits code on back side of the card"
                      >
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Un titre</strong>
                        <i className="fa fa-question-circle" />
                      </label>
                      <input
                        type="text"
                        required="ON"
                        className="form-control"
                        placeholder="Donnez un titre à votre annonce"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label
                        data-toggle="tooltip"
                        title=""
                        data-original-title="3 digits code on back side of the card"
                      >
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Une description</strong>
                        <i className="fa fa-question-circle" />
                      </label>
                      <textarea
                        class="form-control"
                        required
                        id="exampleFormControlTextarea1"
                        rows="5"
                        placeholder="Veuillez ne pas dépasser les 500 caractères"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardNumber">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Type d'offre :</strong>
                      </label>
                      <div className="input-group">
                        <div className="btn-group" role="group">
                          <button
                            style={{ borderRadius: "15px" }}
                            type="button"
                            className={`btn mx-1 ${
                              isRent
                                ? "btn-outline-secondary active"
                                : "btn-outline-secondary"
                            }`}
                            onClick={handleRentClick}
                          >
                            <b>Location</b>
                          </button>
                          <button
                            type="button"
                            style={{ borderRadius: "15px" }}
                            className={`btn mx-1 ${
                              isSale
                                ? "btn-outline-secondary active"
                                : "btn-outline-secondary"
                            }`}
                            onClick={handleSaleClick}
                          >
                            <b>Vente</b>
                          </button>
                        </div>
                      </div>
                    </div>

                    {isRent && (
                      <div className="form-group">
                        <label htmlFor="cardNumber">
                          <strong className="text-danger">*</strong>{" "}
                          <strong>Montant du loyer du bien (en Ariary)</strong>
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            name="budgetmax"
                            placeholder="Indiquer un montant d'argent"
                            className="form-control"
                            value={rent}
                            onChange={(e) => setRent(e.target.value)}
                            required={`${isRent ? "ON" : "OFF"}`}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text text-muted">
                              Ar / mois
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {isSale && (
                      <div className="form-group">
                        <label htmlFor="cardNumber">
                          <strong className="text-danger">*</strong>{" "}
                          <strong>Prix du bien (en Ariary) </strong>
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            name="budgetmax"
                            placeholder="Indiquer un montant d'argent"
                            className="form-control"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required={`${isSale ? "ON" : "OFF"}`}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text text-muted">
                              Ar
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="cardNumber">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Le nombre des choses suivantes:</strong>
                      </label>
                      <div
                        style={{ backgroundColor: "#e9ecef" }}
                        className="d-flex align-item-center justify-content-between border rounded p-2"
                      >
                        <div className="room mx-1">
                          <label>
                            <small>Chambre</small>
                          </label>
                          <input
                            type="number"
                            placeholder="00"
                            name=""
                            className="form-control"
                            value={rooms}
                            onChange={(e) => setRooms(e.target.value)}
                            required="ON"
                          />
                        </div>
                        <div className="wc mx-1">
                          <label>
                            <small>Living Room</small>
                          </label>
                          <input
                            type="number"
                            placeholder="00"
                            name=""
                            className="form-control"
                            value={livingRoom}
                            onChange={(e) => setLivingRoom(e.target.value)}
                            required="ON"
                          />
                        </div>
                        <div className="douche mx-1">
                          <label>
                            <small>Cuisine</small>
                          </label>
                          <input
                            type="number"
                            placeholder="00"
                            name=""
                            className="form-control"
                            value={kitchen}
                            onChange={(e) => setKitchen(e.target.value)}
                            required="ON"
                          />
                        </div>
                      </div>
                      <div
                        style={{ backgroundColor: "#e9ecef" }}
                        className="d-flex align-item-center justify-content-between border rounded p-2"
                      >
                        <div className="douche mx-1">
                          <label>
                            <small>Douche</small>
                          </label>
                          <input
                            type="number"
                            placeholder="00"
                            name=""
                            className="form-control"
                            value={bathrooms}
                            onChange={(e) => setBathrooms(e.target.value)}
                            required="ON"
                          />
                        </div>
                        <div className="wc mx-1">
                          <label>
                            <small>W.C</small>
                          </label>
                          <input
                            type="number"
                            placeholder="00"
                            name=""
                            className="form-control"
                            value={toilet}
                            onChange={(e) => setToilet(e.target.value)}
                            required="ON"
                          />
                        </div>
                        <div className="room mx-1">
                          <label>
                            <small>Surface m²</small>
                          </label>
                          <input
                            type="number"
                            placeholder="00 m²"
                            name=""
                            className="form-control"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            required="ON"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardNumber">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Emplacement du toilette (WC):</strong>
                      </label>
                      <div className="input-group">
                        <div className="btn-group" role="group">
                          <button
                            style={{ borderRadius: "15px" }}
                            type="button"
                            className={`btn mx-1 ${
                              insideToilet
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
                            style={{ borderRadius: "15px" }}
                            className={`btn mx-1 ${
                              !insideToilet
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
                            style={{ borderRadius: "15px" }}
                            type="button"
                            className={`btn mx-1 ${
                              insideBathroom
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
                            style={{ borderRadius: "15px" }}
                            className={`btn mx-1 ${
                              !insideBathroom
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

                    <div
                      className="form-group"
                      style={
                        noFeatureSet
                          ? {
                              border: "2px solid red",
                              borderRadius: "13px",
                              marginBottom: "0px",
                            }
                          : {}
                      }
                    >
                      <label htmlFor="cardNumber">
                        <strong className="text-danger">*</strong>{" "}
                        <strong>Ce que propose ce logement :</strong>
                      </label>

                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<FaMotorcycle />}
                          state={motoAccess}
                          label={"Accès pour moto disponible"}
                          onClickFunction={() => {
                            setMotoAccess(!motoAccess);
                            if (carAccess === true) setMotoAccess(true);
                            if (motoAccess === false) setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<FaCar />}
                          state={carAccess}
                          label={"Accès pour voiture disponible"}
                          onClickFunction={() => {
                            setCarAccess(!carAccess);
                            if (carAccess === false) setMotoAccess(true);
                            if (carAccess === false) setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<FaWifi />}
                          state={wifiAvailability}
                          label={"Disponibilité de la connexion Wi-Fi"}
                          onClickFunction={() => {
                            setWifiAvailability(!wifiAvailability);
                            if (wifiAvailability === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<FaParking />}
                          state={parkingSpaceAvailable}
                          label={"Espace de stationnement disponible"}
                          onClickFunction={() => {
                            setParkingSpaceAvailable(!parkingSpaceAvailable);
                            if (parkingSpaceAvailable === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>

                      <div className="input-group" ref={myRef}>
                        <GenerateCheckbox
                          icon={<FaFaucetDrip />}
                          state={waterPumpSupplyJirama}
                          label={"Robinet d'eau de la JI.RA.MA"}
                          onClickFunction={() => {
                            setWaterPumpSupplyJirama(!waterPumpSupplyJirama);
                            if (waterPumpSupplyJirama === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<FaOilWell />}
                          state={waterPumpSupply}
                          label={"Pompe à eau privee"}
                          onClickFunction={() => {
                            setWaterPumpSupply(!waterPumpSupply);
                            if (waterPumpSupply === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<GiWell />}
                          state={waterWellSupply}
                          label={"Approvisionnement en puits d'eau"}
                          onClickFunction={() => {
                            setWaterWellSupply(!waterWellSupply);
                            if (waterWellSupply === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<FaPlugCircleBolt />}
                          state={electricityJirama}
                          label={"Électricité fournie par la JI.RA.MA"}
                          onClickFunction={() => {
                            setElectricityJirama(!electricityJirama);
                            if (electricityJirama === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<FaPlugCircleCheck />}
                          state={electricityPower}
                          label={"Alimentation en électricité privee"}
                          onClickFunction={() => {
                            setElectricityPower(!electricityPower);
                            if (electricityPower === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<GiBrickWall />}
                          state={surroundedByWalls}
                          label={"Propriété entourée de murs"}
                          onClickFunction={() => {
                            setSurroundedByWalls(!surroundedByWalls);
                            if (surroundedByWalls === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<FaShieldAlt />}
                          state={securitySystem}
                          label={"Domaine sécurisé"}
                          onClickFunction={() => {
                            setSecuritySystem(!securitySystem);
                            if (securitySystem === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>

                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<TbBuildingCastle />}
                          state={terrace}
                          label={"avec terrasse disponible."}
                          onClickFunction={() => {
                            setTerrace(!terrace);
                            if (terrace === false) setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<FaSwimmingPool />}
                          state={swimmingPool}
                          label={"Avec piscine."}
                          onClickFunction={() => {
                            setSwimmingPool(!swimmingPool);
                            if (swimmingPool === false) setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<FaKitchenSet />}
                          state={kitchenFacilities}
                          label={"Équipements de cuisine disponibles"}
                          onClickFunction={() => {
                            setKitchenFacilities(!kitchenFacilities);
                            if (kitchenFacilities === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<TbAirConditioning />}
                          state={airConditionerAvailable}
                          label={"Climatisation disponible"}
                          onClickFunction={() => {
                            setAirConditionerAvailable(
                              !airConditionerAvailable
                            );
                            if (airConditionerAvailable === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <GenerateCheckbox
                          icon={<GiSmokeBomb />}
                          state={smokeDetectorsAvailable}
                          label={"Détecteurs de fumée disponibles"}
                          onClickFunction={() => {
                            setSmokeDetectorsAvailable(
                              !smokeDetectorsAvailable
                            );
                            if (smokeDetectorsAvailable === false)
                              setNoFeatureSet(false);
                          }}
                        />
                      </div>
                    </div>
                    {noFeatureSet && (
                      <div className="alert alert-danger">
                        Veuillez d'abord sélectionner tout ce que votre
                        propriété propose aux clients.
                      </div>
                    )}
                    <div className="form-group">
                      <label>
                        <span className="hidden-xs">
                          <strong className="text-danger">*</strong>{" "}
                          <strong>Numéro pour vous contacter</strong>
                        </span>
                      </label>
                      <div
                        style={{ backgroundColor: "#e9ecef" }}
                        className="d-flex align-item-center justify-content-between border rounded p-2"
                      >
                        <div className="w-50">
                          <label>
                            <small className="text-danger">Obligatoire</small>
                          </label>
                          <input
                            type="number"
                            placeholder="Téléphone 1"
                            name=""
                            className="form-control"
                            value={phone1}
                            onChange={(e) => setPhone1(e.target.value)}
                          />
                        </div>
                        <div className="ml-1 w-50">
                          <label>
                            <small>Facultatif</small>
                          </label>
                          <input
                            type="number"
                            placeholder="Téléphone 2"
                            name=""
                            className="form-control"
                            value={phone2}
                            onChange={(e) => setPhone2(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>
                        <span className="hidden-xs">
                          <strong className="text-danger">*</strong>{" "}
                          <strong>Ajouter des photos pour l'annonce:</strong>
                        </span>{" "}
                        <br />
                        <span className="hidden-xs">
                          <small className="text-danger">NB:</small>{" "}
                          <small>Vous pouvez ajouter jusqu'à 06 photos!</small>
                        </span>
                      </label>{" "}
                      <br />
                      <div className="mb-4 w-100 container-sm">
                        <center>
                          {imgState.length === 0 && (
                            <div className="mt-2 alert alert-danger">
                              L'annonce doit comporter au moins une image!
                            </div>
                          )}
                          <ImageUploader
                            payload={oldPropertyDetails.images}
                            setImageIsLoading={setImageIsLoading}
                          />
                        </center>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <NotLogedIn />
          )}
        </div>

        {/* bottom navbar */}

        <div class="fixed-bottom bg-white">
          <nav className="d-flex justify-content-between navbar navbar-expand-lg navbar-light">
            <button
              onClick={handleGoBack}
              type="button"
              style={{ fontSize: "15px" }}
              className="text-capitalize font-weight-light btn btn-outline-dark border-0"
            >
              <MdArrowBackIos
                style={{ fontSize: "15px", marginBottom: "3px" }}
              />
              Annuler
            </button>

            <button
              className="btn btn-success text-white font-weight-bold my-2 my-sm-0"
              style={{ padding: "1.5vh", borderRadius: "10px" }}
              type="submit"
              disabled={imageIsLoading || imgState.length === 0}
            >
              {imageIsLoading ? (
                "En attente ..."
              ) : (
                <>
                  <FaRegSave className="mr-2 mb-1" />
                  Sauvegarder
                </>
              )}
            </button>
          </nav>
        </div>
      </form>

      {/* bottom navbar */}
    </>
  );
};

export default UpdatePropertyPage;
