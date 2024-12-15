import { getBounds, getDistance } from "geolib";

export const useMap = () => {
    // Define a function to find locations within a certain distance from a given location
    function findLocationsWithinDistance(locations, center, distance) {
      const nearbyLocations = [];
      locations.forEach((location) => {
        const dist = getDistance(center, location.coords);
        if (dist <= distance) {
          nearbyLocations.push({ location: location, distance: dist });
        }
      });
      console.log(nearbyLocations);
      return nearbyLocations;
    }

    function getLocationsCoords(properties) {
      const locationCoords = [];
      properties.forEach((property) => {
       let coord = property?.coords ? property.coords : property.city.coords;
       if (coord) {
        locationCoords.push(coord);
       }
      });
      console.log(locationCoords);
      
      return locationCoords;
    }

     // Function to calculate zoom level based on diameter
     const calculateZoomLevel = (properties) => {
      // Get bounds
      const bounds = getBounds(getLocationsCoords(properties));
      console.log(bounds);

      // Calculate the distance between the diagonal corners of the bounding box
      const topLeft = { latitude: bounds.maxLat, longitude: bounds.minLng };
      const bottomRight = {
        latitude: bounds.minLat,
        longitude: bounds.maxLng,
      };

      // Calculate the diameter (distance between two corners)
      const diameter = getDistance(topLeft, bottomRight);
      console.log(`Diameter: ${(diameter / 1000).toFixed(2)} km`);

      const referenceDistance = 7000; // 7463 meters corresponds to zoom level 13
      const referenceZoom = 13; // Known zoom level for 7000 meters
      const maxZoom = 17; // Maximum zoom level of Google Maps
      const minZoom = 6; // Minimum zoom level of Google Maps

      // Calculate the zoom level proportional to the reference
      const zoomLevel =
        referenceZoom - Math.log2(diameter / referenceDistance);

      // Clamp the zoom level within the bounds of minZoom and maxZoom
      const roundedZoomLevel = (properties.length <= 2) ? (Math.min(maxZoom, Math.max(minZoom, Math.round(zoomLevel))) - 1) : Math.min(maxZoom, Math.max(minZoom, Math.round(zoomLevel)));
      return roundedZoomLevel;
    };


  return { findLocationsWithinDistance, getLocationsCoords, calculateZoomLevel };
};
