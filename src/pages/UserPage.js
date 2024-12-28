import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { BiLogOutCircle } from "react-icons/bi";
import { FaUserEdit, FaDonate, FaMoon, FaSun } from "react-icons/fa";
import { TbHelp } from "react-icons/tb";
import { RiVipCrown2Fill, RiPauseCircleFill } from "react-icons/ri";
import { MdTranslate } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { setTopNavbar } from "../redux/redux";

import "./css/accountbalance.css";
import "./css/DarkModeSwitch.css";

import { useLogout } from "../hooks/useLogout";
import { useTimer } from "../hooks/useTimer";
import { usePopup } from "../hooks/usePopup";

//import user photo profil
import userProfile from "../img/user-avatar.png";

const UserPage = () => {
  const [ , setLocation] = useLocation("");
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
    if (payments.filter((payment) => (payment.status === "refused" || payment.status === "redone")).length > 0) {
      unpaidBillPopup();
    } else {
      if (!timer.timer && !user.leftTime) setLocation("/pricing");
    }
  }

  useEffect(() => {
    if (user && user.planValidity && plans.length > 0) {
      const usersPlan = plans.find((plan) => plan.planValidity === (user.planValidity / (1000 * 60 * 60)));
      usersPlan ? setPlanName(usersPlan.planName) : setPlanName("inconue");
    }

    dispatch(setTopNavbar(true));
  }, [user]);
  // Render the main content

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>TranoGasy - Gilbert Madagascar</title>
      <link
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n    ::-webkit-scrollbar {\n      width: 8px;\n    }\n\n    /* Track */\n    ::-webkit-scrollbar-track {\n      background: #f1f1f1;\n    }\n\n    /* Handle */\n    ::-webkit-scrollbar-thumb {\n      background: #888;\n    }\n\n    /* Handle on hover */\n    ::-webkit-scrollbar-thumb:hover {\n      background: #555;\n    }\n\n    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');\n\n    body {\n      background-color: #EEEFF3;\n      font-family: 'Montserrat', sans-serif;\n    }\n\n    .card {\n      width: 375px;\n      border: none;\n      border-radius: 15px;\n    }\n\n .fa-angle-down {\n      margin-top: 13px;\n    }\n\n    p.text-muted {\n      font-size: 14px;\n    }\n\n    .list {\n      list-style: none;\n      line-height: 37px;\n      font-size: 14px;\n    }\n\n    ul.list li:hover {\n      border: none;\n      background-color: #ECF2FE;\n      color: #224bba;\n      cursor: pointer;\n    }\n  ",
        }}
      />
      <div className="container d-flex justify-content-center mt-5 pb-5">
        <div className="card mt-5 px-4 pt-4 pb-2">
          <div className="bcard">
            <div className="card-bottom pt-3 px-3 mb-2">
              <div className="d-flex flex-row justify-content-between text-align-center">
                <div className="d-flex flex-column">
                  <span>
                    votre forfait{" "}
                    {user && (timer.display === "" || timer.timer === null) && !user.leftTime ? (
                      <>
                        <small className="p-1 bg-success text-white font-weight-light">
                          Mode gratuit
                        </small>
                        <p>
                          <br />
                        </p>
                      </>
                    ) : (
                      <>
                        <small className="p-1 bg-success text-white font-weight-light">
                          {user && planName}{" "}
                          <RiVipCrown2Fill style={{ color: "#FFD700" }} />
                        </small>
                        <p>
                          Temps restant :{" "}
                          <span className="text-white">{timer.timer && timer.display}{user.leftTime && formatMillisecondToDisplay(user.leftTime)}</span> {user.leftTime && <RiPauseCircleFill style={{ color: "red" }} />}
                        </p>
                      </>
                    )}
                  </span>
                </div>
                <button
                  onClick={handleRechargeClick}
                  type="button"
                  className="btn bbtn-secondary btn-secondary"
                >
                  <small>Recharger</small> <FaDonate className="mb-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="media p-2">
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
                  className={`ml-1 ${
                    user && user.username.length > 25 ? "mt-0" : "mt-2"
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
            style={{ backgroundColor: "#f4f4f7", borderRadius: "15px" }}
          >
            <ul className="list text-muted mt-3 pl-3">
              <Link to="/editProfile">
                <li className="">
                  <FaUserEdit className="font-weight-bold mr-2" />
                  Modifier votre profil
                </li>
              </Link>
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
              <li onClick={logout} className="">
                <BiLogOutCircle className="font-weight-bold mr-2" />
                Se déconnecter
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
