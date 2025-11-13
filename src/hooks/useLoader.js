// Desc: This hook is used to load data from the server and dispatch it to the redux store
import { useState } from "react";
import { useLocation } from "wouter";
import { useDispatch } from "react-redux";
import {
  setLikedPropreties,
  setNotifications,
  setProperties,
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
        console.log("payments loaded: ", json);
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
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/properties/user/${userId}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "aplication/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch(setUsersProperties(json));
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
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
    loadPayments,
    loadPlans,
    loadTopProperties,
    loadUsersProperties,
    loadUsersPropertiesFromLocalState,
    loadSpesificUsersProperties
  };
};
