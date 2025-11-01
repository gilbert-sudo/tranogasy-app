import { useSelector, useDispatch } from "react-redux";
import {
  setUser,
  setSignUp,
  setLoader,
  setNavbar,
  setTopNavbar,
  resetPagination,
  setTopProperties,
  updateReduxUsersProperties,
  updateLikedProperties,
  updateProperties,
  updateTopProperty,
  setProperties,
  setNotifications,
  setPayments,
  setNotificationReadingStatus,
  setNotificationCounterStatus,
  resetLikedPropreties,
  setUsersProperties,
  setTimer,
  resetAccountRecovery,
} from "../redux/redux";

export const useRedux = () => {

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  // Central update function using Thunks
  const updateReduxProperty = (property) => (dispatch) => {
    if (user) {
      dispatch(updateReduxUsersProperties(property));
      dispatch(updateLikedProperties(property));
    }
    dispatch(updateProperties(property));
    dispatch(updateTopProperty(property));
    // You can add any other necessary dispatches here
  };

  const resetReduxStore = () => {
    console.log("resetimg redux Store");
    // reset the connected user state
    dispatch(setUser(null));
    // reset the user's timer state
    dispatch(setTimer({ timer: null, display: null }));
    // reset the signup waitlist
    dispatch(setSignUp(null));
    // reset the loader state into undone
    dispatch(setLoader(null));
    // reset the navbar state into onshow
    dispatch(setNavbar(true));
    dispatch(setTopNavbar(true));
    // Reset pagination global state
    dispatch(resetPagination());
    // Resest topProperties state
    // dispatch(setTopProperties(null));
    //Reset the initial property list
    // dispatch(setProperties(null));
    //Reset the initial notifications list
    dispatch(setNotifications(null));
    dispatch(setPayments([]));
    dispatch(setNotificationReadingStatus(null));
    dispatch(setNotificationCounterStatus(0));
    //Reset the liked property list
    dispatch(resetLikedPropreties());
    //Reset the user's listing
    dispatch(setUsersProperties(null));
    dispatch(resetAccountRecovery());
  };
  return { updateReduxProperty, resetReduxStore };
};
