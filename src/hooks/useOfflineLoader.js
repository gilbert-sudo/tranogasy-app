export const offlineLoader = () => {
  const loadMap = async () => {
    try {
      // Fetch the JSON data from the CDN
      const response = await fetch(
        "https://storage.googleapis.com/tranogasy-cdn/data/madagascar.json"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const json = await response.json();

      // Extract unique combinations of region and district
      const uniqueRegionDistricts = Array.from(
        new Set(
          json.map((location) =>
            JSON.stringify({
              province: location.province,
              region: location.region,
              district: location.district,
            })
          )
        ),
        JSON.parse
      );

      // Extract unique combinations of region, district, and commune
      const uniqueCommunes = Array.from(
        new Set(
          json.map((location) =>
            JSON.stringify({
              province: location.province,
              region: location.region,
              district: location.district,
              commune: location.commune,
            })
          )
        ),
        JSON.parse
      );

      return {
        fokotanyList: json,
        communeList: uniqueCommunes,
        districtList: uniqueRegionDistricts,
      };
    } catch (error) {
      console.error("Error loading map data:", error);
      return {
        fokotanyList: [],
        communeList: [],
        districtList: [],
      };
    }
  };

  return { loadMap };
};
