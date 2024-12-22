import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setReduxGmapValue } from "../redux/redux";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { useLoadScript } from "@react-google-maps/api";
import Circle from "../components/Circle";
import CustomMapControl from "../components/CustomMapControl";

export default function PropertyAreaSelector() {
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

  useEffect(() => {
    // Handle fullscreenchange event
    const handleFullscreenChange = function (event) {
      let target = event.target;
      let pacContainerElements =
        document.getElementsByClassName("pac-container");
      if (pacContainerElements.length > 0) {
        let pacContainer = document.getElementsByClassName("pac-container")[0];
        if (pacContainer.parentElement === target) {
          document.getElementsByTagName("BODY")[0].appendChild(pacContainer);
        } else {
          target.appendChild(pacContainer);
          console.log("GO ON FULL SCREEN", target);
        }
      } else {
        console.log("FULL SCREEN change - no pacContainer found");
      }
    };

    document.onfullscreenchange = handleFullscreenChange;

    // Cleanup function to remove the event listener when component unmounts
    return () => {
      document.onfullscreenchange = null;
    };
  }, []);

  if (!isLoaded) return <div>Chargement de la carte...</div>;
  return <MyMap />;
}

function MyMap() {
  const geolocation = useSelector((state) => state.geolocation);
  const [selected, setSelected] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [defaultposition, setDefaultPosition] = useState(geolocation.userCurrentPosition);
  const [radius, setRadius] = useState(500);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleMapClick = (event) => {
    setSelected(event.detail.latLng);
    setSelectedPlace(null);
    console.log(event.detail.latLng);
  };

  useEffect(() => {
    var circleCenter = !selectedPlace
      ? !selected
        ? defaultposition
        : selected
      : selectedPlace;
    var circleRadius = radius;
    dispatch(
      setReduxGmapValue({
        gmapValue: {
          circleCenter: {
            lat: typeof circleCenter.lat == 'function' ? circleCenter.lat() : circleCenter.lat,
            lng: typeof circleCenter.lng == 'function' ? circleCenter.lng() : circleCenter.lng,
          },
          circleRadius,
        },
      })
    );
  }, [defaultposition, selectedPlace, selected, radius]);

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

  return (
    <APIProvider apiKey="AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs">
      <div style={{ height: "70vh", width: "100%" }}>
        <div className="places-container">
          <CustomMapControl
            controlPosition={ControlPosition.LEFT_TOP}
            onPlaceSelect={setSelectedPlace}
          />
        </div>
        <Map
          zoom={15}
          minZoom={6}
          center={!selectedPlace && !selected ? defaultposition : selectedPlace}
          mapId="80e7a8f8db80acb5"
          onClick={handleMapClick}
          mapTypeControlOptions={{ position: ControlPosition.BOTTOM_CENTER }}
        >
          <AdvancedMarker
            style={{ height: "100px" }}
            position={
              !selected
                ? !selectedPlace
                  ? defaultposition
                  : selectedPlace
                : selected
            }
            onClick={() => setOpen(true)}
          >
            <Pin background={"red"} glyphColor={"white"}>
              <img
                src="images/logo.png"
                alt=""
                style={{
                  borderRadius: "50%",
                  border: "2px solid red",
                  height: "45px",
                  position: "absolute",
                  left: "-35%",
                  top: "-55%",
                }}
              />
            </Pin>
          </AdvancedMarker>
          <Circle
            center={
              !selectedPlace
                ? !selected
                  ? defaultposition
                  : selected
                : selectedPlace
            }
            radius={radius}
            onRadiusChanged={setRadius}
            onCenterChanged={setSelected}
            strokeColor={"#0c4cb3"}
            strokeOpacity={1}
            strokeWeight={2}
            fillColor={"#3b82f6"}
            fillOpacity={0.2}
            editable
            draggable
            onDragStart={(event) => {
              event.domEvent.stopPropagation();
              document.body.style.overflow = "hidden"; // Disable scrolling
            }}
            onDragEnd={(event) => {
              event.domEvent.stopPropagation();
              document.body.style.overflow = "auto"; // Re-enable scrolling
            }}
          />
          {/* 
          {open && (
            <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
              <p>Votre propriété</p>
            </InfoWindow>
          )} */}
        </Map>
      </div>
    </APIProvider>
  );
}
