import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "wouter";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import "./css/googlemaps.css";
import { TbAdjustmentsSearch } from "react-icons/tb";
import { BsSearch } from "react-icons/bs";
import { LuBellPlus } from "react-icons/lu";

import { setReduxFormFilter } from "../redux/redux";
import { useDispatch } from "react-redux";

const PlaceAutocompleteClassic = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const [isInTranogasyMap, setIsInTranogasyMap] = useState(false);
  const [location] = useLocation();
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const places = useMapsLibrary("places");
  const alreadySeen = localStorage.getItem("tranogasy_filter_tooltip_seen");

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (location.startsWith("/tranogasyMap")) {
      setIsInTranogasyMap(true);
    }
  }, [location]);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      componentRestrictions: { country: "mg" },
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    placeAutocomplete.addListener("place_changed", () => {
      if (!placeAutocomplete.getPlace().geometry) {
        console.log("No details available for input: '" + placeAutocomplete.getPlace().name + "'");
      } else {
        onPlaceSelect({
          lat: placeAutocomplete.getPlace().geometry.location.lat(),
          lng: placeAutocomplete.getPlace().geometry.location.lng(),
        });
      }
    });
  }, [onPlaceSelect, placeAutocomplete]);

  useEffect(() => {
    if (!alreadySeen) {
      // Show tooltip automatically after 1s (can adjust or remove)
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      className="autocomplete-container d-flex justify-content-between align-items-center"
      style={{
        width: "100%",
        gap: "5px",
        paddingTop: "7px",
      }}
    >
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
          minWidth: "30vh",
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

      {isInTranogasyMap && (
        <div className="d-flex" style={{ gap: "5px", position: "relative" }}>
          {/* Search-filter button with spotlight */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              className="search-filter btn"
              onClick={() => {
                dispatch(setReduxFormFilter({ formFilter: true }));
                if (!alreadySeen) {
                  setShowTooltip(false);
                  localStorage.setItem("tranogasy_filter_tooltip_seen", "true");
                }
              }}

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
                position: "relative",
                zIndex: showTooltip ? 10001 : "auto",
              }}
            >
              <TbAdjustmentsSearch />
            </button>

            {showTooltip && (
              <>
                {/* Overlay */}
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.4)",
                    zIndex: 9999,
                  }}
                />

                {/* Tooltip box */}
                <div
                  style={{
                    position: "absolute",
                    top: "60px", // adjust below the button
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#fff",
                    padding: "16px 24px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    zIndex: 10002,
                    textAlign: "center",
                    maxWidth: "300px",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "15px", color: "#333" }}>
                    Clique ici pour filtrer ta recherche <BsSearch />
                  </p>
                  <button
                    onClick={() => {
                      setShowTooltip(false);
                      localStorage.setItem("tranogasy_filter_tooltip_seen", "true");
                    }}

                    style={{
                      marginTop: "12px",
                      padding: "10px 20px",
                      borderRadius: "30px",
                      border: "none",
                      background: "#7cbd1e",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      width: "100%",
                      transition: "background 0.3s",
                    }}
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Other button */}
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
      )}
    </div>
  );
};

export default PlaceAutocompleteClassic;
