import React, { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import "./css/googlemaps.css";
import { LuSettings2 } from "react-icons/lu";
import { LuBellPlus } from "react-icons/lu";

const PlaceAutocompleteClassic = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      // fields: ["geometry", "name", "formatted_address"],
      componentRestrictions: { country: 'mg' }
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    placeAutocomplete.addListener("place_changed", () => {
      if (!placeAutocomplete.getPlace().geometry) {
        console.log("No details available for input: '" + placeAutocomplete.getPlace().name +
          "'");
      } else {
        onPlaceSelect({
          lat: placeAutocomplete?.getPlace().geometry.location.lat(),
          lng: placeAutocomplete?.getPlace().geometry.location.lng(),
        });
      }
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div
      className="autocomplete-container d-flex justify-content-between align-items-center"
      style={{
        width: "100%",
        gap: "10px",
        padding: "0 10px",
      }}
    >
      {/* Input on the far left */}
      <input
        style={{
          flexGrow: 1,
          padding: "10px 20px",
          borderRadius: "30px",
          height: "50px",
          border: "1px solid #ccc",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          fontSize: "16px",
          color: "#333",
          backgroundColor: "#fff",
          transition: "border-color 0.3s, box-shadow 0.3s",
          outline: "none",
          fontFamily: "Arial, sans-serif",
        }}
        className="map-input"
        placeholder="Où veux-tu vivre ?"
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />

      {/* Group buttons on the right */}
      <div
        className="d-flex"
        style={{
          gap: "10px",
        }}
      >
        <button
          className="btn"
          onClick={() => alert("Fonctionnalité en cours de développement")}
          style={{
            borderRadius: "30px",
            padding: "10px 14px",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            color: "#000",
            border: "2px solid #ccc",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s, transform 0.3s",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <LuSettings2 />
        </button>

        <button
          className="btn"
          onClick={() => alert("Fonctionnalité en cours de développement")}
          style={{
            borderRadius: "30px",
            padding: "10px 14px",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            color: "#000",
            border: "2px solid #ccc",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s, transform 0.3s",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <LuBellPlus />
        </button>
      </div>
    </div>


  );
};

export default PlaceAutocompleteClassic;
