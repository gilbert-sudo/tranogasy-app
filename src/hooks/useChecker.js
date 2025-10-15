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

  // Remove accents/diacritics (frontend-safe)
  const removeDiacritics = (text = "") =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const checkTextSimilarity = (textA = "", textB = "") => {
    const normalize = (text) =>
      removeDiacritics(text || "")
        .toLowerCase()
        .replace(/[\n\r\t.,;:!?()\-–—'"“”‘’`´]/g, "")
        .replace(/\s+/g, " ")
        .replace(/[0-9]{6,}/g, "")
        .trim()
        .split(" ");

    const tokensA = normalize(textA);
    const tokensB = normalize(textB);
    if (tokensA.length === 0 || tokensB.length === 0) return 0;

    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    const intersection = [...setA].filter((word) => setB.has(word));
    return intersection.length / Math.min(setA.size, setB.size);
  };



  return {
    checkInternetConnection,
    checkTextSimilarity,
    isLoading,
  };
};
