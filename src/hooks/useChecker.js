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
      // Step 1: Check browser's online status
      if (!navigator.onLine) {
        console.log("Le navigateur signale que l'utilisateur est hors ligne.");
        setIsLoading(false);
        return;
      }
  
      // Step 2: Perform a lightweight ping to confirm connectivity
      const response = await fetch("https://www.google.com/generate_204", {
        method: "HEAD",
        mode: "no-cors", // Ensures no additional data is loaded
      });
  
      // If fetch doesn't throw, assume online
      setIsLoading(false);
      resetReduxStore();
      setLocation("/loader");
      console.log("Connexion Internet confirmée.");
    } catch (error) {
      // Network error or fetch failed
      setIsLoading(false);
      console.log("Aucune connexion Internet détectée :", error.message);
    }
  };
  

  return {
    checkInternetConnection,
    isLoading,
  };
};
