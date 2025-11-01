import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { BiLogOutCircle } from "react-icons/bi";
import { FaUserEdit, FaDonate, FaMoon, FaSun } from "react-icons/fa";
import { TbHelp } from "react-icons/tb";
import { RiVipCrown2Fill, RiPauseCircleFill } from "react-icons/ri";
import { MdTranslate } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { setTopNavbar, setPricingField } from "../redux/redux";

import "./css/accountbalance.css";
import "./css/DarkModeSwitch.css";

import { useLogout } from "../hooks/useLogout";
import { useTimer } from "../hooks/useTimer";
import { usePopup } from "../hooks/usePopup";

import NotLogedIn from "../components/NotLogedIn";

//import user photo profil
import userProfile from "../img/user-avatar.png";
import "./css/userPage.css";

const UserPage = () => {
  const [, setLocation] = useLocation("");
  const { logout } = useLogout();
  const { unpaidBillPopup, featureUnderConstructionPopup } = usePopup();
  const { formatMillisecondToDisplay } = useTimer();
  const dispatch = useDispatch();

  //redux
  const user = useSelector((state) => state.user);
  const timer = useSelector((state) => state.timer);
  console.log(!timer.timer || !user.leftTime);

  const plans = useSelector((state) => state.plans);

  const payments = useSelector((state) => state.payments);

  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);

  const [planName, setPlanName] = useState("inconue");

  const handleDarkMode = () => {
    const darkModebtn = document.querySelector(
      "#root > div > div > div > div > input[type=checkbox]"
    );
    darkModebtn.click();
  };

  const handleRechargeClick = () => {
    console.log(payments);

    if (payments.filter((payment) => (payment.status === "refused" || payment.status === "redone")).length > 0) {
      unpaidBillPopup();
    } else {
      if (!timer.timer && !user.leftTime) dispatch(setPricingField({ key: "pricingModal", value: true }));
    }
  }

  useEffect(() => {
    if (user && user.planValidity && plans.length > 0) {
      const usersPlan = plans.find((plan) => plan.planValidity === (user.planValidity / (1000 * 60 * 60)));
      usersPlan ? setPlanName(usersPlan.planName) : setPlanName("inconue");
    }

    dispatch(setTopNavbar(true));
  }, [user, payments]);
  // Render the main content

  return (
    <>
      {user && user ?
        (
          <div
            className="container d-flex justify-content-center pt-5 pb-5"
          >
            <div className="card mt-5 p-4">
              <div className="bcard">
                <div 
                className="card-header bg-dark mb-2"
                style={{
                  borderRadius: "15px"
                }}
                >
                  <div className="d-flex flex-row justify-content-between text-align-center align-items-center">
                    <div className="d-flex font-weight-bold flex-column pt-2">
                      <span>
                        Votre forfait{" "}
                        {user && (timer.display === "" || timer.timer === null) && !user.leftTime ? (
                          <>
                            <small
                              className="bg-success text-white font-weight-light"
                              style={{
                                borderRadius: "9999px",
                                padding: "5px 10px",
                                whiteSpace: "nowrap",
                                display: "inline-block",
                              }}
                            >
                              Mode gratuit
                            </small>
                            <p>
                              <br />
                            </p>
                          </>
                        ) : (
                          <>
                            <small
                              className="bg-success text-white font-weight-light"
                              style={{
                                borderRadius: "9999px",
                                padding: "5px 10px",
                                whiteSpace: "nowrap",
                                display: "inline-block",
                              }}
                            >
                              {user && planName}{" "}
                              <RiVipCrown2Fill style={{ color: "#FFD700" }} />
                            </small>
                            <p className="mt-2 mb-2">
                              Temps restant :{" "}
                              <span className="text-light">{timer.timer && timer.display}{user.leftTime && formatMillisecondToDisplay(user.leftTime)}</span> {user.leftTime && <RiPauseCircleFill style={{ color: "red" }} />}
                            </p>
                          </>
                        )}
                      </span>
                    </div>
                    {user && (timer.display === "" || timer.timer === null) && !user.leftTime && (
                      <button
                        onClick={handleRechargeClick}
                        type="button"
                        className="button-17"
                      >
                        <small>Recharger</small>
                        <FaDonate className="" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="media p-2" onClick={() => setLocation(`/userProfile/${user._id}`)}>
                <img
                  alt=""
                  src={user?.avatar ? user.avatar : userProfile}
                  style={{
                    objectFit: "cover",
                    width: "50px",
                    height: "50px",
                    border: "2px solid #fff",
                    outline: "2px solid #00000080",
                    borderRadius: "50%",
                  }}
                  className="img-fluid mr-1 align-self-start"
                />
                <div className="media-body">
                  <div className="d-flex flex-row justify-content-between">
                    <h6
                      className={`ml-1 ${user && user.username.length > 25 ? "mt-0" : "mt-2"
                        } mb-0`}
                    >
                      {user && user.username}
                    </h6>
                    <i className="fas fa-angle-down mr-3 text-muted"> </i>
                  </div>
                  <p className="ml-1 text-muted">{user && user.phone}</p>
                </div>
              </div>
              <div
                className="d-flex pr-3 pl-3"
              >
                <ul className="list text-muted mt-3 pl-3">
                  {user && !user.banned &&
                    <Link to="/editProfile">
                      <li className="">
                        <FaUserEdit className="font-weight-bold mr-2" />
                        Modifier votre profil
                      </li>
                    </Link>
                  }
                  <li className="" onClick={() => featureUnderConstructionPopup()}>
                    <MdTranslate className="font-weight-bold mr-2" />
                    Ovaina teny Malagasy
                  </li>
                  <li className="" onClick={handleDarkMode}>
                    <div className="d-flex justify-content-start">
                      <div className="mr-2">
                        <label className="darkmode-custom-btn-label mb-0 mt-1">
                          <FaMoon className="fas fa-moon" />
                          <FaSun className="fas fa-sun" />
                          <span
                            style={
                              isDarkMode ? { transform: "translateX(24px)" } : {}
                            }
                            className="ball"
                          />
                        </label>
                      </div>
                      {isDarkMode ? "Mode clair" : "Mode sombre"} (Beta)
                    </div>
                  </li>
                  <li className="">
                    <TbHelp className="font-weight-bold mr-2" />A propos de
                    l'application
                  </li>
                  {user &&
                    <li onClick={logout} className="">
                      <BiLogOutCircle className="font-weight-bold mr-2" />
                      Se déconnecter
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div >
        ) : (
          <NotLogedIn route="UserPage" />
        )
      }
    </>
  );
};

export default UserPage;
