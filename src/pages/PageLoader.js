import { useLocation } from "wouter";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { v6 as uuidv6 } from "uuid";
import { HashLoader } from "react-spinners";
import { setLoader } from "../redux/redux";
import { useLoader } from "../hooks/useLoader";
import { useLogin } from "../hooks/useLogin";
import { offlineLoader } from "../hooks/useOfflineLoader";
import { useImage } from "../hooks/useImage";

const PageLoader = () => {
  //redux
  const dispatch = useDispatch();
  const { happyFamilyTranogasyBG, gilbertLogo } = useImage();
  const [location, setLocation] = useLocation();
  const [oneTimeTask, setOneTimeTask] = useState(false);
  const user = useSelector((state) => state.user);
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
    document.body.style.backgroundImage = `url(${happyFamilyTranogasyBG()})`;
    return () => {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#ffffff";
    };
  }, []);

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
      {/* Semi-transparent backdrop - remains fixed at full screen */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0)",
          zIndex: 10,
          cursor: "pointer",
        }}
      />

      {/* Floating Text - +2000 annonces */}
      <div
        className="floating-annonces"
        style={{
          position: "fixed",
          width: "70dvw",
          maxWidth: "450px",
          top: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "black",
          padding: "8px 16px",
          borderRadius: "20px",
          fontSize: "16px",
          fontWeight: "bold",
          zIndex: 9999,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
          animation: "float 2.3s ease-in-out infinite",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        😍 + 2000 annonces ✨
      </div>

      {/* The main page-loader container (now only holds the logo) */}
      <div
        className="page-loader"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 9999,
        }}
      >
        <img
          src={gilbertLogo()}
          style={{
            width: "110px",
          }}
          alt="gilbert-logo"
        />
      </div>

      {/* SPINNER LOADER - MODIFIED FOR BOTTOM CENTER FIXED POSITION */}
      <div
        className="spinner-loader mb-4"
        style={{
          // Change from 'absolute' to 'fixed' to position relative to the viewport
          position: "fixed",
          minWidth: "max-content",

          // Position at the bottom
          bottom: "10px", // Adjust this value for desired distance from the bottom

          // Center horizontally
          left: "50%",
          transform: "translateX(-50%)", // Use translateX to center it

          // Ensure it's on top of everything
          zIndex: 1000,
        }}
      >
        <small style={{ color: "#805c0fff", fontWeight: "bold" }}>
          𝓑𝔂 𝓖𝓲𝓵𝓫𝓮𝓻𝓽 𝓜𝓪𝓭𝓪𝓰𝓪𝓼𝓬𝓪𝓻
        </small>
        <div className="d-flex justify-content-center align-items-center">
          <small className="mr-2" style={{ color: "#d8a842ff", fontWeight: "bold" }}>
            Chargement...
          </small>{" "}
          <HashLoader color="#c59d45" size={20} />
        </div>
      </div>

      {/* Add CSS animation for floating effect */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateX(-50%) translateY(0px);
            }
            50% {
              transform: translateX(-50%) translateY(-5px);
            }
            100% {
              transform: translateX(-50%) translateY(0px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default PageLoader;