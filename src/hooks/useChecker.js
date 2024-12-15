import { useState } from "react";
import { useLocation } from "wouter";
import { useRedux } from "./useRedux";

export const useChecker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useLocation();
  const { resetReduxStore } = useRedux();

  const checkInternetConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      const json = await response.json();

      if (response.ok) {
        setIsLoading(false);
        resetReduxStore();
        setLocation("/loader");
        console.log(json);
      }

    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return {
    checkInternetConnection,
    isLoading,
  };
};
