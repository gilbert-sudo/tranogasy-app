import { useLocation } from "wouter";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchResults,
  setReduxPropertyNumber,
  updateReduxUsersProperties,
  updateProperties,
  updateLikedProperties,
  resetImg,
  resetImgPreview,
  deleteUsersProperty,
  deleteFromTopProperty,
  addUsersProperty,
  pushProperty,
  deleteFromProperties,
} from "../redux/redux";
import { useRedux } from "./useRedux";
import { useLike } from "./useLike";
import { usePhoto } from "./usePhoto";
import Swal from "sweetalert2";
import "../components/css/sweetalert.css";

export const useProperty = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [msgError, setMsgError] = useState(null);
  const [bootstrapClassname, setBootstrap] = useState(null);
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { updateReduxProperty, resetReduxStore } = useRedux();
  const { disLike } = useLike();
  const { deleteImg } = usePhoto();
  //redux
  const properties = useSelector((state) => state.properties);

  // Utility to check for undefined or null or empty string
  const isEmpty = (val) => val === undefined || val === null || (typeof val === 'string' && val.trim() === '');

  const addProperty = async (newProperty) => {
    console.log("Adding new property:", newProperty);

    setIsLoading(true);

    // Destructure all necessary fields from newProperty
    let {
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
      houseType,
      floor,
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
    } = newProperty;

    // Simple required fields check (you can customize required fields list)
    const requiredFields = [title, description, city, (price || rent), type, images, owner, phone1, houseType];
    if (requiredFields.some(isEmpty)) {
      setBootstrap("alert alert-danger");
      setMsgError("Veuillez remplir tous les champs obligatoires correctement.");
      console.log("Veuillez remplir tous les champs obligatoires correctement.", requiredFields);
      setIsLoading(false);
      return;
    }

    console.log("Property creating : step 2");

    // Clean title and description whitespace
    title = title.trim().replace(/\s+/g, " ");
    description = description.trim().replace(/\s+/g, " ");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
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
          houseType,
          floor,
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
        }),
      });

      const json = await response.json();

      if (response.ok) {
        dispatch(resetImg());
        dispatch(resetImgPreview());
        setBootstrap(null);
        setMsgError(null);
        setIsLoading(false);
        dispatch(addUsersProperty(json));
        dispatch(pushProperty(json));
        Swal.fire({
          title: "<h6><strong>Succès!<strong><h6/>",
          icon: "success",
          html: `Votre annonce a été créée.`,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#7cbd1e",
          customClass: {
            popup: "smaller-sweet-alert",
          },
        });
        setLocation("/mylisting");
      } else {
        setBootstrap("alert alert-danger");
        setMsgError(json.message);
        setIsLoading(false);
        console.log(json.message);
      }
    } catch (error) {
      setIsLoading(false);
      setLocation("/nosignal");
      console.log(error);
    }
  };


  const updateProperty = async (oldPropertyDetails, newUpdate) => {
    setIsLoading(true);
    const {
      propertyId,
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
      coords,
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
    } = newUpdate;

    const updatedProperty = {
      title,
      description,
      city,
      price: type === "sale" ? price : null,
      rent: type === "rent" ? rent : null,
      rooms,
      toilet,
      kitchen,
      bathrooms,
      livingRoom,
      phone1,
      phone2,
      area,
      features: {
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
      },
      images,
      coords,
      type,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/properties/${propertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(updatedProperty),
        }
      );

      const json = await response.json();

      if (response.ok) {

        console.log("the property id :", json._id);

        //deleting all unnesesary old images in the image-server
        for (let j = 0; j < oldPropertyDetails.images.length; j++) {
          let existInTheNewUpdate = updatedProperty.images.filter(
            (img) => img.src === oldPropertyDetails.images[j].src
          );
          if (existInTheNewUpdate.length === 0) {
            deleteImg(oldPropertyDetails.images[j].src);
            console.log(`Deleting image number ${j + 1}  from the server!`);
          }
        }
        dispatch(resetImg());
        setBootstrap(null);
        setMsgError(null);
        setIsLoading(false);

        dispatch(updateReduxProperty(json));

        Swal.fire({
          title: "<h6><strong>Succès!<strong><h6/>",
          icon: "success",
          html: `Votre annonce a été modifiée avec succès.`,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#7cbd1e",
          customClass: {
            popup: "smaller-sweet-alert",
          },
        });
        window.history.back();
        console.log(json);
      }
      if (!response.ok) {
        setBootstrap("alert alert-danger");
        setMsgError(json.message);
        setIsLoading(false);
        console.log(json.message);
      }
    } catch (error) {
      setIsLoading(false);
      setLocation("/nosignal");
      console.log(error);
    }
  };

  const deleteProperty = async (property) => {
    const propertyId = property._id;
    let countdown = 7; // Initial countdown value in seconds

    const updateCountDownText = () => {
      Swal.update({
        html: `Vous ne pourrez pas revenir en arrière ! <br> <small>(${countdown} sec)</small>`,
      });
    };

    const countdownFunction = () => {
      countdown -= 1;
      updateCountDownText();
      Swal.update({
        showConfirmButton: false,
      });

      if (countdown > 0) {
        setTimeout(countdownFunction, 1000); // Update every second
      } else {
        // Show the confirm button after 7 seconds
        Swal.hideLoading();
        Swal.update({
          showConfirmButton: true,
          html: `Vous ne pourrez pas revenir en arrière !`,
          confirmButtonText: "Oui, supprimez-le !",
        });
      }
    };
    Swal.fire({
      title: "<h6><strong>Êtes-vous sûr?<strong><h6/>",
      icon: "warning",
      html: `Vous ne pourrez pas revenir en arrière !`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "",
      confirmButtonColor: "#7cbd1e",
      cancelButtonText: "Annuler",
      cancelButtonColor: "#F31559",
      timerProgressBar: true, // Show progress bar
      customClass: {
        popup: "smaller-sweet-alert",
      },
      didOpen: () => {
        Swal.showLoading();
        countdownFunction();
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            imageUrl: "images/deleting.gif",
            allowOutsideClick: false,
            showConfirmButton: false,
          });
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/properties/${propertyId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );

          if (response.ok) {
            Swal.fire({
              title: "<h6><strong>Supprimé !<strong><h6/>",
              icon: "success",
              html: `Votre annonce a été supprimée.`,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: "Ok",
              confirmButtonColor: "#7cbd1e",
              customClass: {
                popup: "smaller-sweet-alert",
              },
            });
            dispatch(deleteUsersProperty({ propertyId }));
            dispatch(deleteFromTopProperty({ propertyId }));
            dispatch(deleteFromProperties({ propertyId }));
            disLike(property);
          }
        } catch (error) {
          setLocation("/nosignal");
          console.log(error);
          // Close the alert when loading is complete
          Swal.close();
        }
      }
    });
  };

    const shareProperty = async (property) => {
    // Get the current URL
    const currentUrl = `${process.env.REACT_APP_API_URL}/api/preview/${property._id}`;
    // Build the full title
    const metaTitle = `${property.title} à ${property.location} - ${property.formattedPrice}`;

    if (navigator.share) {
      navigator
        .share({
          title: metaTitle,
          text: "Découvrez cette propriété sur TranoGasy!",
          url: currentUrl,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // fallback for desktop
      navigator.clipboard.writeText(currentUrl);
      alert("Vous venez de copier le lien vers cette annonce! Vous pouvez maintenant le coller où vous voulez.");
    }
  };

  const publishProperty = async (propertyId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/properties/${propertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            status: "pending",
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "<h6><strong>Misaotra betsaka !<strong><h6/>",
          icon: "success",
          html: `Votre annonce est désormais publique. Elle le restera tant que notre administrateur confirme votre paiement.`,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#7cbd1e",
          customClass: {
            popup: "smaller-sweet-alert",
          },
        });

        //update the user redux state
        resetReduxStore();
        setLocation("/loader");
      }
    } catch (error) {
      setLocation("/nosignal");
      console.log(error);
    }
  };

  const searchProperty = (parameters) => {
    const {
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
    } = parameters;

    let results = [];

    // Simple search
    results = properties.filter(
      (property) =>
        property.type === type &&
        (budgetMin && property.rent ? property.rent >= budgetMin : true) &&
        (budgetMax && property.rent ? property.rent <= budgetMax : true) &&
        (budgetMin && property.price ? property.price >= budgetMin : true) &&
        (budgetMax && property.price ? property.price <= budgetMax : true)
    );

    if (results.length === 0) {
      dispatch(setSearchResults([]));
    } else {
      // Advanced search
      results = results.filter(
        (property) =>
          (numberOfRooms
            ? (property.rooms + property.livingRoom + property.kitchen) >= numberOfRooms
            : true) &&
          (carAccess ? property.features.carAccess === carAccess : true) &&
          (motoAccess ? property.features.motoAccess === motoAccess : true) &&
          (parkingSpaceAvailable
            ? property.features.parkingSpaceAvailable === parkingSpaceAvailable
            : true) &&
          (elevator ? property.features.elevator === elevator : true) &&
          (garden ? property.features.garden === garden : true) &&
          (courtyard ? property.features.courtyard === courtyard : true) &&
          (balcony ? property.features.balcony === balcony : true) &&
          (roofTop ? property.features.roofTop === roofTop : true) &&
          (swimmingPool ? property.features.swimmingPool === swimmingPool : true) &&
          (surroundedByWalls
            ? property.features.surroundedByWalls === surroundedByWalls
            : true) &&
          (independentHouse
            ? property.features.independentHouse === independentHouse
            : true) &&
          (garage ? property.features.garage === garage : true) &&
          (guardianHouse
            ? property.features.guardianHouse === guardianHouse
            : true) &&
          (kitchenFacilities
            ? property.features.kitchenFacilities === kitchenFacilities
            : true) &&
          (placardKitchen
            ? property.features.placardKitchen === placardKitchen
            : true) &&
          (insideToilet === "all"
            ? true
            : property.features.insideToilet === insideToilet) &&
          (insideBathroom === "all"
            ? true
            : property.features.insideBathroom === insideBathroom) &&
          (bathtub ? property.features.bathtub === bathtub : true) &&
          (fireplace ? property.features.fireplace === fireplace : true) &&
          (airConditionerAvailable
            ? property.features.airConditionerAvailable === airConditionerAvailable
            : true) &&
          (hotWaterAvailable
            ? property.features.hotWaterAvailable === hotWaterAvailable
            : true) &&
          (furnishedProperty
            ? property.features.furnishedProperty === furnishedProperty
            : true) &&
          (electricityPower
            ? property.features.electricityPower === electricityPower
            : true) &&
          (electricityJirama
            ? property.features.electricityJirama === electricityJirama
            : true) &&
          (waterPumpSupply
            ? property.features.waterPumpSupply === waterPumpSupply
            : true) &&
          (waterPumpSupplyJirama
            ? property.features.waterPumpSupplyJirama === waterPumpSupplyJirama
            : true) &&
          (waterWellSupply
            ? property.features.waterWellSupply === waterWellSupply
            : true) &&
          (securitySystem
            ? property.features.securitySystem === securitySystem
            : true) &&
          (wifiAvailability
            ? property.features.wifiAvailability === wifiAvailability
            : true) &&
          (fiberOpticReady
            ? property.features.fiberOpticReady === fiberOpticReady
            : true) &&
          (seaView ? property.features.seaView === seaView : true) &&
          (mountainView ? property.features.mountainView === mountainView : true) &&
          (panoramicView ? property.features.panoramicView === panoramicView : true) &&
          (solarPanels ? property.features.solarPanels === solarPanels : true)
      );

      dispatch(setSearchResults(results));
    }
    return results;
  };

  const formatPrice = (price = 0) => {
    if (price >= 1000000000) {
      return (price / 1000000000).toFixed(1).replace(/\.0$/, '') + 'Md';
    } else if (price >= 1000000) {
      return (price / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return price;
  };

  const getPriceAndRentRanges = (properties) => {
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let minRent = Infinity;
    let maxRent = -Infinity;

    properties.forEach(property => {
      if (property.price !== null) {
        minPrice = Math.min(minPrice, property.price);
        maxPrice = Math.max(maxPrice, property.price);
      }
      if (property.rent !== null) {
        minRent = Math.min(minRent, property.rent);
        maxRent = Math.max(maxRent, property.rent);
      }
    });

    // If there are no valid price values, set min and max price to null
    if (minPrice === Infinity) minPrice = null;
    if (maxPrice === -Infinity) maxPrice = null;

    // If there are no valid rent values, set min and max rent to null
    if (minRent === Infinity) minRent = null;
    if (maxRent === -Infinity) maxRent = null;

    return { minPrice, maxPrice, minRent, maxRent };
  }

  return {
    addProperty,
    updateProperty,
    deleteProperty,
    shareProperty,
    publishProperty,
    searchProperty,
    formatPrice,
    getPriceAndRentRanges,
    isLoading,
    msgError,
    bootstrapClassname,
  };
};
