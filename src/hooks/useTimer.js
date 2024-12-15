import { useState } from "react";
import { useDispatch } from "react-redux";
import { setTimer } from "../redux/redux";
import { useSubscription } from "./useSubscription.js";

export const useTimer = () => {

  
  const [ isExpired, setIsExpired ] = useState(false);
  const dispatch = useDispatch();
  const { unSubscribeUser } = useSubscription();

  function formatMillisecondToDisplay(milliseconds) {
    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));

    const hoursString = hours > 0 ? `${hours}h` : "";
    const minutesString = minutes > 0 ? `${minutes}m` : "";

    return `${hoursString}${minutesString}`;
  }

  const updateTimer = async (user) => {
    const startTime = new Date(user.startTime).getTime();

    // Assume userSubscription is a document retrieved from database
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime < user.planValidity) {
      let timer = user.planValidity - elapsedTime;
      timer = timer + 60000;
      const display = formatMillisecondToDisplay(timer);
      
      //timer
      dispatch(setTimer({timer, display}));
    } else {
      // Subscription has expired
      console.log("Subscription has expired.");
      dispatch(setTimer({ timer: null, display: null}));
      unSubscribeUser(user._id);
      setIsExpired(true);
    }
  };

  return {
    updateTimer,
    formatMillisecondToDisplay,
    isExpired
  };
};
