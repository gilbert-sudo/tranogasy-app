import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLoader } from "../hooks/useLoader";
import { useNotification } from "../hooks/useNotification";
import { useImage } from "../hooks/useImage";
import "./css/notification..css";
import NotificationCardDetails from "../components/NotificationCardDetails";
import NotLogedIn from "../components/NotLogedIn";

const NotificationPage = () => {
  // redux
  const { loadNotifications } = useLoader();
  const { updateAllNotificationsToRead } = useNotification();

  const { noNotificationImg } = useImage();

  const notifications = useSelector((state) => state.notifications)
  const notificationStatus = useSelector((state) => state.notificationStatus);
  const user = useSelector((state) => state.user);
  const [oneTimeTask, setOneTimeTask] = useState(null);

  if (oneTimeTask === null) {
    // scroll to top of the page
    window.scrollTo(0, 0);
    setOneTimeTask("done");
  }

  useEffect(() => {
    const pageLoader = async() => {
      if (user) {
        const userId = user._id;
        if (!notifications) {
          loadNotifications(userId);
        }
        if (notificationStatus.counter > 0) {
          updateAllNotificationsToRead(userId);
        }
        // console.log(notificationStatus);
        // console.log(notifications);
      }
    };
    pageLoader();
  }, []);

  return (
    <>
      {user && user ? (
        <section className="section-50 mb-5">
          <div className="container">
            <h5 className="mb-3 heading-line font-weight-light">Notifications</h5>
            <div className="notification-ui_dd-content">
              {notifications && notifications.length === 0 ? (
                <>
                  <div className="no-booking d-flex justify-content-center align-items-center">
                    <img
                      className="img-fluid"
                      style={{ maxHeight: "55vh" }}
                      src={noNotificationImg()}
                      alt="Pas de notification"
                    />
                  </div>
                  <center>
                    {" "}
                    <p style={{ fontWeight: "400" }} className="m-2">
                      Il n'y a pas de notification pour le moment.
                    </p>
                  </center>
                  <div className="text-center">
                    <button
                      style={{ borderRadius: "30px" }}
                      className="btn btn-success"
                    >
                      Charger plus d'activité
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {notifications &&
                    notifications.map(
                      (notification) =>
                        notification.message && (
                          <NotificationCardDetails
                            key={notification._id}
                            notification={notification}
                          />
                        )
                    )}
                </>
              )}
            </div>
          </div>
        </section>
      ) : (
        <NotLogedIn />
      )}
    </>
  );
};

export default NotificationPage;
