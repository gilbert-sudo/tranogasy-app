import { useEffect } from "react";
import { Link, useRoute, useLocation } from "wouter";
import {
  BsHeart,
  BsPersonGear,
  BsBell,
  BsHouseAdd,
  BsSearch,
  BsMenuApp,
} from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { RiPauseCircleFill } from "react-icons/ri";
import { MdArrowBackIos } from "react-icons/md";
import { RiVipCrown2Fill } from "react-icons/ri";

//Hooks
import {  usePopup  } from "../hooks/usePopup";
import {  useTimer  } from "../hooks/useTimer";

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
  href5 = ""
) => {
  const [isActive] = useRoute(href);
  const [isActive1] = useRoute(href1);
  const [isActive2] = useRoute(href2);
  const [isActive3] = useRoute(href3);
  const [isActive4] = useRoute(href4);
  const [isActive5] = useRoute(href5);
  const LinkStyle =
    isActive || isActive1 || isActive2 || isActive3 || isActive4 || isActive5
      ? { color: "#ec1c24" }
      : {};
  return LinkStyle;
};

const ShowNavbar = (isActive) => {
  const navBarStyle = isActive ? { display: "block" } : { display: "none" };
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
  
  const notifications = useSelector((state) => state.notifications);
  const payments = useSelector((state) => state.payments);
  const notificationStatus = useSelector((state) => state.notificationStatus);

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
                <li className="nav__item mt-3">
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
                    <BsMenuApp className="nav__icon" />
                    <span className="nav__name font-weight-light">Aceuil</span>
                  </Link>
                </li>
                <li className="nav__item mt-3">
                  <Link
                    to="/favorite"
                    className="nav__link"
                    style={ActiveLink("/favorite")}
                  >
                    <BsHeart className="nav__icon" />
                    <span className="nav__name font-weight-light">Favoris</span>
                  </Link>
                </li>

                <li className="nav__item center-navitem">
                  <Link
                    to="/mylisting"
                    className="nav__link center-navlink"
                    style={ActiveLink(
                      "/mylisting",
                      "/create-listing",
                      "/pricing",
                      "/payment"
                    )}
                  >
                    <BsHouseAdd className="nav__icon" />
                    <span className="nav__name font-weight-light">
                      Annonces
                    </span>
                  </Link>
                </li>
                <li className="nav__item mt-3">
                  <span
                    style={{
                      borderRadius: "50%",
                      padding: "0px 7px 1.5px 7px",
                      marginTop: "-9px",
                    }}
                    className={`font-weight-bold position-absolute text-white ml-3 ${
                      notificationStatus.counter > 0 && "bg-danger"
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
                    <BsBell className="nav__icon" />
                    <span className="nav__name font-weight-light">Notifs</span>
                  </Link>
                </li>
                <li className="nav__item mt-3">
                  <Link
                    to="/login"
                    className="nav__link"
                    style={ActiveLink(
                      "/login",
                      "/signup",
                      "/user",
                      "/signupverification",
                      "/password-recovery",
                      "/password-recovery/:phoneNumber"
                    )}
                  >
                    <BsPersonGear className="nav__icon" />
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
                    {user.leftTime && <RiPauseCircleFill style={{ color: "red",  fontSize: "1.2rem", marginTop: "3px" }} />}
                  </h4>
                  <small>{timer.timer && timer.display}</small>
                  <small>{user.leftTime && formatMillisecondToDisplay(user.leftTime)}</small> 
                </>
              )}
              {location === "/search" && location !== "/searchResult" && (
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
              {location !== "/search" && location !== "/searchResult" && location !== "/tranogasyMap" && (
                <button
                  style={{ borderRadius: "20px" }}
                  className="ml-1 btn btn-sm btn-outline-success"
                  type="button"
                  onClick={(e) => {
                   (payments && payments.filter((payment) => (payment.status === "refused" || payment.status === "redone")).length > 0) ? unpaidBillPopup() : setLocation("/search");
                  }}
                >
                  Chercher{" "}
                  <BsSearch
                    style={{ fontSize: "23px" }}
                    className="font-weight-bold"
                  />
                </button>
              )}
              {(location === "/searchResult" || location === "/tranogasyMap") && (
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
              {user && (
                <Link to="/user">
                  <img
                    className="ml-1"
                    src={user?.avatar ? user.avatar : userProfile}
                    alt="profile picture"
                    style={{objectFit: "cover", height: "30px",width: "30px", borderRadius: "50%" }}
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