import { Switch, Route, Router, Redirect } from "wouter";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import io from "socket.io-client"; // Import Socket.io client library
import { useEffect } from "react";
import "./App.css";
import Darkreader from "react-darkreader";
import { useLocationProperty, navigate } from "wouter/use-location";
import { WonderPush } from 'react-wonderpush';

// all pages
import NoInternetPage from "./pages/NoInternet";
import LoginPage from "./pages/LoginPage";
import PageLoader from "./pages/PageLoader";
import ExplorePage from "./pages/ExplorePage";
import TranogasyFeed from "./pages/TranogasyFeed";
import SearchPage from "./pages/SearchPage";
import SearchResultPage from "./pages/SearchResultPage";
import TranogasyMap from "./pages/TranogasyMap";
import PropertyLandsAreaSelector from "./components/PropertyLandsAreaSelector";
import MyListingPage from "./pages/MyListingPage";
import MyHouseListingPage from "./pages/MyHouseListingPage";
import CreateListing from "./pages/CreateListing";
import UpdatePropertyPage from "./pages/UpdatePropertyPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentRecoveryPage from "./pages/PaymentRecoveryPage";
import Pricing from "./pages/Pricing";
import FavoritePage from "./pages/FavoritePage";
import NotificationPage from "./pages/NotificationPage";
import SignUpPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";
import UserProfilePage from "./pages/UserProfilePage";
import EditUsersProfilePage from "./pages/EditUsersProfilePage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import SignUpVerificationPage from "./pages/SignUpVerificationPage";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage";
import PasswordRecoveryVerificationPage from "./pages/PasswordRecoveryVerificationPage";
import PasswordRecoveryFinalisationPage from "./pages/PasswordRecoveryFinalisationPage";
import ImageUpload from "./pages/ImageUpload";

import { Geolocation } from "@capacitor/geolocation";

import { useTimer } from "./hooks/useTimer";
import { useMap } from "./hooks/useMap";
import { useRedux } from "./hooks/useRedux";
import { useNotification } from "./hooks/useNotification";
import { useUser } from "./hooks/useUser";
import { useLoader } from "./hooks/useLoader";

//all components
import Navbar from "./components/Navbar";
import AutoSubscribe from "./components/AutoSubscribe";
import BackButtonHandler from "./components/BackButtonHandler";
import PricingModal from "./components/PricingModal";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  setUser,
  setUserCurrentPosition,
  pushHistoryStack,
  setSteps,
  addPayment,
  updatePayment,
  pushProperty,
  deleteFromProperties,
  deleteFromTopProperty,
  deleteLike,
  deleteFromNotifications,
  toggleDarkMode,
  setTimer,
} from "./redux/redux";

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";

const hashNavigate = (to) => navigate("#" + to);

const useHashLocation = () => {
  const location = useLocationProperty(hashLocation);
  return [location, hashNavigate];
};

// Define all your routes in an array
const routes = [
  { path: "/login", component: LoginPage, private: true },
  { path: "/explore", component: ExplorePage, private: false },
  { path: "/TranogasyFeed", component: TranogasyFeed, private: false },
  { path: "/search", component: SearchPage, private: false },
  { path: "/tranogasyMap", component: TranogasyMap, private: false },
  { path: "/create-land-listing", component: PropertyLandsAreaSelector, private: false },
  { path: "/searchResult", component: SearchResultPage, private: false },
  { path: "/favorite", component: FavoritePage, private: false },
  { path: "/mylisting", component: MyListingPage, private: false },
  { path: "/myhouselisting", component: MyHouseListingPage, private: false },
  { path: "/notification", component: NotificationPage, private: false },
  { path: "/pricing", component: Pricing, private: false },
  { path: "/payment-recovery", component: PaymentRecoveryPage, private: false },
  { path: "/payment/:planData/:option", component: PaymentPage, private: false },
  { path: "/create-listing", component: CreateListing, private: false },
  { path: "/update-property/:propertyData", component: UpdatePropertyPage, private: false },
  { path: "/user", component: UserPage, private: false },
  { path: "/userProfile/:userId", component: UserProfilePage, private: false },
  { path: "/editProfile", component: EditUsersProfilePage, private: false },
  { path: "/signupverification", component: SignUpVerificationPage, private: false },
  { path: "/signup", component: SignUpPage, private: false },
  { path: "/password-recovery", component: PasswordRecoveryPage, private: false },
  { path: "/password-recovery/:phoneNumber", component: PasswordRecoveryPage, private: false },
  { path: "/password-recovery-verification", component: PasswordRecoveryVerificationPage, private: false },
  { path: "/password-recovery-finalisation", component: PasswordRecoveryFinalisationPage, private: false },
  { path: "/nosignal", component: NoInternetPage, private: false },
  { path: "/TestApp", component: ImageUpload, private: false },
  // Add other routes similarly
];


function App() {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.loader);

  const user = useSelector((state) => state.user);

  const topNavbar = useSelector((state) => state.topNavbar);
  const properties = useSelector((state) => state.properties);
  const usersProperties = useSelector((state) => state.usersProperties);
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
  const historyStack = useSelector((state) => state.historyStack.value);
  const pricing = useSelector((state) => state.pricing);

  const { updateTimer, isExpired } = useTimer();
  const { findLocationsWithinDistance } = useMap();
  const { updateReduxProperty } = useRedux();
  const { pushNotification } = useNotification();
  const { updateUser } = useUser();
  const { loadUsersPropertiesFromLocalState } = useLoader();

  // Render the main content

  let intervalId;

  function runUpdateTimerEveryMinute() {
    // Run the updateTimer function initially
    updateTimer(user);

    // Set up the recurring call using setInterval
    intervalId = setInterval(() => {
      updateTimer(user);
      console.log("update timer loop");
    }, 60000); // Adjust the interval time as needed

    return () => clearInterval(intervalId);
  }

  const printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();

    if (coordinates.coords.latitude && coordinates.coords.longitude) {
      const userNewCoords = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      };

      const isSameCoords = (JSON.stringify(user?.coords || null) === JSON.stringify(userNewCoords));
      console.log("dispatching users Current position:", userNewCoords);
      dispatch(
        setUserCurrentPosition(userNewCoords)
      );

      if (user) {
        if (!isSameCoords) {
          console.log("updating the user's current coords ", user, { userNewCoords }, (JSON.stringify(user?.coords || null) !== JSON.stringify(userNewCoords)));
          updateUser({
            userId: user._id,
            coords: {
              lat: coordinates.coords.latitude,
              lng: coordinates.coords.longitude,
            }
          });
        } else {
          console.log("don't update the user's current coords because it is the same", user, { userNewCoords }, (JSON.stringify(user?.coords || null) !== JSON.stringify(userNewCoords)));
        }
      }
    }
  };

  // Start the interval

  useEffect(() => {
    const pageLoader = () => {
      // console.log(formattedTrees);
      // const center = {
      //   lat: 43.762675631892,
      //   lng: -79.5724992821253,
      // };

      // const searchResults = findLocationsWithinDistance(
      //   formattedTrees,
      //   center,
      //   500
      // );
      // .sort((a, b) => a.distance - b.distance)

      // console.log(searchResults);
      printCurrentPosition();

      if (user && user.startTime && !user.leftTime && !isExpired) {
        runUpdateTimerEveryMinute();
      }
    };

    pageLoader();

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [user, isExpired]); // Include isExpired in the dependency array

  useEffect(() => {
    // Connect to the Socket.io server
    const socket = io(`${process.env.REACT_APP_API_URL}/`, {
      auth: {
        app: "tranogasy-app",
        socketId: localStorage.getItem('socketId') // Send the generated unique ID
      }
    });

    // Subscribe to the 'notification' event
    socket.on("notification", (notificationData) => {
      const notification = notificationData.payload;
      // Handle the new notification received in real-time
      if (
        user &&
        notification &&
        notification.user === user._id &&
        notification.confirmedBy !== null
      ) {
        //Dispatch an action to update your Redux store with the new notification
        if (notificationData.reason === "create") {
          pushNotification(notification);
          console.log("New Notification Received:", notification);
        }
        if (notificationData.reason === "delete") {
          dispatch(deleteFromNotifications(notification));
          console.log("Notification deleted:", notification);
        }
      } else if (user &&
        notification &&
        notification.user === user._id &&
        notification.confirmedBy === null) {
        if (notificationData.reason === "create") {
          if (notification.reason === "normal") {
            pushNotification(notification);
            console.log("New Notification Received:", notification);
          }
        }
        if (notificationData.reason === "delete") {
          dispatch(deleteFromNotifications(notification));
          console.log("Notification deleted:", notification);
        }
      }
    });

    // Subscribe to the 'payment' event
    socket.on("property", (propertyData) => {
      const property = propertyData.payload;
      console.log("propertyData izany ary", propertyData);

      // Handle the payment data received in real-time
      if (property) {
        // You can dispatch an action or handle the payment data as needed
        if (propertyData.reason === "create") {
          dispatch(pushProperty(property));
          console.log("New property added:", property);
        }
        if (propertyData.reason === "update") {
          dispatch(updateReduxProperty(property));
          console.log("New property update:", property);
        }
        if (propertyData.reason === "delete") {
          dispatch(deleteFromTopProperty({ propertyId: property }));
          dispatch(deleteFromProperties({ propertyId: property }));
          if (user) dispatch(deleteLike(property));
          console.log("Property deleted:", property);
        }
      }
    });

    // Subscribe to the 'payment' event
    socket.on("payment", (paymentData) => {
      const payment = paymentData.payload;
      console.log("paymentData izany ary", paymentData);

      // Handle the payment data received in real-time
      if (user && payment && payment.user._id === user._id) {
        // You can dispatch an action or handle the payment data as needed
        if (paymentData.reason === "create") {
          dispatch(addPayment(payment));
          console.log("New Payment added:", payment);
        }
        if (paymentData.reason === "update") {
          dispatch(updatePayment(payment));
          console.log("Payment updated:", payment);
        }
      }
    });

    // Subscribe to the 'user' event
    socket.on("user", (userData) => {
      const socketUser = userData.payload;
      // Handle the payment data received in real-time
      if (user && socketUser && socketUser._id === user._id) {
        // You can dispatch an action or handle the payment data as needed
        if (userData.reason === "updateSubscription") {
          if (!socketUser.planValidity || socketUser.leftTime) {
            console.log("resetnnhhfghffghdfghdfg");
            dispatch(setTimer({ timer: null, display: null }));
          }
          dispatch(setUser(socketUser));
          console.log("User subscription updated:", socketUser);
        }
      }
    });


    // Clean up the event listener on component unmount
    return () => {
      socket.off("notification");
      socket.off("property");
      socket.off("payment");
      socket.off("user");
    };
  }, [user]);

  useEffect(() => {
    if (user && properties && properties.length > 0 && !usersProperties) {
      loadUsersPropertiesFromLocalState(user._id, properties);
    }
  }, [user, properties, usersProperties]);

  useEffect(() => {
    const trackHistory = () => {

      const currenturl = window.location.href;
      const currentPath = currenturl.split("#/")[1]; // This will split at the "#/" and take the second part

      if (historyStack[historyStack.length - 1] !== currentPath) {
        dispatch(pushHistoryStack(currentPath)); // Dispatch the new path to Redux
      }

      const lastIndex = historyStack.lastIndexOf("login");
      if (lastIndex !== -1) {
        // get the right numbers to get back after the login
        const rightNumbers = (historyStack.length - (lastIndex + 1)) + (historyStack[lastIndex - 1] === "login" ? 2 : 1);
        dispatch(setSteps(rightNumbers));
      }

    };

    // Track initial load
    trackHistory();

    // You can also track history on route changes
    window.addEventListener("pushState", trackHistory);
    window.addEventListener("replaceState", trackHistory);

    return () => {
      window.removeEventListener("pushState", trackHistory);
      window.removeEventListener("replaceState", trackHistory);
    };
  }, [window.location.href]);


  return (
    <WonderPush options={{ webKey: 'ad242738aead9587c7ee3a981f65e2acabfa82bbe33620c0d14cf1ced5b0b5a1' }}>
      <AutoSubscribe />
      {/* <BackButtonHandler /> // Handle back button navigation on android devices */}
        {pricing.pricingModal && <PricingModal />}
      <div id="app-homepage" className="app">
        <SkeletonTheme>
          <Router hook={useHashLocation}>
            <div className="App">
              {loader && topNavbar && true && <Navbar />}
              <div style={{ display: "none" }}>
                <Darkreader
                  defaultDarken={isDarkMode}
                  theme={{
                    brightness: 100,
                    contrast: 85,
                  }}
                  onChange={() => dispatch(toggleDarkMode())}
                />
              </div>
              <main>
                <Switch>
                  <Route path="/property-details/:propertyId/:propertyData/:prevPath">
                    <PropertyDetailsPage />
                  </Route>
                  <Route path="/loader">
                    <PageLoader />
                  </Route>

                  {/* If loader is false, show PageLoader */}
                  {!loader &&
                    <Route path="/:anything*">
                      <PageLoader />
                    </Route>}

                  {/* If loader is true, render the routes */}
                  {loader &&
                    routes.map(({ path, component: Component, private: isPrivate }, index) => (
                      <Route key={index} path={path}>
                        {/* Handle private routes if needed */}
                        {isPrivate && user ? <Redirect to="/user" /> : <Component />}
                      </Route>
                    ))}

                  {/* Handle 404 page */}
                  {loader &&
                    <Route path="/:anything*">
                      <center className="mt-5">
                        <b>404:</b> Désolé, cette page n'est pas encore prête!
                      </center>
                    </Route>}
                </Switch>
              </main>
            </div>
          </Router>
        </SkeletonTheme>
      </div>
    </WonderPush>
  );
}

export default App;
