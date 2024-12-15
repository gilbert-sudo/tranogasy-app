import React, { useEffect, useState } from "react";
import { offlineLoader } from "../hooks/useOfflineLoader";

const UpdateAllCoordsBot = () => {
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  
  const handleRunBotClick = async () => {
    const { loadMap } = offlineLoader();
    const mapList = await loadMap();
    console.log(mapList);
    const totalCities = mapList.length;
    setTotal(totalCities);
    console.log(totalCities);

    for (let i = 0; i < totalCities; i++) {
      const city = mapList[i];
      if (!city.coords) {
        const placeName = `${city.fokontany} ${city.commune} ${city.district} ${city.region} ${city.province}`;
        const newCoords = await getLatLngFromPlace(placeName);
        await updateCityCoordinatesOnServer(city._id, newCoords);
      }
      setProgress((prevProgress) => prevProgress + 1);
    }

    setIsTaskCompleted(true);
  };

  function getLatLngFromPlace(placeName) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const geocoderOptions = {
        address: placeName,
        componentRestrictions: { country: "mg" }, // Country code for Madagascar
      };

      geocoder.geocode(geocoderOptions, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          console.log(geocoderOptions);
          resolve({ lat: null, lng: null });
        }
      });
    });
  }

  async function updateCityCoordinatesOnServer(cityId, newCoords) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/cities/update-city-coordinates/${cityId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({newCoords}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update city coordinates on the server.");
      }
    } catch (error) {
      throw new Error(`Error updating city coordinates for city with ID ${cityId}: ${error.message}`);
    }
  }

  useEffect(() => {
    if (isTaskCompleted) {
      alert("All city coordinates have been updated successfully.");
    }
  }, [isTaskCompleted]);

  return (
    <div className="mt-5 ml-5">
      <button className="ml-5 mt-5 btn btn-default" onClick={handleRunBotClick}>Run Bot</button>
      <div>Progress: {progress} / {total} cities</div>
    </div>
  );
};

export default UpdateAllCoordsBot;
