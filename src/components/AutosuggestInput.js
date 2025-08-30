import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useLocation } from "../hooks/useLocation";

const AutosuggestInput = ({ data, onSelectItem }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [googleResult, setGoogleResult] = useState(null);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const { getPlaceDataFromGoogle } = useLocation();
  const lastSearchedValue = useRef("");

  // Memoized suggestion calculation
  const filteredSuggestions = useMemo(() => {
    if (!value) return [];
    
    const inputValue = value.toLowerCase();
    const keywords = inputValue
      .split(" ")
      .filter((keyword) => keyword.trim() !== "");

    const filtered = data.filter((item) => {
      const itemText = `${item.fokontany} ${item.commune} ${item.district} ${item.region}`.toLowerCase();
      return keywords.every((keyword) => itemText.includes(keyword));
    });

    return filtered;
  }, [value, data]);

  // Check Google Maps when no local results found and value changed
  useEffect(() => {
    const checkGoogleMaps = async () => {
      // Only search if we have a value, no local results, and it's a new search
      if (value && filteredSuggestions.length === 0 && value !== lastSearchedValue.current) {
        setIsLoadingGoogle(true);
        setGoogleResult(null);
        lastSearchedValue.current = value; // Remember we searched this value
        
        try {
          const result = await getPlaceDataFromGoogle(value);
          
          if (result.address && result.lat && result.lng) {
            // Only show Google result if address has at least 3 words
            const wordCount = result.address.split(' ').filter(word => word.length > 0).length;
            if (wordCount >= 3) {
              setGoogleResult({
                _id: "google-result",
                fokontany: result.address,
                commune: "",
                district: "",
                region: "",
                coords: { lat: result.lat, lng: result.lng },
                isGoogleResult: true
              });
            }
          }
        } catch (error) {
          console.error("Error fetching from Google Maps:", error);
        } finally {
          setIsLoadingGoogle(false);
        }
      }
    };

    // Only search Google if conditions are met
    if (value && filteredSuggestions.length === 0 && value !== lastSearchedValue.current) {
      checkGoogleMaps();
    }
  }, [value, filteredSuggestions.length, getPlaceDataFromGoogle]);

  // Reset Google search tracking when input is cleared
  useEffect(() => {
    if (!value) {
      lastSearchedValue.current = "";
      setGoogleResult(null);
      setIsLoadingGoogle(false);
    }
  }, [value]);

  // Event handlers
  const onChange = useCallback((event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    // Don't reset googleResult immediately - let the useEffect handle it
  }, []);

  const handleSuggestionClick = useCallback((suggestionText, item) => {
    setValue(suggestionText);
    setSuggestions([]);
    setGoogleResult(null);
    lastSearchedValue.current = ""; // Reset search tracking
    
    if (onSelectItem) {
      onSelectItem(item);
    }
  }, [onSelectItem]);

  const formatSuggestionText = useCallback((item) => {
    if (item.isGoogleResult) {
      return item.fokontany; // Use full Google address
    }
    return `${item.fokontany}, ${item.commune.charAt(0).toUpperCase() + item.commune.slice(1)}, ${item.district.toUpperCase()}`;
  }, []);

  // Combine local and Google suggestions
  const allSuggestions = useMemo(() => {
    const combined = [...filteredSuggestions];
    if (googleResult) {
      combined.push(googleResult);
    }
    return combined;
  }, [filteredSuggestions, googleResult]);

  // Render functions
  const renderSuggestions = useCallback(() => {
    if (!value || allSuggestions.length === 0 || filteredSuggestions.length > 150) {
      return null;
    }

    return (
      <div
        className="autosuggest-dropdown"
        style={{
          zIndex: 20,
          overflowY: "auto",
          maxHeight: "250px",
          position: "absolute",
          width: "100%",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        {allSuggestions.map((item) => (
          <button
            key={item._id}
            type="button"
            className="suggestion-item"
            style={{
              border: "none",
              backgroundColor: item.isGoogleResult ? "#f0f8ff" : "#fff",
              textAlign: "left",
              color: "black",
              padding: "12px",
              width: "100%",
              cursor: "pointer",
              transition: "background 0.2s",
              borderLeft: item.isGoogleResult ? "4px solid #1976d2" : "none"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = item.isGoogleResult ? "#e3f2fd" : "#f6f6f6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = item.isGoogleResult ? "#f0f8ff" : "#fff")}
            onClick={() => handleSuggestionClick(formatSuggestionText(item), item)}
          >
            {item.isGoogleResult ? (
              <>
                <strong>
                  <FaLocationDot style={{ color: "#1976d2" }} />{" "}
                  {item.fokontany}
                </strong>
                <br />
                <small style={{ color: "#666", fontStyle: "italic" }}>
                  Résultat Google Maps
                </small>
              </>
            ) : (
              <>
                <strong>
                  <FaLocationDot />{" "}
                  {`${item.fokontany}, ${item.commune.charAt(0).toUpperCase() + item.commune.slice(1)}`}
                </strong>
                <br />
                <small>{`${item.district.toUpperCase()} (${item.region})`}</small>
              </>
            )}
          </button>
        ))}
      </div>
    );
  }, [value, allSuggestions, filteredSuggestions.length, handleSuggestionClick, formatSuggestionText]);

  // Show loading state only when actively searching Google
  const showLoading = isLoadingGoogle;
  
  // Show no results only if we have a value, no local results, not loading, and either:
  // - Google search was attempted and returned nothing/invalid result
  // - Or we haven't searched Google yet but there are no local results
  const showNoResults = value && 
                       filteredSuggestions.length === 0 && 
                       !isLoadingGoogle && 
                       (!googleResult || googleResult.fokontany.split(' ').filter(w => w.length > 0).length < 3);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <FaSearchLocation
          style={{
            position: "absolute",
            top: "50%",
            left: "12px",
            transform: "translateY(-50%)",
            color: "#6b7280",
            fontSize: "18px",
          }}
        />
        <input
          type="search"
          placeholder="Où que ce soit à Madagascar"
          value={value}
          onChange={onChange}
          required
          style={{
            width: "100%",
            padding: "15px 15px 15px 40px",
            border: "1px solid #ced4da",
            borderRadius: "20px",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.2s",
            backgroundColor: "#f9f9f9",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6b7280")}
          onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
        />
      </div>

      {/* Loading message - only shows when actively searching */}
      {showLoading && (
        <div
          className="loading-message"
          style={{
            position: "absolute",
            width: "100%",
            backgroundColor: "#f8f9fa",
            color: "#6c757d",
            border: "1px solid #dee2e6",
            borderRadius: "10px",
            padding: "20px",
            marginTop: "5px",
            textAlign: "center",
            fontSize: "13px",
            zIndex: 10,
          }}
        >
          🔍 Recherche sur Google Maps...
        </div>
      )}

      {/* No results message */}
      {showNoResults && (
        <div
          className="no-results-message"
          style={{
            position: "absolute",
            width: "100%",
            backgroundColor: "#fff3f3",
            color: "#ff3333",
            border: "1px solid #ff3333",
            borderRadius: "10px",
            padding: "20px",
            marginTop: "5px",
            textAlign: "center",
            fontSize: "13px",
            zIndex: 10,
          }}
        >
          Aucun fokontany trouvé. Essayez d'être plus précis.
        </div>
      )}

      {/* Too many results message */}
      {value && filteredSuggestions.length > 150 && (
        <div
          className="too-many-results-message"
          style={{
            position: "absolute",
            width: "100%",
            backgroundColor: "#e6f7f7",
            color: "#05595B",
            border: "1px solid #05595B",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "5px",
            textAlign: "start",
            fontSize: "13px",
            zIndex: 10,
          }}
        >
          Pouvez-vous préciser davantage votre recherche en incluant{" "}
          <strong>la commune</strong> ou <strong>le district</strong> ou{" "}
          <strong>la région du fokotany</strong> ?
          <br />* Cela nous aidera à affiner les{" "}
          <b>{filteredSuggestions.length} résultats.</b>
        </div>
      )}

      {renderSuggestions()}
    </div>
  );
};

export default AutosuggestInput;