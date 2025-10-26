import { useLocation } from "wouter";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { v6 as uuidv6 } from "uuid";
import { HashLoader } from "react-spinners";
import { setSignUp, setLoader } from "../redux/redux";
import { useLoader } from "../hooks/useLoader";
import { useLogin } from "../hooks/useLogin";
import { offlineLoader } from "../hooks/useOfflineLoader";
import { useImage } from "../hooks/useImage";

const PageLoader = () => {
  //redux
  const dispatch = useDispatch();
  const { gilbertLogo } = useImage();
  const [location, setLocation] = useLocation();
  const [oneTimeTask, setOneTimeTask] = useState(false);
  const user = useSelector((state) => state.user);
  const signupWaitlist = useSelector((state) => state.signup);
  const topProperties = useSelector((state) => state.topProperties);
  const properties = useSelector((state) => state.properties);


  const {
    loadTopProperties,
    loadLikes,
    loadNotifications,
    loadProperties,
    loadPayments,
    loadPlans
  } = useLoader();
  const { loginLastUser } = useLogin();
  const { loadMap } = offlineLoader();

  function generateUniqueId() {
    const timestamp = Date.now(); // Get the current timestamp in milliseconds
    const random = Math.floor(Math.random() * 1000000); // Add some randomness
    const uuid = uuidv6();
    return `${timestamp}_${uuid}_${random}`; // Combine timestamp and randomness
  }

  // Check if user already has an ID stored
  let socketId = localStorage.getItem("socketId");

  // If no ID exists, generate and store one
  if (!socketId) {
    socketId = generateUniqueId();
    localStorage.setItem("socketId", socketId);
    console.log("socketId", socketId);
  }

  if (oneTimeTask === false) {
    !properties && loadProperties();
    setOneTimeTask(true);
  }

  useEffect(() => {
    // Log the last user
    const fetchLastUser = async () => {
      loadTopProperties();
      if (user) {
        loadPayments(user._id);
        loadLikes(user._id);
        loadNotifications(user._id);
      }
      if (!user) {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser) {
          if (localUser?.user) {
            loadPayments(localUser.user._id);
            loadLikes(localUser.user._id);
            loadNotifications(localUser.user._id);
            loginLastUser(localUser.user._id);
          } else {
            loadPayments(localUser._id);
            loadLikes(localUser._id);
            loadNotifications(localUser._id);
            loginLastUser(localUser._id);
          }
        }
      }
      if (!signupWaitlist) {
        const localSignup = JSON.parse(localStorage.getItem("signup"));
        if (localSignup) {
          dispatch(setSignUp(localSignup));
        }
      }
      if (topProperties) {
        dispatch(setLoader("done"));
        setLocation("/explore");
      }
      const mapData = await loadMap();
      console.log("mapData", mapData);

      loadPlans();

    };
    fetchLastUser();
  }, [user, topProperties, location]);


  // Render the main content
  return (
    <div>
      {/* Semi-transparent backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          zIndex: 10,
          cursor: "pointer",
        }}
      />
      <div
        className="page-loader"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute", /* Position the loader */
          top: "50%", /* Center vertically */
          left: "50%", /* Center horizontally */
          transform: "translate(-50%, -50%)", /* Adjust for the loader's size */
          textAlign: "center",
          zIndex: 9999, /* Ensure it's above other content */
        }}
      >
        <img 
        src={gilbertLogo()} 
        style={{
          width:"110px"
        }}
        alt="gilbert-logo" 
         />
        <div
          className="spinner-loader"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            padding: "10px",
            borderRadius: "9999px",
            border: "4px solid #c59d45",
          }}
        >
          <div className="d-flex justify-content-center align-items-center">
            <small className="mr-2" style={{ color: "#805c0fff", fontWeight: "bold" }}>
              ɮʏ ɢɨʟɮɛʀȶ
            </small>{" "}
            <HashLoader color="#c59d45" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
