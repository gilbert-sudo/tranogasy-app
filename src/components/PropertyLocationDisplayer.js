import React, { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import Circle from "../components/Circle";
import { useLoadScript } from "@react-google-maps/api";

export default function PropertyLocationDisplayer({ position, circle }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Chargement de la carte...</div>;
  return <MyMap position={position} circle={circle} />;
}

function MyMap({ position, circle }) {
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey="AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs">
      <div className="mt-2 mb-4"
        style={{
          height: "50vh",
          width: "100%",
          position: "relative", // important for z-index to work
        }}
      >
        <Map zoom={15} minZoom={6} center={position} mapId="80e7a8f8db80acb5" options={{ gestureHandling: 'cooperative' }}>
          <AdvancedMarker
            style={{ height: "100px" }}
            position={position}
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
          {circle && (
            <Circle
              center={position}
              radius={600}
              strokeColor={"#7cbd1e"}
              strokeOpacity={1}
              strokeWeight={2}
              fillColor={"#3b82f6"}
              fillOpacity={0.1}
              clickable={false} // Add this line to make it click-through
            />
          )}

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
