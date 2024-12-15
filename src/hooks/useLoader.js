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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/top-properties`, {
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
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/properties`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "aplication/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch(setProperties(json));
      }
    } catch (error) {
      console.log(error);
      setLocation("/nosignal");
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
  
  return {
    loadLikes,
    loadNotifications,
    loadQuartersName,
    loadProperties,
    loadPayments,
    loadTopProperties,
    loadUsersProperties,
  };
};
