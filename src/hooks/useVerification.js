import { useState } from "react";
import { useLocation } from "wouter";

export const useVerification = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const getUserByPhoneNumberForVerification = async (phoneNumber) => {
    setIsLoading(true);
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/exist/${phoneNumber}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });

        const json = await response.json();

        if (response.ok) {
          setIsLoading(false);
          if (json) {
            console.log(json);
            setLocation("/password-recovery-finalisation");
          }
        }
        if (!response.ok) {
          setIsLoading(false);
          console.log(json.message);
        }
      } catch (error) {
        setIsLoading(false);
        setLocation("/nosignal");
        console.log(error);
      }
  };


  return { isLoading, getUserByPhoneNumberForVerification };
};
