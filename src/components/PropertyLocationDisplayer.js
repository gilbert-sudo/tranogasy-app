import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCenterOfBounds } from "geolib";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import Circle from "../components/Circle";
import { useLoadScript } from "@react-google-maps/api";

import { FaUser } from "react-icons/fa";

import { useMap as useLocalMapHook } from "../hooks/useMap";

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
  const geolocation = useSelector((state) => state.geolocation);

  const dispatch = useDispatch();
  const { calculateZoomLevel } = useLocalMapHook();
  const [mapZoom, setMapZoom] = useState(null);
  const [center, setCenter] = useState(null);

  useEffect(() => {
   
    if (geolocation.userCurrentPosition) {
      const newLocations = [
        { coords: position },
        { coords: geolocation.userCurrentPosition },
      ];

      const centerCoord = getCenterOfBounds([position, geolocation.userCurrentPosition]);

      if (centerCoord) {
        const newCenter = {
          lat: centerCoord.latitude,
          lng: centerCoord.longitude,
        };
        setCenter(newCenter);
      }
      if (newLocations) {
        setMapZoom(calculateZoomLevel(newLocations));
      }
      // console.log("the users current position", geolocation.userCurrentPosition);
    } else {
      setCenter(position);
      setMapZoom(15);
    }

  }, [geolocation.userCurrentPosition]);

  return (
    <APIProvider apiKey="AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs">
      <div
        className="mt-2 mb-4"
        style={{
          height: "50vh",
          width: "100%",
          position: "relative", // important for z-index to work
        }}
      >
        {mapZoom && center &&
          <Map
            zoom={mapZoom}
            minZoom={6}
            center={center}
            mapId="80e7a8f8db80acb5"
            options={{ gestureHandling: "cooperative" }}
          >
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
                clickable={false}
              />
            )}

            {geolocation.userCurrentPosition && (
              <>
                <AdvancedMarker
                  position={geolocation.userCurrentPosition}
                  title="Vous êtes ici"
                  className="user-marker"
                >
                  <div className="user-marker-pin">
                    <FaUser
                      size={16}
                      style={{ color: "black", marginRight: "4px" }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#4285F4",
                      }}
                    >
                      Vous
                    </span>
                  </div>
                </AdvancedMarker>
                <Circle
                  center={geolocation.userCurrentPosition}
                  radius={1000}
                  strokeColor={"#4285F4"}
                  strokeOpacity={2}
                  fillOpacity={0}
                  strokeWeight={3}
                  clickable={false}
                />
              </>
            )}
          </Map>
        }
      </div>
    </APIProvider>
  );
}
