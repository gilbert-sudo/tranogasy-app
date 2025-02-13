import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setReduxGmapValue } from "../redux/redux";
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
import { UndoRedoControl } from "./maps_drawing_src/undo-redo-control";
import { logDOM } from "@testing-library/react";

export default function PropertyLandsAreaSelector() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs",
    libraries: ["places", "drawing"], // Add 'drawing' library
  });

  if (!isLoaded) return <div>Loading Map...</div>;
  return <MyMap />;
}

function MyMap() {
  const geolocation = useSelector((state) => state.geolocation);
  const [selected, setSelected] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [defaultPosition, setDefaultPosition] = useState(
    geolocation.userCurrentPosition
  );
  const dispatch = useDispatch();

  const handleMapClick = (event) => {
    setSelected(event.detail.latLng);
    setSelectedPlace(null);
    console.log(event.detail.latLng);
  };

  useEffect(() => {
    const circleCenter = selectedPlace || selected || defaultPosition;
    dispatch(
      setReduxGmapValue({
        gmapValue: {
          circleCenter: {
            lat:
              typeof circleCenter.lat === "function"
                ? circleCenter.lat()
                : circleCenter.lat,
            lng:
              typeof circleCenter.lng === "function"
                ? circleCenter.lng()
                : circleCenter.lng,
          },
        },
      })
    );
  }, [defaultPosition, selectedPlace, selected]);

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
      <div className="mt-5" style={{ height: "60vh", width: "100%" }}>
        <Map
          zoom={15}
          minZoom={6}
          center={selectedPlace || selected || defaultPosition}
          mapId="80e7a8f8db80acb5"
          onClick={handleMapClick}
          mapTypeControlOptions={{ position: ControlPosition.LEFT_BOTTOM }}
          fullscreenControlOptions={{ position: ControlPosition.BOTTOM_RIGHT }}
        >
          {/* Marker */}
          <AdvancedMarker
            style={{ height: "100px" }}
            position={selected || selectedPlace || defaultPosition}
            onClick={() => console.log("Marker clicked")}
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

          {/* Drawing Manager */}
          <DrawingManagerWithUndoRedo />
        </Map>
      </div>
    </APIProvider>
  );
}

function DrawingManagerWithUndoRedo() {
  const map = useMap(); // Access the map instance
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    if (!map) return;

    const drawingManager = new google.maps.drawing.DrawingManager({
      map,
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      markerOptions: { draggable: true },
      circleOptions: { editable: true },
      polygonOptions: { editable: true, draggable: true },
      rectangleOptions: { editable: true, draggable: true },
      polylineOptions: { editable: true, draggable: true },
      markerOptions: {
        icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      },
      polygonOptions: {
        fillOpacity: 0.3,
        fillColor: "#7cbd1e",
        strokeColor: "#ff0000",
        strokeWeight: 3,
        draggable: true,
        editable: true,
      },
    });

    drawingManager.setMap(map);

    // Handle overlay completion
    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event) => {
        const overlay = event.overlay;
        overlay.type = event.type; // Store the type of shape

        // Add overlay to the undo stack and clear redo stack
        setUndoStack((prev) => [...prev, overlay]);
        setRedoStack([]); // Clear redo stack on new action

        // Extract coordinates of the drawn shape
        let shapeData = {};

        if (overlay instanceof google.maps.Marker) {
          shapeData = {
            type: "marker",
            position: overlay.getPosition().toJSON(), // Get the position of the marker
          };
        } else if (overlay instanceof google.maps.Polygon) {
          shapeData = {
            type: "polygon",
            paths: overlay
              .getPath()
              .getArray()
              .map((latLng) => latLng.toJSON()), // Get the polygon's coordinates
          };
        } else if (overlay instanceof google.maps.Circle) {
          shapeData = {
            type: "circle",
            center: overlay.getCenter().toJSON(), // Get the center of the circle
            radius: overlay.getRadius(), // Get the radius of the circle
          };
        } else if (overlay instanceof google.maps.Rectangle) {
          shapeData = {
            type: "rectangle",
            bounds: overlay.getBounds().toJSON(), // Get the bounds of the rectangle
          };
        } else if (overlay instanceof google.maps.Polyline) {
          shapeData = {
            type: "polyline",
            path: overlay
              .getPath()
              .getArray()
              .map((latLng) => latLng.toJSON()), // Get the polyline's coordinates
          };
        }

        console.log("Shape data:", shapeData); // Check the shape data

        // Send the shape data to your backend
        console.log(shapeData);
      }
    );

    // Handle overlay completion
    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event) => {
        const overlay = event.overlay;
        overlay.type = event.type; // Store the type of shape

        // Add overlay to the undo stack and clear redo stack
        setUndoStack((prev) => [...prev, overlay]);
        setRedoStack([]); // Clear redo stack on new action

        console.log("Overlay completed:", overlay);
      }
    );

    return () => {
      drawingManager.setMap(null); // Clean up the drawing manager
    };
  }, [map]);

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastOverlay = undoStack[undoStack.length - 1];
      lastOverlay.setMap(null); // Remove the last overlay from the map
      setUndoStack((prev) => prev.slice(0, -1)); // Remove from undo stack
      setRedoStack((prev) => [...prev, lastOverlay]); // Add to redo stack
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastOverlay = redoStack[redoStack.length - 1];
      lastOverlay.setMap(map); // Add the overlay back to the map
      setRedoStack((prev) => prev.slice(0, -1)); // Remove from redo stack
      setUndoStack((prev) => [...prev, lastOverlay]); // Add back to undo stack
    }
  };

  return (
    <div>
      <MapControl position={ControlPosition.TOP_CENTER}>
        <UndoRedoControl
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          undoStack={undoStack}
          redoStack={redoStack}
        />
      </MapControl>
    </div>
  );
}
