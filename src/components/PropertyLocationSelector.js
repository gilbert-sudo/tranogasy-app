import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedLocationForUpdate } from "../redux/redux";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { useLoadScript } from "@react-google-maps/api";
import CustomMapControl from "../components/CustomMapControl";

export default function PropertyLocationSelector({ defaultPosition, setCoords }) {
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
          console.log("GO ON FULL SCREEN");
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
  return <MyMap defaultPosition={defaultPosition} setCoords={setCoords} />;
}

function MyMap({ defaultPosition, setCoords }) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [open, setOpen] = useState(false);

  const handleMapClick = (event) => {
    setSelected(event.detail.latLng);
    setCoords(event.detail.latLng);
    setSelectedPlace(null);
    console.log(event.detail.latLng);
  };


  return (
    <APIProvider apiKey="AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs">
      <div style={{ height: "40vh", width: "100%" }}>
        <div className="places-container">
          <CustomMapControl
            controlPosition={ControlPosition.LEFT_TOP}
            onPlaceSelect={setSelectedPlace}
          />
        </div>
        <Map
          zoom={15}
          minZoom={6}
          center={!selectedPlace && !selected ? defaultPosition : selectedPlace}
          mapId="80e7a8f8db80acb5"
          onClick={handleMapClick}
          mapTypeControlOptions={{ position: ControlPosition.BOTTOM_CENTER }}
        >
          <AdvancedMarker
            style={{ height: "100px" }}
            position={!selected ? defaultPosition : selected}
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
                  left: "13%",
                  top: "-55%",
                }}
              />
            </Pin>
          </AdvancedMarker>
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
