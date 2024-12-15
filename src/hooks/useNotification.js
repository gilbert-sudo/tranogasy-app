import { useDispatch } from "react-redux";
import { pushNotification, setNotificationReadingStatus, pushNotificationCounterStatus, setNotificationCounterStatus, markAllNotificationsAsRead } from "../redux/redux";

export const useNotification = () => {
  const dispatch = useDispatch();

  const sendNotification = async (notificationData) => {

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(notificationData),
    });

    const json = await response.json();

    if (response.ok) {
      dispatch(pushNotification(json));
      dispatch(setNotificationReadingStatus(null));
      console.log("notification sent !");
    }
  };

  const updateAllNotificationsToRead = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notifications/user/${userId}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.ok) {
        dispatch(setNotificationReadingStatus("done"));
        dispatch(setNotificationCounterStatus(0));
        dispatch(markAllNotificationsAsRead());

        console.log("All notifications updated to read");
      }
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  return { sendNotification, updateAllNotificationsToRead };
};
