import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getCenterOfBounds, getBounds, getDistance } from "geolib";
import { useSelector, useDispatch } from "react-redux";
import NoResultFound from "../components/NoResultFound";
import SearchLoader from "../components/SearchLoader";
import PropertyDetailsPage from "./PropertyDetailsPage";
import CustomMapControl from "../components/CustomMapControl";
import HouseSearchForm from "../components/HouseSearchForm";

import { setReduxFormFilter } from "../redux/redux";
import { useProperty } from "../hooks/useProperty";
import { useMap as useLocalMapHook } from "../hooks/useMap";
import {
  APIProvider,
  Map,
  ControlPosition,
  useMap,
} from "@vis.gl/react-google-maps";
import { useLoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import { IoMdCloseCircle } from "react-icons/io";
import { ImLocation } from "react-icons/im";

export default function TranogasyMap() {

  const properties = useSelector((state) => state.properties);

  const searchForm = useSelector((state) => state.searchForm);
  console.log("Search Form: ", searchForm);

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
    // return <SearchLoader />;
    return <MyMap properties={properties} />;
  }
}


function MyMap({ properties }) {
  const geolocation = useSelector((state) => state.geolocation);
  const searchForm = useSelector((state) => state.searchForm);
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
  const [isDetailsVisible, setIsSlideVisible] = useState(false);
  const sliderRef = useRef(null);
  const map = useMap();
  const [mapTypeId, setMapTypeId] = useState("roadmap");

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
    console.log("Selected Property: ", property);
    setIsSlideVisible(true);

    // 👇 Reset scroll to top
    if (sliderRef.current) {
      sliderRef.current.scrollTop = 0;
    }
  };


  const handleMapClick = (event) => {
    setSelected(event.detail.latLng);
    setSelectedPlace(null);
    setIsSlideVisible(false);
    console.log(event.detail.latLng);
  };

  const handleCloseSlideClick = (event) => {
    setIsSlideVisible(false);
    dispatch(setReduxFormFilter({ formFilter: false }));
    setSelectedProperty(null);
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

  useEffect(() => {
    let formFilter = searchForm.formFilter;
    formFilter ? setIsSlideVisible(true) : setIsSlideVisible(false);
    console.log("Form Filter: ", formFilter);
  }, [searchForm.formFilter]);

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
              onClick={handleCloseSlideClick}
            />
          </div>
          {/* Close button to hide the sliding div */}
          {searchForm.formFilter && (
            <div style={{ padding: "5.5vh 1vh 2vh 1vh" }}>
              <HouseSearchForm handleCloseSlideClick={handleCloseSlideClick} />
            </div>
          )}
          {selectedProperty && (
              <PropertyDetailsPage
                key={selectedProperty._id}
                fastPreviewProperty={selectedProperty}
                handleCloseSlideClick={handleCloseSlideClick}
              />
          )}

        </div>
      </div>
    </APIProvider>
  );
}

//   const map = useMap();
//   const { formatPrice } = useProperty();

//   const [markers, setMarkers] = useState({});
//   const clusterer = useRef(null);

//   useEffect(() => {
//     if (!map) return;
//     if (!clusterer.current) {
//       clusterer.current = new MarkerClusterer({ map });
//     }
//   }, [map]);

//   useEffect(() => {
//     clusterer.current?.clearMarkers();
//     clusterer.current?.addMarkers(Object.values(markers));
//   }, [markers]);


//   const setMarkerRef = (marker, key) => {
//   // Only update if marker is truly new or removed
//   if (marker && markers[key] === marker) return;
//   if (!marker && !markers[key]) return;

//   setMarkers((prev) => {
//     if (marker) {
//       return { ...prev, [key]: marker };
//     } else {
//       const newMarkers = { ...prev };
//       delete newMarkers[key];
//       return newMarkers;
//     }
//   });
// };


//   // Cache for adjusted coordinates
//   const [adjustedCoordsCache, setAdjustedCoordsCache] = useState({});
//   const [usedCoords, setUsedCoords] = useState(new Set());

//   const adjustCoordsRandomlyUnique = (coords, id, maxOffset = 0.00027) => {
//     if (adjustedCoordsCache[id]) {
//       return adjustedCoordsCache[id];
//     }

//     const randomOffset = () => (Math.random() - 0.5) * maxOffset;
//     let newCoords;

//     do {
//       newCoords = {
//         lat: coords.lat + randomOffset(),
//         lng: coords.lng + randomOffset(),
//       };
//     } while (usedCoords.has(`${newCoords.lat},${newCoords.lng}`));

//     // Add the new unique coordinates to the used set and cache
//     setUsedCoords((prev) => new Set(prev).add(`${newCoords.lat},${newCoords.lng}`));
//     setAdjustedCoordsCache((prevCache) => ({
//       ...prevCache,
//       [id]: newCoords,
//     }));

//     return newCoords;
//   };


//   return (
//     <>
//       {points.map((property) => (
//         <AdvancedMarker
//           style={{ height: "100px" }}
//           position={property?.coords ? property.coords : adjustCoordsRandomlyUnique(property.city.coords, property._id)}
//           key={property._id}
//           ref={(marker) => setMarkerRef(marker, property._id)}
//           onClick={() => onMarkerClick(property)} // When marker is clicked
//         >
//           <Pin
//             background={"red"}
//             glyphColor={"white"}
//             className={"position-relative"}
//           >
//             <span
//               className="font-weight-bold p-1 position-absolute"
//               style={{

//                 backgroundColor: "#d2ff90",
//                 left: "50%",
//                 transform: "translate(-50%, -90%)",
//                 marginTop: "1rem",
//                 borderRadius: "5px",
//                 color: "#000",
//                 fontSize: "1rem",
//                 border: "2px solid red",
//                 borderRadius: "15px",
//                 whiteSpace: "nowrap", // Prevent line breaks
//               }}
//             >
//               <small>Ar</small>{(property.rent || property.price) &&
//                 formatPrice(property.rent || property.price)}
//               {property?.coords &&
//                 <small>
//                   <ImLocation style={{ marginBottom: "5px", color: "red" }} />
//                 </small>}
//             </span>

//           </Pin>
//         </AdvancedMarker>
//       ))}
//     </>
//   );
// };

const Markers = ({ points, onMarkerClick }) => {
  const map = useMap();
  const { formatPrice } = useProperty();

  const markersRef = useRef([]);
  const clusterer = useRef(null);

  const [adjustedCoordsCache, setAdjustedCoordsCache] = useState({});
  const [usedCoords, setUsedCoords] = useState(new Set());
  const [visiblePoints, setVisiblePoints] = useState([]);

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

    setUsedCoords((prev) => new Set(prev).add(`${newCoords.lat},${newCoords.lng}`));
    setAdjustedCoordsCache((prevCache) => ({
      ...prevCache,
      [id]: newCoords,
    }));

    return newCoords;
  };


  const createCustomMarkerIcon = (property) => {
    const price = formatPrice(property.rent || property.price);
    const width = 80;
    const rectHeight = 28;
    const tipHeight = 5;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${rectHeight + tipHeight + 10}">
      <rect x="5" y="5" rx="15" ry="15" width="${width - 10}" height="${rectHeight}" fill="#d2ff90" stroke="red" stroke-width="2"/>
      <text x="${width / 2}" y="${5 + rectHeight / 2 + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="#000">Ar ${price}</text>
    </svg>`;

    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      scaledSize: new window.google.maps.Size(width, rectHeight + tipHeight + 10),
      anchor: new window.google.maps.Point(
        width / 2,
        rectHeight + tipHeight + 10
      ),
    };
  };



  useEffect(() => {
    if (!map) return;

    const updateVisiblePoints = () => {
      const bounds = map.getBounds();
      if (!bounds) return;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      // Add margin buffer
      const latMargin = (ne.lat() - sw.lat()) * 0.1;
      const lngMargin = (ne.lng() - sw.lng()) * 0.1;

      const extendedBounds = {
        north: ne.lat() + latMargin,
        south: sw.lat() - latMargin,
        east: ne.lng() + lngMargin,
        west: sw.lng() - lngMargin,
      };

      const filtered = points.filter((property) => {
        const coords = property?.coords ? property.coords : property.city.coords;
        const lat = coords.lat;
        const lng = coords.lng;
        return (
          lat >= extendedBounds.south &&
          lat <= extendedBounds.north &&
          lng >= extendedBounds.west &&
          lng <= extendedBounds.east
        );
      });

      setVisiblePoints(filtered);
    };

    // Update points initially
    updateVisiblePoints();

    // Add listener for map move or zoom
    map.addListener("idle", updateVisiblePoints);

    // Cleanup
    return () => {
      google.maps.event.clearListeners(map, "idle");
    };
  }, [points, map]);

  useEffect(() => {
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    const newMarkers = visiblePoints.map((property) => {
      const finalCoords = property?.coords
        ? property.coords
        : adjustCoordsRandomlyUnique(property.city.coords, property._id);

      const marker = new window.google.maps.Marker({
        position: finalCoords,
        map,
        icon: createCustomMarkerIcon(property),
      });

      marker.addListener("click", () => {
        onMarkerClick(property);
      });

      return marker;
    });

    // Update clusterer
    if (clusterer.current) {
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(newMarkers);
    } else {
      clusterer.current = new MarkerClusterer({ map, markers: newMarkers });
    }

    markersRef.current = newMarkers;

    // Cleanup on unmount
    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [visiblePoints, map]);

  return null;
};
