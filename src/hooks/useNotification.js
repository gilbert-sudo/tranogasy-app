import { useDispatch, useSelector } from "react-redux";
import { pushNotification as reduxPushNotification, setNotificationReadingStatus, setNotificationCounterStatus, setNotificationBellStatus, markAllNotificationsAsRead } from "../redux/redux";
import useSound from "use-sound";

export const useNotification = () => {
  const dispatch = useDispatch();

  const notifications = useSelector((state) => state.notifications)

  const [play] = useSound("sounds/doorbell.mp3");

  const pushNotification = async (newNotification) => {
    // Check if the notification with the same ID already exists
    const isNotificationExists = notifications.some(
      (notification) => notification._id === newNotification._id
    );
    if (!isNotificationExists) {
      dispatch(reduxPushNotification(newNotification));
      dispatch(setNotificationBellStatus(true));
      // Play a notification sound
      play();
    }
  }

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
      pushNotification(json);
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
        setTimeout(() => {
          dispatch(setNotificationBellStatus(false));
        }, 2000);
        dispatch(markAllNotificationsAsRead());

        console.log("All notifications updated to read");
      }
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  return { pushNotification, sendNotification, updateAllNotificationsToRead };
};
