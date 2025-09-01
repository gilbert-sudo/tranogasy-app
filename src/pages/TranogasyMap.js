import { useState, useEffect, useRef, useCallback } from "react";
import { getCenterOfBounds } from "geolib";
import { useSelector, useDispatch } from "react-redux";
import PropertyDetailsPage from "./PropertyDetailsPage";
import CustomMapControl from "../components/CustomMapControl";
import HouseSearchForm from "../components/HouseSearchForm";
import PropertyCarousel from "../components/PropertyCarousel";

import { setReduxFormFilter, setSearchResults, resetSearchForm, resetSearchResults, setSearchFormField } from "../redux/redux";
import { useProperty } from "../hooks/useProperty";
import { useMap as useLocalMapHook } from "../hooks/useMap";
import { useImage } from "../hooks/useImage";
import { HashLoader } from "react-spinners";
import {
  APIProvider,
  Map,
  ControlPosition,
  useMap,
} from "@vis.gl/react-google-maps";
import { useLoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import { IoMdCloseCircle } from "react-icons/io";

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
    if (!isLoaded) return <div>Chargement de la carte...</div>;
    return <MyMap />;
  }
}


function MyMap() {

  const properties = useSelector((state) => state.properties);
  const searchResults = useSelector((state) => state.searchResults);
  const geolocation = useSelector((state) => state.geolocation);
  const searchForm = useSelector((state) => state.searchForm);
  const selectedProperty = searchForm.selectedProperty;
  const initialPropertiesState = useSelector((state) => state.properties);
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

  const [isSliderVisible, setIsSlideVisible] = useState(false);
  const sliderRef = useRef(null);
  const [mapTypeId, setMapTypeId] = useState("roadmap");

  // Define adjustCoordsRandomlyUnique here or pass it down if it's external
  // For simplicity, defining it here to be accessible within MyMap
  const [adjustedCoordsCache, setAdjustedCoordsCache] = useState({});
  const [usedCoords, setUsedCoords] = useState(new Set());

  const adjustCoordsRandomlyUnique = (coords, id, maxOffset = 0.002) => {
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


  const handleMarkerClick = async (property, markerFinalCoords, fullFunction) => {
    dispatch(setSearchFormField({ key: "selectedProperty", value: property }));

    if (fullFunction) {
      setIsSlideVisible(true);
    }

    // 👇 Reset scroll to top
    if (sliderRef.current) {
      sliderRef.current.scrollTop = 0;
    }

    // Determine the finalCoords for centering
    const coordsToCenter = markerFinalCoords || (
      property?.coords
        ? property.coords
        : (property.city?.coords ? adjustCoordsRandomlyUnique(property.city.coords, property._id) : null)
    );

    console.log("Selected Property: ", property, coordsToCenter);

    if (coordsToCenter && !fullFunction) {
      setCenter(coordsToCenter);
      setMapZoomLevel(19); // Adjust zoom level as needed for a good view of the property
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
    if (selectedPlace) {
      dispatch(setSearchResults(initialPropertiesState.filter(property => property.rent)));
      setTimeout(() => {
        setCenter(selectedPlace);
        setMapZoomLevel(15); // Set a higher zoom level when a place is selected
        dispatch(resetSearchForm());
      }, 1000);
    }
  }, [selectedPlace]);

  useEffect(() => {
    let formFilter = searchForm.formFilter;
    formFilter ? setIsSlideVisible(true) : setIsSlideVisible(false);
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
          <Markers points={(searchResults && searchResults.length > 0) ? searchResults : properties} onMarkerClick={handleMarkerClick} adjustCoordsRandomlyUnique={adjustCoordsRandomlyUnique} />
          {/* Pass null for markerFinalCoords when clicking from the carousel */}
          {/* {showCarousel &&
            <PropertyCarousel
              visibleProperties={properties.filter((property) => property.rent)}
              onItemClick={handleMarkerClick}
            />
          } */}
        </Map>

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
          {searchForm.formFilter && (
            <div style={{ padding: "5.5vh 1vh 2vh 1vh" }}>
              <HouseSearchForm handleCloseSlideClick={handleCloseSlideClick} />
            </div>
          )}

          {selectedProperty && !searchForm.formFilter && isSliderVisible && (
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


const Markers = ({ points, onMarkerClick, adjustCoordsRandomlyUnique }) => {
  const map = useMap();
  const { formatPrice } = useProperty();
  const selectedProperty = useSelector((state) => state.searchForm.selectedProperty);

  const markersRef = useRef([]);
  const clusterer = useRef(null);

  const createCustomMarkerIcon = (property, isSelected) => {
    const price = formatPrice(property.rent || property.price);

    // Base dimensions
    const baseWidth = 80;
    const baseHeight = 28;
    const tipHeight = 5;

    // Increase size if selected
    const width = isSelected ? baseWidth * 1.1 : baseWidth;
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


  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = points.map((property) => {
      const finalCoords = property?.coords
        ? property.coords
        : adjustCoordsRandomlyUnique(property.city.coords, property._id);

      const isSelected = selectedProperty && selectedProperty._id === property._id;

      const marker = new window.google.maps.Marker({
        position: finalCoords,
        map,
        icon: createCustomMarkerIcon(property, isSelected),
        zIndex: isSelected ? 9999 : 1, // ⭐ high value for selected
      });

      marker.addListener("click", () => {
        onMarkerClick(property, finalCoords, true);
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
  }, [points, map, adjustCoordsRandomlyUnique, selectedProperty]);

  return null;
};
