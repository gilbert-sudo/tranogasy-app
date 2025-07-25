import { useEffect } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { Origami, Binoculars, Heart, Megaphone, Bell, UserCog } from "lucide-react";
import {
  BsSearch,
} from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { RiPauseCircleFill } from "react-icons/ri";
import { MdArrowBackIos } from "react-icons/md";
import { RiVipCrown2Fill } from "react-icons/ri";

//Hooks
import { usePopup } from "../hooks/usePopup";
import { useTimer } from "../hooks/useTimer";

//redux store
import { useSelector, useDispatch } from "react-redux";
import {
  setNavbar,
  setTopNavbar,
  setNotificationCounterStatus,
} from "../redux/redux";

//import user photo profil
import userProfile from "../img/user-avatar.png";

import "./css/menu.css";

/**
 * `Utility components
 */
const ActiveLink = (
  href,
  href1 = "",
  href2 = "",
  href3 = "",
  href4 = "",
  href5 = "",
  href6 = ""
) => {
  const [isActive] = useRoute(href);
  const [isActive1] = useRoute(href1);
  const [isActive2] = useRoute(href2);
  const [isActive3] = useRoute(href3);
  const [isActive4] = useRoute(href4);
  const [isActive5] = useRoute(href5);
  const [isActive6] = useRoute(href6);
  const LinkStyle =
    isActive || isActive1 || isActive2 || isActive3 || isActive4 || isActive5 || isActive6
      ? { color: "#ec1c24" }
      : {};
  return LinkStyle;
};

const ShowNavbar = (isActive) => {
  const navBarStyle = isActive ? { display: "block", zindex: 2000 } : { display: "none" };
  return navBarStyle;
};

const Navbar = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useLocation();
  const { unpaidBillPopup } = usePopup();
  const { formatMillisecondToDisplay } = useTimer();
  const navbar = useSelector((state) => state.navbar);
  const user = useSelector((state) => state.user);
  const timer = useSelector((state) => state.timer);

  const properties = useSelector((state) => state.properties);
  const searchResults = useSelector((state) => state.searchResults);
  const notifications = useSelector((state) => state.notifications);
  const payments = useSelector((state) => state.payments);
  const notificationStatus = useSelector((state) => state.notificationStatus);

  const [match, params] = useRoute(
    "/property-details/:propertyId/:propertyData/:prevPath"
  );
  const prevPath = match ? params.prevPath : null;

  useEffect(() => {
    async function loadPage() {
      if (location.startsWith("/payment-recovery")) {
        dispatch(setNavbar(true));
      } else if (
        location.startsWith("/property-details/") ||
        location.startsWith("/update-property/") ||
        location.startsWith("/tranogasyMap") ||
        location.startsWith("/payment") ||
        location.startsWith("/searchResult") ||
        location.startsWith("/search") ||
        location.startsWith("/signup") ||
        location.startsWith("/password-recovery") ||
        location.startsWith("/password-recovery-finalisation") ||
        location.startsWith("/myhouselisting") ||
        location.startsWith("/pricing") ||
        location.startsWith("/create-listing")
      ) {
        dispatch(setNavbar(false));
      } else {
        dispatch(setNavbar(true));
      }
      if (
        location.startsWith("/nosignal") ||
        location.startsWith("/editProfile") ||
        location.startsWith("/password-recovery-verification")
      ) {
        dispatch(setTopNavbar(false));
      } else {
        dispatch(setTopNavbar(true));
      }
      console.log({ prevPath });

    }
    loadPage();
  }, [location]);

  useEffect(() => {
    async function countUnreadNotifications() {
      if (notifications) {
        dispatch(
          setNotificationCounterStatus(
            notifications.filter(
              (notification) => notification.status === "unread"
            ).length
          )
        );
      } else {
        dispatch(setNotificationCounterStatus(0));
      }
    }
    countUnreadNotifications();
  }, [notifications]);


  return (
    <>
      {/*=============== HEADER ===============*/}
      <div className="header" id="header">
        <nav>
          <div className="navigation container p-3">
            <div className="nav__logo d-flex justify-content-center align-items-center">
              <img src="images/logo.png" alt="" height={30} width={30} />
              <trano style={{ color: "#7cbd1e" }}>Trano</trano>
              <gasy style={{ color: "#ec1c24" }}>Gasy</gasy>.
            </div>
            <div
              className="nav__menu fixed-bottom"
              id="nav-menu"
              style={ShowNavbar(navbar)}
            >
              <ul className="nav__list">
                <li className="nav__item mt-2">
                  <Link
                    to="/explore"
                    className="nav__link"
                    style={ActiveLink(
                      "/explore",
                      "/property-details/:propertyId",
                      "/search",
                      "/searchResult",
                      "/payment-recovery"
                    )}
                  >
                    <Origami size={30} strokeWidth={1} />
                    <span className="nav__name font-weight-light">Aceuil</span>
                  </Link>
                </li>
                <li className="nav__item mt-2">
                  <Link
                    to="/TranogasyFeed"
                    className="nav__link"
                    style={ActiveLink("/TranogasyFeed")}
                  >
                    <Binoculars size={30} strokeWidth={1} />
                    <span className="nav__name font-weight-light">Explorer</span>
                  </Link>
                </li>
                <li className="nav__item mt-2">
                  <Link
                    to="/favorite"
                    className="nav__link"
                    style={ActiveLink("/favorite")}
                  >
                    <Heart size={30} strokeWidth={1} />
                    <span className="nav__name font-weight-light">Favoris</span>
                  </Link>
                </li>

                <li className="nav__item mt-2">
                  <Link
                    to="/mylisting"
                    className="nav__link"
                    style={ActiveLink(
                      "/mylisting",
                      "/create-listing",
                      "/pricing",
                      "/payment"
                    )}
                  >
                    <Megaphone size={30} strokeWidth={1} />
                    <span className="nav__name font-weight-light">
                      Annonces
                    </span>
                  </Link>
                </li>
                <li className="nav__item mt-2">
                  <span
                    style={{
                      borderRadius: "50%",
                      padding: "0px 7px 1.5px 7px",
                      marginTop: "-9px",
                      minWidth: "20px",
                      minHeight: "20px",
                    }}
                    className={`font-weight-bold position-absolute text-white ml-3 ${notificationStatus.counter > 0 && "bg-danger"
                      }`}
                  >
                    {notificationStatus.counter > 0 && (
                      <small>{notificationStatus.counter}</small>
                    )}
                  </span>
                  <Link
                    to="/notification"
                    className="nav__link"
                    style={ActiveLink("/notification")}
                  >
                    <Bell size={30} strokeWidth={1} />
                    <span className="nav__name font-weight-light">Notifs</span>
                  </Link>
                </li>
                <li className="nav__item mt-2">
                  <Link
                    to="/login"
                    className="nav__link"
                    style={ActiveLink(
                      "/login",
                      "/signup",
                      "/user",
                      "/signupverification",
                      "/password-recovery",
                      "/password-recovery/:phoneNumber",
                      "/userProfile/:userId"
                    )}
                  >
                    <UserCog size={30} strokeWidth={1} />
                    <span className="nav__name font-weight-light">Compte</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              {user && (user.leftTime || timer.timer) && (
                <>
                  {" "}
                  <h4>
                    {timer.timer && <RiVipCrown2Fill style={{ color: "#FFD700" }} />}
                    {user.leftTime && <RiPauseCircleFill style={{ color: "red", fontSize: "1.2rem", marginTop: "3px" }} />}
                  </h4>
                  <small>{timer.timer && timer.display}</small>
                  <small>{user.leftTime && formatMillisecondToDisplay(user.leftTime)}</small>
                </>
              )}
              {!properties && (
                <button
                  style={{ borderRadius: "20px", position: "relative", paddingRight: "25px" }}
                  className="ml-1 btn btn-sm btn-outline-success"
                  type="button"
                >
                  Chargement{" "}
                  <img src="images/Animation - 17331.gif" style={{ width: "20px", height: "20px", position: "absolute", marginLeft: "2px" }} />
                </button>
              )}
              {location === "/search" && location !== "/searchResult" && properties && (
                <button
                  style={{ borderRadius: "20px" }}
                  className="ml-1 btn btn-sm btn-danger"
                  onClick={() => window.history.back()}
                >
                  Annuler{" "}
                  <RxCross2
                    style={{ fontSize: "23px" }}
                    className="font-weight-bold"
                  />
                </button>
              )}{" "}
              {location !== "/search" && location !== "/searchResult" && location !== "/tranogasyMap" && prevPath !== "searchResult" && prevPath !== "tranogasyMap" && properties &&(
                <button
                  style={{ borderRadius: "20px" }}
                  className="ml-1 btn btn-sm btn-outline-success"
                  type="button"
                  onClick={(e) => {
                    (payments && payments.filter((payment) => (payment.status === "refused" || payment.status === "redone")).length > 0) ? unpaidBillPopup() : setLocation("/tranogasyMap");
                  }}
                >
                  Chercher{" "}
                  <BsSearch
                    style={{ fontSize: "23px" }}
                    className="font-weight-bold"
                  />
                </button>
              )}
              {(location === "/searchResult" || location === "/tranogasyMap" || prevPath === "searchResult" || prevPath === "tranogasyMap") && properties && (
                <button
                  style={{ borderRadius: "20px" }}
                  className="ml-1 btn btn-sm btn-danger"
                  onClick={() => window.history.back()}
                >
                  <MdArrowBackIos
                    style={{ fontSize: "17px" }}
                    className="font-weight-bold"
                  />
                  Retour{" "}
                </button>
              )}
              {user && !notificationStatus.bell && (
                <Link to={`/userProfile/${user._id}`}>
                  <img
                    className="ml-1"
                    src={user?.avatar ? user.avatar : userProfile}
                    alt="profile picture"
                    style={{ objectFit: "cover", height: "30px", width: "30px", borderRadius: "50%" }}
                  />
                </Link>
              )}
              {user && notificationStatus.bell && (
                <Link to="/notification">
                  <img
                    className="ml-1"
                    src="images/notification-bell.gif"
                    alt="profile picture"
                    style={{ height: "30px", width: "30px", cursor: "pointer" }}
                  />
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
