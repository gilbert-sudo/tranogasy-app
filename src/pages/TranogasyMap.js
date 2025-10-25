import { useState, useEffect, useRef, useCallback } from "react";
import { getCenterOfBounds } from "geolib";
import { useSelector, useDispatch } from "react-redux";
import PropertyDetailsPage from "./PropertyDetailsPage";
import TranogasyFeed from "./TranogasyFeed";
import TranogasyList from "./TranogasyList";
import CustomMapControl from "../components/CustomMapControl";
import HouseSearchForm from "../components/HouseSearchForm";
import FilterInfoBox from "../components/FilterInfoBox";
import TranogasyMapSkeleton from "../components/skeletons/TranogasyMapSkeleton";
import Circle from "../components/Circle";
import ResultsDisplayModeCard from "../components/ResultsDisplayModeCard";

import { setReduxFormFilter, resetSearchForm, resetSearchResults, resetTranogasyMap, resetTranogasyList, setTranogasyMapField, setTranogasyFeedField, setTranogasyListField, setUserCurrentPosition } from "../redux/redux";
import { useProperty } from "../hooks/useProperty";
import { useMap as useLocalMapHook } from "../hooks/useMap";
import { useImage } from "../hooks/useImage";
import usePreventGoBack from "../hooks/usePreventGoBack";
import { HashLoader } from "react-spinners";
import {
  Map,
  ControlPosition,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useLoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import { IoMdCloseCircle } from "react-icons/io";
import { MdEditLocationAlt } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BiTargetLock } from "react-icons/bi";

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
      dispatch(resetTranogasyMap());
      dispatch(resetTranogasyList());
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
  const searchForm = useSelector((state) => state.searchForm);
  const geolocation = useSelector((state) => state.geolocation);
  const tranogasyMap = useSelector((state) => state.tranogasyMap);
  const tranogasyFeed = useSelector((state) => state.tranogasyFeed);
  const tranogasyList = useSelector((state) => state.tranogasyList);
  const selectedProperty = tranogasyMap.selectedProperty;
  const [center, setCenter] = useState(geolocation.userCurrentPosition);
  const [mapZoomLevel, setMapZoomLevel] = useState(null);
  const [showMapLoader, setShowMapLoader] = useState(true);
  const [initialCenter, setInitialCenter] = useState(false);

  const [rawSearchResults, setRawSearchResults] = useState(null);

  const [titokMode, setTitokMode] = useState(false);
  const [listViewMode, setListViewMode] = useState(false);

  const [showResultsDisplayModeCard, setShowResultsDisplayModeCard] = useState(false);
  const selectedMarkersHistory = [null, null];
  const defaultCoords = {
    lat: -18.905195365917766,
    lng: 47.52370521426201,
  };

  const [defaultposition, setDefaultPosition] = useState(null);
  const dispatch = useDispatch();
  const { getLocationsCoords, calculateZoomLevel } = useLocalMapHook();
  const { tranogasyMapImg } = useImage();
  const { formatPrice } = useProperty();

  const [isSliderVisible, setIsSlideVisible] = useState(false);
  const sliderRef = useRef(null);
  const activeMarkerRef = useRef(null);
  const [mapTypeId, setMapTypeId] = useState("roadmap");
  const [area, setArea] = useState("Antananarivo");

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

  const updateSelectedMarkersHistory = (property) => {
    selectedMarkersHistory.push(property);
    const remainingElements = selectedMarkersHistory.slice(-2);

    return remainingElements;
  };

  // setShowResultsDisplayModeSubmit 

  const setShowResultsDisplayModeSubmit = (mode) => {

    const isTiktok = (mode === "tiktok");
    const islistViewMode = (mode === "listView");

    isTiktok ? setTitokMode(mode) : setTitokMode(false);
    islistViewMode ? setListViewMode(mode) : setListViewMode(false);

    setShowResultsDisplayModeCard(false)
    handleCloseSlideClick();
  };


  if (!initialCenter) {
    setTimeout(() => {
      setInitialCenter(true);
      console.log("Disable the initialCenter");
    }, 2000);
  }

  const handleMarkerClick = (property, marker) => {
    dispatch(setTranogasyMapField({ key: "selectedProperty", value: property }));

    const updatedHistory = updateSelectedMarkersHistory(property);

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
        console.log("Resetting previous marker icon for property:", updatedHistory);
        activeMarkerRef.current.setIcon(createCustomMarkerIcon(updatedHistory[0], false));
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

  const handleCloseSlideClick = () => {
    setIsSlideVisible(false);
    dispatch(setReduxFormFilter({ formFilter: false }));
  };

  const setCenterTo = (coords) => {
    if (coords) {
      dispatch(setTranogasyMapField({ key: "previousSelectedPlace", value: null }));
      dispatch(setTranogasyMapField({ key: "previousCenter", value: null }));
      setTimeout(() => {
        setCenter(coords);
      }, 50);
      console.log("Center set to:", coords);
    }
  };

  const handleZoomChange = useCallback((event) => {
    const newZoom = event.detail.zoom;
    // setMapZoomChange(true);
    setMapZoomLevel(newZoom);
    setMapTypeId(newZoom > 14 ? "hybrid" : "roadmap");
    // setTimeout(() => {
    //   setMapZoomChange(false);
    //   console.log("Zoom move changed to:", false);
    // }, 5000);
  }, []);

  function MapController({ selectedPlace }) {
    const map = useMap();
    const dispatch = useDispatch();

    const tranogasyMap = useSelector((state) => state.tranogasyMap);

    useEffect(() => {

      const isSameCenter = (JSON.stringify(center || null) === JSON.stringify(tranogasyMap.previousCenter || null));
      const isSameSelectedPlace = (JSON.stringify(searchForm.searchCoordinates || null) === JSON.stringify(tranogasyMap.previousSelectedPlace || null));
      if (!isSameCenter) {
        // console.log("11111111111111111111111111111111111111111111 is a new center");
        dispatch(setTranogasyMapField({ key: "previousCenter", value: center }));
        if (map && center && !searchForm.searchCoordinates) {
          map.panTo(center);
          map.setZoom(mapZoomLevel);
          // console.log("MapController panning to center:", center, isSameCenter);
        }
      }
      if (!isSameSelectedPlace) {
        // console.log("11111111111111111111111111111111111111111111 is a new selectedPlace");
        dispatch(setTranogasyMapField({ key: "previousSelectedPlace", value: searchForm.searchCoordinates }));
        if (map && searchForm.searchCoordinates) {
          // console.log("MapController panning to selectedPlace:", selectedPlace);
          map.panTo(searchForm.searchCoordinates);
          map.setZoom(15);
        }
      }

    }, [map, tranogasyMap.previousCenter, tranogasyMap.previousSelectedPlace]);

    return null; // this component doesn’t render anything visible
  }

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
  }, []);

  useEffect(() => {
    setRawSearchResults(tranogasyMap.rawSearchResults)
    if (tranogasyMap.rawSearchResults && tranogasyMap.rawSearchResults.length > 0) {

      const centerCoord = getCenterOfBounds(getLocationsCoords(tranogasyMap.rawSearchResults));
      const zoomLevel = calculateZoomLevel(tranogasyMap.rawSearchResults);

      if (searchForm.searchCoordinates) {
        setCenterTo(searchForm.searchCoordinates);
        console.log("running set selected place to center", searchForm.searchCoordinates);
      } else {
        if (centerCoord)
          setCenter({ lat: centerCoord.latitude, lng: centerCoord.longitude });
        setMapZoomLevel(zoomLevel);
        console.log("running set search results to center", centerCoord, zoomLevel);
      }
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
  }, [tranogasyMap.rawSearchResults]);


  useEffect(() => {
    (geolocation.userCurrentPosition) && setDefaultPosition(geolocation.userCurrentPosition)
    // Get user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // SUCCESS CALLBACK
        (position) => {
          // Add a condition to check if coords are valid
          if (position && position.coords && position.coords.latitude !== undefined) {
            console.log("Geolocation success:", {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });

            setDefaultPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            dispatch(setUserCurrentPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }));
          } else {
            // FALLBACK: If the success callback ran but coords are missing/invalid
            console.log("Geolocation success, but no coordinates received. Using default coords.");
            setDefaultPosition(defaultCoords);
          }
        },
        // ERROR CALLBACK (already handles permission denied and timeouts)
        (error) => {
          console.error(error);
          setDefaultPosition(defaultCoords);
          console.log("Geolocation error, using default coords:", defaultCoords);
        }
      );
    } else {
      setDefaultPosition(defaultCoords);
      console.log("Geolocation is not supported by this browser.");
    }
    console.log("User's current position:", geolocation.userCurrentPosition);

  }, [geolocation.userCurrentPosition]);


  useEffect(() => {
    let formFilter = tranogasyMap.formFilter;
    formFilter ? setIsSlideVisible(true) : setIsSlideVisible(false);
  }, [tranogasyMap.formFilter]);

  usePreventGoBack((isSliderVisible || tranogasyList.isListViewSliderVisible || tranogasyFeed.isFeedSliderVisible), () => {
    if (isSliderVisible) {
      handleCloseSlideClick();
    }
    if (tranogasyFeed.isFeedSliderVisible) {
      dispatch(setTranogasyFeedField({ key: "isFeedSliderVisible", value: false }));
    }
    if (tranogasyList.isListViewSliderVisible) {
      dispatch(setTranogasyListField({ key: "isListViewSliderVisible", value: false }));
    }
  });

  useEffect(() => {
    // console.log("search form redux state", searchForm);
    if (searchForm.address) {
      const sentence = searchForm.address;

      const match = sentence.trim().match(/(\w+,?\s*\w+)/);

      const firstTwoWords = match ? match[1] : '';

      setArea(firstTwoWords);
    }

  }, [searchForm.address]);

  return (
    <div
      className={`position-relative ${(!(titokMode)) ? "pt-4" : ""}`}
      style={{ height: "97.7dvh", width: "100%" }}
    >
      <div className="d-flex justify-content-center align-items-center places-container">
        <div className="places-input">
          <CustomMapControl
            controlPosition={ControlPosition.LEFT_TOP}
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
              height: "100dvh",
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
      {!titokMode && !listViewMode &&
        <>
          <Map
            minZoom={9}
            zoom={mapZoomLevel}
            onZoomChanged={handleZoomChange}
            center={initialCenter ? defaultCoords : (rawSearchResults ? center : defaultposition)} // Default center if no search results Antananarivo
            mapId="80e7a8f8db80acb5"
            mapTypeControlOptions={{ position: ControlPosition.BOTTOM_CENTER }}
            options={{
              fullscreenControl: false,
              streetViewControl: false, // 👈 disable Pegman
              cameraControl: false,
              gestureHandling: 'greedy',
            }}
            mapTypeId={mapTypeId} // ✅ Change the map type based on zoom level
          >
            <MapController selectedPlace={searchForm.searchCoordinates} />

            {/* Pass adjustCoordsRandomlyUnique to Markers to use its internal cache */}
            <Markers points={(rawSearchResults && rawSearchResults.length > 0) ? rawSearchResults : properties} onMarkerClick={handleMarkerClick} adjustCoordsRandomlyUnique={adjustCoordsRandomlyUnique} createCustomMarkerIcon={createCustomMarkerIcon} />
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
                  radius={800}
                  strokeColor={"#4285F4"}
                  strokeOpacity={2}
                  fillOpacity={0}
                  strokeWeight={3}
                  clickable={false} // Add this line to make it click-through
                />
              </>
            )}

            {searchForm.searchCoordinates &&
              <Circle
                center={searchForm.searchCoordinates} // Default center if no search results Antananarivo
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
          {searchForm.searchCoordinates &&
            <div
              className="search-area-card shadow-sm"
              style={{
                position: "absolute",
                top: "97px",
                left: "10px",
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "6px 8px",
                borderRadius: "30px",
                // BEFORE: fontSize: "13px",
                fontSize: "clamp(12px, 2.5vw, 14px)", // 👈 RESPONSIVE
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                gap: "3px",
                cursor: "pointer",
              }}
              onClick={() => {
                setCenterTo(searchForm.searchCoordinates);
                setMapZoomLevel(15);
              }}
            >
              <strong>
                <FaLocationDot className="mb-2" style={{ fontSize: "14px", fontWeight: "bold", color: "red" }} />
                {area && area} - Rayon : 800 m
              </strong>
              <button
                type="button"
                style={{
                  border: "none",
                  padding: "5px",
                  borderRadius: "50%",
                  background: "#7cbd1e",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                }}
              >
                <BiTargetLock />
              </button>
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
                <MdEditLocationAlt />
                <small style={{
                  fontSize: "9px",
                  fontWeight: "bold"
                }}>
                  Changer
                </small>
              </button>
            </div>
          }

        </>
      }
      {/* Filter info box */}
      {!showMapLoader && !tranogasyList.isListViewSliderVisible && !tranogasyFeed.isFeedSliderVisible &&
      <FilterInfoBox mode={titokMode} />
      }
      {titokMode &&
        <TranogasyFeed
          payload={(searchResults && searchResults.length > 0) ? searchResults : properties}
          route={"searchResult"}
          setTitokMode={setTitokMode}
        />
      }
      {listViewMode &&
        <TranogasyList
          payload={(searchResults && searchResults.length > 0) ? searchResults : properties}
          route={"searchResult"}
          setListViewMode={setListViewMode}
        />
      }

      {showResultsDisplayModeCard &&
        <ResultsDisplayModeCard
          setShowResultsDisplayModeSubmit={setShowResultsDisplayModeSubmit}
          handleCloseSlideClick={handleCloseSlideClick}
          setShowResultsDisplayModeCard={setShowResultsDisplayModeCard}
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
          height: "95dvh",
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
              opacity: tranogasyMap.formFilter && searchResults && searchResults.length === 0 ? 0.4 : 1,
              pointerEvents: tranogasyMap.formFilter && searchResults && searchResults.length === 0 ? "none" : "auto",
              transition: "opacity 0.3s ease",
            }}
            onClick={() => {
              if (tranogasyMap.formFilter && searchResults && searchResults.length === 0) return;
              handleCloseSlideClick();
            }}
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
          <HouseSearchForm setShowResultsDisplayModeCard={setShowResultsDisplayModeCard} mode={titokMode} />
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
