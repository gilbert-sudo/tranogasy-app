import { useState, useEffect, useRef, useCallback } from "react";
import { getCenterOfBounds } from "geolib";
import { useSelector, useDispatch } from "react-redux";
import PropertyDetailsPage from "./PropertyDetailsPage";
import CustomMapControl from "../components/CustomMapControl";
import HouseSearchForm from "../components/HouseSearchForm";
import TranogasyMapSkeleton from "../components/skeletons/TranogasyMapSkeleton";
import Circle from "../components/Circle";

import { setReduxFormFilter, resetSearchForm, resetSearchResults, setTranogasyMapField, setUserCurrentPosition } from "../redux/redux";
import { useProperty } from "../hooks/useProperty";
import { useMap as useLocalMapHook } from "../hooks/useMap";
import { useImage } from "../hooks/useImage";
import { HashLoader } from "react-spinners";
import {
  APIProvider,
  Map,
  ControlPosition,
  useMap,
  AdvancedMarker
} from "@vis.gl/react-google-maps";
import { useLoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import { IoMdCloseCircle } from "react-icons/io";
import { MdEditLocationAlt } from "react-icons/md";
import { FaUser } from "react-icons/fa";

import "./css/custom-advanced-marker.css";

export default function TranogasyMap() {

  const properties = useSelector((state) => state.properties);

  const dispatch = useDispatch();

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
      console.log("Component unmount — reset states");
      dispatch(resetSearchResults());
      dispatch(resetSearchForm());
    };
    // Call the cleanup function when the component unmounts
    return cleanupFunction;
  }, []);

  if (properties) {
    if (!isLoaded) return <TranogasyMapSkeleton />;
    return <MyMap />;
  }
}


function MyMap() {

  const properties = useSelector((state) => state.properties);
  const searchResults = useSelector((state) => state.searchResults);
  const geolocation = useSelector((state) => state.geolocation);
  const tranogasyMap = useSelector((state) => state.tranogasyMap);
  const selectedProperty = tranogasyMap.selectedProperty;
  const [selected, setSelected] = useState(null);
  const [center, setCenter] = useState(geolocation.userCurrentPosition);
  const [mapZoomLevel, setMapZoomLevel] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showMapLoader, setShowMapLoader] = useState(true);

  const [defaultposition, setDefaultPosition] = useState(
    geolocation.userCurrentPosition
  );
  const dispatch = useDispatch();
  const { getLocationsCoords, calculateZoomLevel } = useLocalMapHook();
  const { tranogasyMapImg } = useImage();
  const { formatPrice } = useProperty();

  const [isSliderVisible, setIsSlideVisible] = useState(false);
  const sliderRef = useRef(null);
  const activeMarkerRef = useRef(null);
  const [mapTypeId, setMapTypeId] = useState("roadmap");

  // Define adjustCoordsRandomlyUnique here or pass it down if it's external
  // For simplicity, defining it here to be accessible within MyMap
  const [adjustedCoordsCache, setAdjustedCoordsCache] = useState({});
  const [usedCoords, setUsedCoords] = useState(new Set());

  const adjustCoordsRandomlyUnique = (coords, id, maxOffset = 0.0025) => {
    if (adjustedCoordsCache[id]) {
      return adjustedCoordsCache[id];
    }

    const randomOffset = () => (Math.random() - 0.7) * maxOffset;
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

  const createCustomMarkerIcon = (property, isSelected) => {

    const price = formatPrice(property?.rent || property?.price);

    // Base dimensions
    const baseWidth = 80;
    const baseHeight = 28;
    const tipHeight = 5;

    // Increase size if selected
    const width = baseWidth * 1.1;
    const rectHeight = isSelected ? baseHeight * 1.1 : baseHeight;
    const svgHeight = rectHeight + tipHeight + 10;

    // Colors (back to your previous choice!)
    const fillColor = isSelected ? "#ffcccc" : "#d2ff90";
    const strokeColor = isSelected ? "#ff0000" : "red";
    const textColor = "#000000";

    // Transparent inner border when selected
    const innerBorder = isSelected
      ? `<rect x="7" y="7" rx="13" ry="13" width="${width - 14}" height="${rectHeight - 4}" fill="none" stroke="transparent" stroke-width="2"/>`
      : "";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${svgHeight}">
                      <rect x="5" y="5" rx="15" ry="15" width="${width - 10}" height="${rectHeight}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3"/>
                      ${innerBorder}
                      <text x="${width / 2}" y="${5 + rectHeight / 2 + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="${textColor}">Ar ${price}</text>
                    </svg>`;

    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      scaledSize: new window.google.maps.Size(width, svgHeight),
      anchor: new window.google.maps.Point(width / 2, svgHeight),
    };
  };


  const handleMarkerClick = async (property, marker) => {
    dispatch(setTranogasyMapField({ key: "selectedProperty", value: property }));

    setIsSlideVisible(true);

    // Reset scroll
    if (sliderRef.current) {
      sliderRef.current.scrollTop = 0;
    }

    // 👉 Add active to clicked one
    if (marker) {
      // 👉 Remove active from all markers
      // This is handled by resetting the icon of the previously active marker
      if (activeMarkerRef.current && activeMarkerRef.current !== marker) {
        const prevProperty = tranogasyMap.selectedProperty;
        activeMarkerRef.current.setIcon(createCustomMarkerIcon(prevProperty, false));
        activeMarkerRef.current.setZIndex(1); // Reset previous marker zIndex
      }
      //Change the marker's icon to indicate it's active
      marker.setIcon(createCustomMarkerIcon(property, true));

      //change the marker size or icon to indicate it's active
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1400);

      //bring the marker to front
      marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1); // Bring to front
      if (activeMarkerRef.current && activeMarkerRef.current !== marker) {
        activeMarkerRef.current.setZIndex(1); // Reset previous marker zIndex
      }
      activeMarkerRef.current = marker;
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
  };

  const handleZoomChange = useCallback((event) => {
    const newZoom = event.detail.zoom;
    // Update zoom and map type immediately
    setMapZoomLevel(newZoom);
    setMapTypeId(newZoom > 14 ? "hybrid" : "roadmap");
  }, []);

  useEffect(() => {
    if (properties && properties.length > 0) {
      const centerCoord = getCenterOfBounds(getLocationsCoords(properties));
      if (centerCoord)
        setCenter({ lat: centerCoord.latitude, lng: centerCoord.longitude });

      const zoomLevel = calculateZoomLevel(properties);
      setMapZoomLevel(zoomLevel);
      if (showMapLoader) {
        const timeoutDuration = 2500; // Duration in milliseconds to show the loader
        setTimeout(() => {
          setMapZoomLevel(14);
          setTimeout(() => {
            setShowMapLoader(false);
          }, 250);
        }, timeoutDuration);
      }
    }
  }, [properties]);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      const centerCoord = getCenterOfBounds(getLocationsCoords(searchResults));
      if (centerCoord)
        setCenter({ lat: centerCoord.latitude, lng: centerCoord.longitude });

      const zoomLevel = calculateZoomLevel(searchResults);
      setMapZoomLevel(zoomLevel);
      if (showMapLoader) {
        const timeoutDuration = 2500; // Duration in milliseconds to show the loader
        setTimeout(() => {
          setMapZoomLevel(14);
          setTimeout(() => {
            setShowMapLoader(false);
          }, 250);
        }, timeoutDuration);
      }
    }
  }, [searchResults]);


  useEffect(() => {
    // Get user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDefaultPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          dispatch(setUserCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    console.log("User's current position:", geolocation.userCurrentPosition);

  }, [geolocation.userCurrentPosition]);

  useEffect(() => {
    // get the selected place coordinates
    if (selectedPlace) {
      setTimeout(() => {
        setMapZoomLevel(15); // Set a higher zoom level when a place is selected
        setCenter(selectedPlace);
        setTimeout(() => {
          dispatch(setReduxFormFilter({ formFilter: true }));
        }, 0);
      }, 1000);
    }
  }, [selectedPlace]);

  useEffect(() => {
    let formFilter = tranogasyMap.formFilter;
    formFilter ? setIsSlideVisible(true) : setIsSlideVisible(false);
  }, [tranogasyMap.formFilter]);

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
        {showMapLoader && (
          <>
            {/* Overlay */}
            <div
              style={{
                position: "fixed",
                top: 47,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.4)",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Centered Loader Box */}
              <div
                style={{
                  background: "#fff",
                  marginTop: "-80px",
                  padding: "25px",
                  borderRadius: "50%",
                  textAlign: "center",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                  zIndex: 10000,
                }}
              >
                {/* SVG logo on top */}
                <img
                  src={tranogasyMapImg()}
                  alt="TranoGasy logo"
                  style={{ width: "80px", height: "80px" }}
                />

                {/* Spinner + text */}
                <div className="d-flex justify-content-center align-items-center">
                  <small className="mr-2" style={{ color: "#c59d45" }}>
                    Chargement
                  </small>
                  <HashLoader color="#c59d45" size={20} />
                </div>
              </div>
            </div>
          </>
        )}

        <Map
          minZoom={9}
          zoom={mapZoomLevel}
          onZoomChanged={handleZoomChange}
          center={searchResults ? center : {
            lat: -18.905195365917766,
            lng: 47.52370521426201,
          }} // Default center if no search results Antananarivo
          mapId="80e7a8f8db80acb5"
          onClick={handleMapClick}
          mapTypeControlOptions={{ position: ControlPosition.BOTTOM_CENTER }}
          options={{
            fullscreenControl: false,
            streetViewControl: false, // 👈 disable Pegman
            gestureHandling: 'greedy'
          }}
          mapTypeId={mapTypeId} // ✅ Change the map type based on zoom level
        >
          {/* Pass adjustCoordsRandomlyUnique to Markers to use its internal cache */}
          <Markers points={(searchResults && searchResults.length > 0) ? searchResults : properties} onMarkerClick={handleMarkerClick} adjustCoordsRandomlyUnique={adjustCoordsRandomlyUnique} createCustomMarkerIcon={createCustomMarkerIcon} />
          {geolocation.userCurrentPosition && (
            <>
              <AdvancedMarker
                position={geolocation.userCurrentPosition}
                title="Vous êtes ici"
                className="user-marker"
              >
                <div className="user-marker-pin">
                  <FaUser size={16} style={{ marginRight: '4px' }} />
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4285F4' }}>Vous</span>
                </div>
              </AdvancedMarker>
              <Circle
                center={geolocation.userCurrentPosition} // Default center if no search results Antananarivo
                radius={1000}
                strokeColor={"#4285F4"}
                strokeOpacity={2}
                fillOpacity={0}
                strokeWeight={3}
                clickable={false} // Add this line to make it click-through
              />
            </>
          )}

          {selectedPlace &&
            <Circle
              center={selectedPlace} // Default center if no search results Antananarivo
              radius={800}
              strokeColor={"#7cbd1e"}
              strokeOpacity={2}
              fillOpacity={0}
              strokeWeight={4}
              clickable={false} // Add this line to make it click-through
            />
          }
        </Map>
        {/* Zone de recherche info card */}
        {selectedPlace &&
          <div
            style={{
              position: "absolute",
              top: "97px",
              left: "10px",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              padding: "6px 8px",
              borderRadius: "30px",
              fontSize: "13px",
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <strong>Antananarivo — Rayon : 15 km</strong>
            <button
              onClick={() => alert("Fonctionnalité à venir")}
              style={{
                border: "none",
                padding: "5px",
                borderRadius: "30px",
                background: "#7cbd1e",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
            >
              <MdEditLocationAlt /> <small style={{ fontSize: "9px", fontWeight: "bold" }}>Changer</small>
            </button>
          </div>
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
          <div
            style={{
              padding: "5.5vh 1vh 2vh 1vh",
              width: tranogasyMap.formFilter ? "auto" : "0",
              height: tranogasyMap.formFilter ? "auto" : "0",
              overflow: tranogasyMap.formFilter ? "visible" : "hidden",
              opacity: tranogasyMap.formFilter ? 1 : 0,
              transition: "all 0.3s ease"
            }}
          >
            <HouseSearchForm handleCloseSlideClick={handleCloseSlideClick} />
          </div>


          {selectedProperty && !tranogasyMap.formFilter && isSliderVisible && (
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


const Markers = ({ points, onMarkerClick, adjustCoordsRandomlyUnique, createCustomMarkerIcon }) => {
  const map = useMap();
  const markersRef = useRef([]);
  const clusterer = useRef(null);
  const formFilter = useSelector((state) => state.tranogasyMap.formFilter);

  useEffect(() => {
    if (!map) return;
    if (formFilter) return;

    console.log("Updating markers...");

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = points.map((property) => {
      const finalCoords = property?.coords
        ? property.coords
        : adjustCoordsRandomlyUnique(property.city.coords, property._id);

      const marker = new window.google.maps.Marker({
        position: finalCoords,
        map,
        icon: createCustomMarkerIcon(property, false),
        zIndex: 1,
      });

      marker.addListener("click", () => {
        onMarkerClick(property, marker);
      });

      return marker;
    });

    if (clusterer.current) {
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(newMarkers);
    } else {
      clusterer.current = new MarkerClusterer({ map, markers: newMarkers });
    }

    markersRef.current = newMarkers;

    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [points, formFilter]);


  return null;
};
