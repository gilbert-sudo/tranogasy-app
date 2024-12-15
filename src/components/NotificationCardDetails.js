import { BsFillCheckCircleFill } from "react-icons/bs";
import { useLocation } from "wouter";

function NotificationCardDetails({ notification }) {

  const [ , setLocation] = useLocation("");

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Indian/Antananarivo", 
  }).format(new Date(notification.created_at));

  return (
    <div
      className={
        notification.confirmedBy
          ? notification.errorStatus
            ? "notification-list notification-list--error"
            : "notification-list notification-list--success"
          : "notification-list notification-list--unread"
      }
      onClick={() => (notification.payment && notification.errorStatus && (notification.payment.status === "refused" || notification.payment.status === "redone")) ? setLocation("/payment-recovery") : null}
    >
      <div className="notification-list_content">
        <div className="notification-list_img">
          <img
            src={
              notification.confirmedBy
                ? notification.confirmedBy.avatar
                : "images/user-avatar-thumblai.png"
            }
            className="border border-dark"
            alt="user"
          />
        </div>
        <div className="notification-list_detail">
          <small>
            <p>
              <b>
                {notification.confirmedBy
                  ? notification.confirmedBy.name +
                    " " +
                    notification.confirmedBy.firstname
                  : "Tranogasy"}
              </b>{" "}
              <small
                className={
                  notification.confirmedBy ? "text-success" : "text-sky-primary"
                }
              >
                <BsFillCheckCircleFill /> {notification.confirmedBy && "Admin"}
              </small>
            </p>
            <p className="text-muted">
              {notification.message && notification.message} {notification.errorStatus && <u>Cliquez ici</u>}
            </p>
            <p className="text-muted">
              <small>{notification.created_at && formattedDate}</small>
            </p>
          </small>
        </div>
      </div>

      <div className="align-items-left notification-list_feature-img mr-1">
        <img
          src={notification.img && notification.img}
          alt="Feature image"
        />
      </div>
    </div>
  );
}

export default NotificationCardDetails;
