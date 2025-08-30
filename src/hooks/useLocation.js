import { useCallback } from "react";

export const useLocation = () => {
  // 🔎 Get location data (address + coords) from Google Maps
  const getPlaceDataFromGoogle = useCallback((placeName) => {
    return new Promise((resolve) => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps API is not loaded");
        resolve({ address: null, lat: null, lng: null });
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      const geocoderOptions = {
        address: placeName,
        componentRestrictions: { country: "mg" }, // Madagascar
      };

      geocoder.geocode(geocoderOptions, (results, status) => {
        if (
          status === window.google.maps.GeocoderStatus.OK &&
          results &&
          results.length > 0
        ) {
          const bestResult = results[0];
          console.log("Geocoding result:", bestResult, geocoderOptions);
          
          const location = bestResult.geometry.location;
          resolve({
            address: bestResult.formatted_address, // ✅ full place name
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          console.warn("Geocoding failed:", status, geocoderOptions);
          resolve({ address: null, lat: null, lng: null });
        }
      });
    });
  }, []);

  return { getPlaceDataFromGoogle };
};
