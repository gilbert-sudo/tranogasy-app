import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getCenterOfBounds, getBounds, getDistance } from "geolib";
import { useSelector, useDispatch } from "react-redux";
import NoResultFound from "../components/NoResultFound";
import SearchLoader from "../components/SearchLoader";
import PropertyDetailsPage from "./PropertyDetailsPage";
import CustomMapControl from "../components/CustomMapControl";


import { setReduxGmapValue } from "../redux/redux";
import { useProperty } from "../hooks/useProperty";
import { useMap as useLocalMapHook } from "../hooks/useMap";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  ControlPosition,
  useMap,
  MapControl,
} from "@vis.gl/react-google-maps";
import { useLoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import { IoMdCloseCircle } from "react-icons/io";
import { ImLocation } from "react-icons/im";
import { LuSettings2 } from "react-icons/lu";

export default function TranogasyMap() {
  const searchForm = useSelector((state) => state.searchForm);
  const searchResults = useSelector((state) => state.searchResults);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs",
    libraries: ["places"],
  });

  useEffect(() => {
    // Cleanup function to remove all pac-container elements when component unmounts
    const cleanupFunction = () => {
      const pacContainers = document.getElementsByClassName("pac-container");
      Array.from(pacContainers).forEach((container) => {
        container.remove();
      });
    };

    // Call the cleanup function when the component unmounts
    return cleanupFunction;
  }, []);

  if (searchResults && searchResults.length !== 0) {
    if (!isLoaded) return <div>Chargement de la carte...</div>;
    return <MyMap properties={searchResults} />;
  }
  if (searchResults && searchResults.length === 0) {
    return <NoResultFound searchForm={searchForm} />;
  }
  if (!searchResults) {
    return <SearchLoader />;
  }
}

function MyMap({ properties }) {
  const geolocation = useSelector((state) => state.geolocation);
  const [selected, setSelected] = useState(null);
  const [center, setCenter] = useState(null);
  const [mapZoomLevel, setMapZoomLevel] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [defaultposition, setDefaultPosition] = useState(
    geolocation.userCurrentPosition
  );
  const [radius, setRadius] = useState(500);
  const dispatch = useDispatch();
  const { getLocationsCoords, calculateZoomLevel } = useLocalMapHook();

  const [location, setLocation] = useLocation("");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const sliderRef = useRef(null);
  const map = useMap();
  const [mapTypeId, setMapTypeId] = useState("roadmap");

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
    console.log("Selected Property: ", property);
    setIsDetailsVisible(true);

    // 👇 Reset scroll to top
    if (sliderRef.current) {
      sliderRef.current.scrollTop = 0;
    }
  };


  const handleMapClick = (event) => {
    setSelected(event.detail.latLng);
    setSelectedPlace(null);
    setIsDetailsVisible(false);
    console.log(event.detail.latLng);
  };


  useEffect(() => {
    if (properties && properties.length > 0) {
      const centerCoord = getCenterOfBounds(getLocationsCoords(properties));
      if (centerCoord)
        setCenter({ lat: centerCoord.latitude, lng: centerCoord.longitude });

      const zoomLevel = calculateZoomLevel(properties);

      console.log(`Calculated Zoom Level: ${zoomLevel}`);
      setMapZoomLevel(zoomLevel);
    }
  }, [properties]);


  useEffect(() => {
    // Get user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDefaultPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    // get the selected place coordinates
    console.log("Selected Place Coordinates: ", selectedPlace);
  }, [selectedPlace]);

  return (
    <APIProvider apiKey="AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs">
      <div
        className="pt-4 position-relative"
        style={{ height: "97.7vh", width: "100%" }}
      >
        <div className="d-flex justify-content-center align-items-center places-container">
          <div className="places-input">
            <CustomMapControl
              controlPosition={ControlPosition.LEFT_TOP}
              onPlaceSelect={setSelectedPlace}
            />
          </div>
        </div>

        {/* <button
          type="button"
          onClick={() => setLocation("/searchResult")}
          className="btn btn-light position-absolute"
          style={{ zIndex: "1000", marginTop: "4vh", marginLeft: "1vh" }}
        >
          <span style={{ fontSize: "0.9rem", fontWeight: "400" }}>
            Résultats trouvés:{" "}
            <strong>
              {properties && properties.length} propriété
              {properties && properties.length > 1 ? "s" : ""}
            </strong>
          </span>{" "}
          <small style={{ color: "blue" }}>
            <u>Cliquez ici.</u>
          </small>
        </button> */}
        <Map
          zoom={properties && mapZoomLevel ? mapZoomLevel : 13}
          minZoom={6}
          onZoomChanged={(e) => {
            const newZoomLevel = e.detail.zoom;
            // 👇 Change the map type based on zoom level
            if (newZoomLevel > 16) setMapTypeId("hybrid");
            if (newZoomLevel <= 16) setMapTypeId("roadmap");
          }}
          center={properties && center ? center : defaultposition}
          mapId="80e7a8f8db80acb5"
          onClick={handleMapClick}
          mapTypeControlOptions={{ position: ControlPosition.BOTTOM_CENTER }}
          options={{
            fullscreenControl: false,
            streetViewControl: false, // 👈 disable Pegman
          }}
          mapTypeId={mapTypeId} // ✅ Change the map type based on zoom level
        >
          <Markers points={properties} onMarkerClick={handleMarkerClick} />
        </Map>
        <div
          className={`property-details-slide ${isDetailsVisible ? "show" : ""}`}
          style={{
            position: "fixed",
            left: "50%",
            bottom: 0,
            transform: isDetailsVisible
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
              zIndex: 9999,
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
              }}
              onClick={() => setIsDetailsVisible(false)}
            />
          </div>
          {/* Close button to hide the sliding div */}

          {selectedProperty && (
            <div style={{ padding: "5.5vh 1vh 2vh 1vh" }}>
              <PropertyDetailsPage
                key={selectedProperty._id}
                fastPreviewProperty={selectedProperty}
                setIsDetailsVisible={setIsDetailsVisible}
              />
            </div>
          )}
        </div>
      </div>
    </APIProvider>
  );
}

const Markers = ({ points, onMarkerClick }) => {
  const map = useMap();
  const { formatPrice } = useProperty();

  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;
    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  // Cache for adjusted coordinates
  const [adjustedCoordsCache, setAdjustedCoordsCache] = useState({});
  const [usedCoords, setUsedCoords] = useState(new Set());

  const adjustCoordsRandomlyUnique = (coords, id, maxOffset = 0.00027) => {
    if (adjustedCoordsCache[id]) {
      return adjustedCoordsCache[id];
    }

    const randomOffset = () => (Math.random() - 0.5) * maxOffset;
    let newCoords;

    do {
      newCoords = {
        lat: coords.lat + randomOffset(),
        lng: coords.lng + randomOffset(),
      };
    } while (usedCoords.has(`${newCoords.lat},${newCoords.lng}`));

    // Add the new unique coordinates to the used set and cache
    setUsedCoords((prev) => new Set(prev).add(`${newCoords.lat},${newCoords.lng}`));
    setAdjustedCoordsCache((prevCache) => ({
      ...prevCache,
      [id]: newCoords,
    }));

    return newCoords;
  };


  return (
    <>
      {points.map((property) => (
        <AdvancedMarker
          style={{ height: "100px" }}
          position={property?.coords ? property.coords : adjustCoordsRandomlyUnique(property.city.coords, property._id)}
          key={property._id}
          ref={(marker) => setMarkerRef(marker, property._id)}
          onClick={() => onMarkerClick(property)} // When marker is clicked
        >
          <Pin
            background={"red"}
            glyphColor={"white"}
            className={"position-relative"}
          >
            <span
              className="font-weight-bold p-1 position-absolute"
              style={{

                backgroundColor: "#d2ff90",
                left: "50%",
                transform: "translate(-50%, -90%)",
                marginTop: "1rem",
                borderRadius: "5px",
                color: "#000",
                fontSize: "1rem",
                border: "2px solid red",
                borderRadius: "15px",
                whiteSpace: "nowrap", // Prevent line breaks
              }}
            >
              <small>Ar</small>{(property.rent || property.price) &&
                formatPrice(property.rent || property.price)}
              {property?.coords &&
                <small>
                  <ImLocation style={{ marginBottom: "5px", color: "red" }} />
                </small>}
            </span>

          </Pin>
        </AdvancedMarker>
      ))}
    </>
  );
};
