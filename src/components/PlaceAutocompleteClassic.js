import React, { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import "./css/googlemaps.css";

const PlaceAutocompleteClassic = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      // fields: ["geometry", "name", "formatted_address"],
      componentRestrictions: {country: 'mg'}
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect({
        lat: placeAutocomplete.getPlace().geometry.location.lat(),
        lng: placeAutocomplete.getPlace().geometry.location.lng(),
      });
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input className="map-input" placeholder="Rechercher un endroit" ref={inputRef} />
    </div>
  );
};

export default PlaceAutocompleteClassic;
