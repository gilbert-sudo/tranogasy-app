import { useRef, useEffect, useState } from "react";
import { useLocation } from "wouter";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import "./css/googlemaps.css";
// import { TbAdjustmentsSearch } from "react-icons/tb";
import { BsSearch } from "react-icons/bs";
import { SearchCode } from "lucide-react";
// import { LiaBinocularsSolid } from "react-icons/lia";
import { IoMdCloseCircle } from "react-icons/io";
import { setReduxFormFilter, setSearchFormField } from "../redux/redux";
import { useDispatch, useSelector } from "react-redux";

const PlaceAutocompleteClassic = ({ isSearchResult }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const [isInTranogasyMap, setIsInTranogasyMap] = useState(false);
  const [location, setLocation] = useLocation();
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const places = useMapsLibrary("places");
  const alreadySeen = localStorage.getItem("tranogasy_filter_tooltip_seen");

  const [showTooltip, setShowTooltip] = useState(false);
  const activeFiltersCount = useSelector((state) => state.tranogasyMap.activeFiltersCount || 0);
  const searchForm = useSelector((state) => state.searchForm);

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

        dispatch(setSearchFormField({
          key: "searchCoordinates", value: {
            lat: placeAutocomplete.getPlace().geometry.location.lat(),
            lng: placeAutocomplete.getPlace().geometry.location.lng(),
          }
        }));
        dispatch(setSearchFormField({ key: "address", value: placeAutocomplete.getPlace().name }));
        dispatch(setSearchFormField({ key: "searchRadius", value: 5000 })); // default 5km radius
      }
    });
  }, [placeAutocomplete]);

  useEffect(() => {
    if (!alreadySeen) {
      // Show tooltip automatically after 1s (can adjust or remove)
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Function to clear the input value
  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
      dispatch(setSearchFormField({ key: "searchCoordinates", value: null }));
      dispatch(setSearchFormField({ key: "address", value: null }));
      dispatch(setSearchFormField({ key: "searchRadius", value: 0 }));

      // Trigger input event to reset Google Autocomplete
      const event = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  return (
    <div
      className="autocomplete-container d-flex justify-content-between align-items-center"
      style={{
        width: "100%",
        gap: "2px",
        paddingTop: "7px",
        position: "relative",
      }}
    >
      <div style={{ position: "relative", flexGrow: 1, display: isSearchResult ? "none" : "" }}>
        <input
          style={{
            flexGrow: 1,
            padding: "10px 40px 10px 20px", // Added right padding for clear button
            borderRadius: "30px",
            height: "50px",
            border: "1px solid #ccc",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "16px",
            color: "#333",
            backgroundColor: "#fff",
            transition: "border-color 0.3s, box-shadow 0.3s",
            outline: "none",
            fontFamily: "Arial, sans-serif",
            minWidth: "35vh",
            width: "100%",
          }}
          className="map-input"
          placeholder="Où veux-tu vivre ?"
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          value={searchForm.address}
          onChange={(e) => {
            dispatch(setSearchFormField({ key: "address", value: e.target.value }));
          }}
        />

        {/* Clear button (X) - only shown when there's text */}
        {searchForm.address && (
          <button
            onClick={clearInput}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              transition: "color 0.2s, background 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#666";
              e.currentTarget.style.background = "#f0f0f0";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#999";
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Clear input"
            type="button"
          >
            <IoMdCloseCircle size={20} />
          </button>
        )}
      </div>

      {isInTranogasyMap && (
        <div className="d-flex" style={{ gap: "5px", position: "relative" }}>
          {/* Search-filter button with spotlight */}
          <div className="search-filter-btn" style={{ position: "relative", display: "inline-block" }}>
            {/* The button code you provided... */}
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
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "background-color 0.3s, transform 0.3s",
                cursor: "pointer",
                flexShrink: 0,
                position: "relative",
                zIndex: showTooltip ? 10001 : "auto",
              }}
            >
              <SearchCode />
            </button>

            {/* Start of the new counter */}
            {activeFiltersCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#dc3545", // Red color
                  color: "#fff", // White text
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  border: "2px solid #fff", // Optional white border
                  zIndex: 10,
                }}
              >
                {activeFiltersCount}
              </div>
            )}
            {/* End of the new counter */}

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
        </div>
      )}
    </div>
  );
};

export default PlaceAutocompleteClassic;