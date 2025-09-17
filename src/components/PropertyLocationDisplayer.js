import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCenterOfBounds } from "geolib";
import { setUserCurrentPosition } from "../redux/redux";
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
  const [mapzoom, setMapZoom] = useState(15);
  const [center, setCenter] = useState(position);

  useEffect(() => {
    // Get user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (userPosition) => {
          const userCoords = {
            lat: userPosition.coords.latitude,
            lng: userPosition.coords.longitude,
          };

          dispatch(setUserCurrentPosition(userCoords));

          const newLocations = [
            { coords: position },
            { coords: userCoords },
          ];
          console.log("New locations to display on map:", newLocations);

          const centerCoord = getCenterOfBounds([position, userCoords]);

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
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [geolocation.userCurrentPosition, position, dispatch, calculateZoomLevel]);

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
        <Map
          zoom={mapzoom}
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
      </div>
    </APIProvider>
  );
}
