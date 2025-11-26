// Desc: This hook is used to load data from the server and dispatch it to the redux store
import { useLocation } from "wouter";
import { useDispatch } from "react-redux";
import {
  setLikedPropreties,
  setNotifications,
  setProperties,
  setFilteredPropertiesField,
  setTopProperties,
  setQuartersName,
  setUsersProperties,
  setPayments,
  setPlans,
} from "../redux/redux";

export const useLoader = () => {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();

  // Load liked properties
  const loadLikes = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/favorite/${userId}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "aplication/json",
          },
        }
      );
      const json = await response.json();

      if (response.ok) {
        dispatch(setLikedPropreties(json.favorites));
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
    }
  };


  // Load the connected user's notifications
  const loadNotifications = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notifications/user/${userId}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "aplication/json",
          },
        }
      );
      const json = await response.json();

      if (response.ok) {
        dispatch(setNotifications(json));
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
    }
  };

  const loadQuartersName = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/cities/all-quarter-name`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "aplication/json",
          },
        }
      );
      const json = await response.json();

      if (response.ok) {
        dispatch(setQuartersName(json));
        return json;
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
    }
  };

  const loadTopProperties = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/properties/latest`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "aplication/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch(setTopProperties(json));
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
    }
  };

  const loadProperties = async () => {
    const mainUrl = process.env.REACT_APP_API_URL;
    const backupUrl = process.env.REACT_APP_API_BACKUP_URL;

    let baseUrl = mainUrl; // default to main API
    let allProperties = [];

    const fetchFromAPI = async (url) => {
      const response = await fetch(`${url}/api/properties/paginated`, {
        headers: { "Content-Type": "application/json" },
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Failed to fetch properties");
      return json;
    };

    try {
      // Try main API
      const json = await fetchFromAPI(baseUrl);

      for (let page = 1; page <= json.totalPages; page++) {
        const res = await fetch(
          `${baseUrl}/api/properties/paginated?page=${page}&limit=500`,
          { headers: { "Content-Type": "application/json" } }
        );
        const json2 = await res.json();

        if (res.ok) {
          // console.log("Fetching page:", page);
          allProperties = [...allProperties, ...json2.properties];
        }
      }

      dispatch(setProperties(allProperties));
    } catch (error) {
      console.warn("Main API failed, trying backup...", error.message);

      try {
        // Try backup API
        const json = await fetchFromAPI(backupUrl);

        for (let page = 1; page <= json.totalPages; page++) {
          const res = await fetch(
            `${backupUrl}/api/properties/paginated?page=${page}&limit=500`,
            { headers: { "Content-Type": "application/json" } }
          );
          const json2 = await res.json();

          if (res.ok) {
            // console.log("Fetching page from BACKUP:", page);
            allProperties = [...allProperties, ...json2.properties];
          }
        }

        dispatch(setProperties(allProperties));
      } catch (backupError) {
        console.error("Both main and backup APIs failed:", backupError.message);
      }
    }
  };

  const loadRecentProperties = async (days = 31) => {
    const mainUrl = process.env.REACT_APP_API_URL;
    const backupUrl = process.env.REACT_APP_API_BACKUP_URL;

    let allProperties = [];

    // fetch 1 page only
    const fetchPage = async (url, page) => {
      const response = await fetch(
        `${url}/api/properties/paginated/recent?days=${days}&page=${page}&limit=500`,
        { headers: { "Content-Type": "application/json" } }
      );

      const json = await response.json();
      if (!response.ok)
        throw new Error(json.message || "Failed to fetch recent properties");

      return json.properties; // backend returns only properties + hasMore
    };

    // fetch repeatedly until empty page
    const fetchAllPages = async (baseUrl) => {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const properties = await fetchPage(baseUrl, page);

        if (properties.length === 0) {
          hasMore = false;
          break;
        }

        console.log("Fetching recent page:", page, "items:", properties.length);

        allProperties = [...allProperties, ...properties];
        if (page === 1) {
          console.log("load the page one");
          dispatch(
            setFilteredPropertiesField({
              key: "pageOne",
              value: allProperties,
            })
          );
        }
        page++;
      }

      return allProperties;
    };

    try {
      // MAIN API
      const data = await fetchAllPages(mainUrl);
      dispatch(setProperties(data));
    } catch (error) {
      console.warn("Main API failed, trying backup...", error.message);

      try {
        // BACKUP API
        const data = await fetchAllPages(backupUrl);
        dispatch(setProperties(data));
      } catch (backupError) {
        console.error(
          "Both main and backup APIs failed:",
          backupError.message
        );
      }
    }
  };



  const loadPayments = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/user/${userId}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "aplication/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch(setPayments(json));
        // console.log("payments loaded: ", json);
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
    }
  };

  const loadPlans = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/plans/`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "aplication/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch(setPlans(json.plans));
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
    }
  };


  const loadUsersProperties = async (userId) => {
    const primaryUrl = process.env.REACT_APP_API_URL;
    const backupUrl = process.env.REACT_APP_API_URL_BACKUP; // <-- Add this in .env

    // Helper: timeout wrapper
    const fetchWithTimeout = (url, options, timeout = 15000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout)
        ),
      ]);
    };

    // Core function: try fetching from a specific server
    const tryFetch = async (base) => {
      const url = `${base}/api/properties/user/${userId}`;
      const response = await fetchWithTimeout(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Server returned non-200");
      return response.json();
    };

    try {
      // 1️⃣ Try MAIN server
      console.log("🔵 Trying MAIN server...");
      const json = await tryFetch(primaryUrl);

      dispatch(setUsersProperties(json));
    } catch (err1) {
      console.log("❌ Main server failed:", err1.message);

      try {
        // 2️⃣ Try BACKUP server
        console.log("🟡 Trying BACKUP server...");
        const json = await tryFetch(backupUrl);

        dispatch(setUsersProperties(json));
      } catch (err2) {
        console.log("🔴 Backup server failed:", err2.message);

        // 3️⃣ Both failed → redirect
        setLocation("/nosignal");
      }
    }
  };

  const loadUsersPropertiesFromLocalState = (userId, properties) => {
    const userProperties = properties.filter(property => property.owner._id === userId);
    dispatch(setUsersProperties(userProperties));
    console.log("user properties loaded from local state: ", userProperties);
  }

  const loadSpesificUsersProperties = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/properties/user/${userId}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "aplication/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        return json;
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
    }
  };

  return {
    loadLikes,
    loadNotifications,
    loadQuartersName,
    loadProperties,
    loadRecentProperties,
    loadPayments,
    loadPlans,
    loadTopProperties,
    loadUsersProperties,
    loadUsersPropertiesFromLocalState,
    loadSpesificUsersProperties
  };
};
