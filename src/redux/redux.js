import { configureStore, createSlice } from "@reduxjs/toolkit";
import { BsDisplay } from "react-icons/bs";

//connected user
const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    addLikeToUserState: (state, action) => {
      state.favorites.unshift(action.payload);
    },
    removeLikeFromUserState: (state, action) => {
      state.favorites = state.favorites.filter(
        (id) => id !== action.payload // Filter out the ID to remove
      );
    },
    updateOneUserById: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  setUser,
  updateOneUserById,
  addLikeToUserState,
  removeLikeFromUserState,
} = userSlice.actions;

const geolocationSlice = createSlice({
  name: "geolocation",
  initialState: {
    userCurrentPosition: {
      lat: -18.905195365917766,
      lng: 47.52370521426201,
    },
  },
  reducers: {
    setUserCurrentPosition: (state, action) => {
      state.userCurrentPosition = action.payload;
    },
  },
});

export const { setUserCurrentPosition } = geolocationSlice.actions;

// user account recovery data
const accountRecoverySlice = createSlice({
  name: "accountRecovery",
  initialState: {
    verification: null,
    user: null,
  },
  reducers: {
    resetAccountRecovery: (state, action) => {
      return {
        verification: null,
        user: null,
      };
    },
    setAccountRecoveryVerification: (state, action) => {
      state.verification = action.payload;
    },
    setAccountRecoveryUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  resetAccountRecovery,
  setAccountRecoveryVerification,
  setAccountRecoveryUser,
} = accountRecoverySlice.actions;

//remaining time
const timerSlice = createSlice({
  name: "timer",
  initialState: { timer: null, display: null },
  reducers: {
    setTimer: (state, action) => {
      return action.payload;
    },
  },
});

export const { setTimer } = timerSlice.actions;

//signup user log
const signUpSlice = createSlice({
  name: "signup",
  initialState: null,
  reducers: {
    setSignUp: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSignUp } = signUpSlice.actions;

//image upload state
const imgSlice = createSlice({
  name: "img",
  initialState: [],
  reducers: {
    resetImg: (state, action) => {
      return [];
    },
    setImg: (state, action) => {
      return action.payload;
    },
    reduxAddImg: (state, action) => {
      state.push(action.payload);
    },
    reduxPopImg: (state, action) => {
      state.pop();
    },
    reduxDeleteImg: (state, action) => {
      // Find and remove the property by its url
      return (state = state.filter(
        (img) => img.src !== action.payload.imageUrl
      ));
    },
  },
});

export const { setImg, resetImg, reduxDeleteImg, reduxAddImg, reduxPopImg } =
  imgSlice.actions;

const imgPreviewSlice = createSlice({
  name: "imgPreview",
  initialState: [],
  reducers: {
    resetImgPreview: (state, action) => {
      return [];
    },
    setImgPreview: (state, action) => {
      return action.payload;
    },
    reduxAddImgPreview: (state, action) => {
      state.push(action.payload);
    },
    reduxPopImgPreview: (state, action) => {
      state.pop();
    },
    reduxDeleteImgPreviewByIndex: (state, action) => {
      const indexToDelete = action.payload;
      state.splice(indexToDelete, 1);
    },
  },
});

export const {
  setImgPreview,
  resetImgPreview,
  reduxDeleteImgPreview,
  reduxAddImgPreview,
  reduxPopImgPreview,
  reduxDeleteImgPreviewByIndex,
} = imgPreviewSlice.actions;

//loader
const loaderSlice = createSlice({
  name: "loader",
  initialState: null,
  reducers: {
    setLoader: (state, action) => {
      return action.payload;
    },
  },
});

export const { setLoader } = loaderSlice.actions;

//navbar
const navbarSlice = createSlice({
  name: "navbar",
  initialState: true,
  reducers: {
    setNavbar: (state, action) => {
      return action.payload;
    },
  },
});

export const { setNavbar } = navbarSlice.actions;

const topNavbarSlice = createSlice({
  name: "topNavbar",
  initialState: true,
  reducers: {
    setTopNavbar: (state, action) => {
      return action.payload;
    },
  },
});

export const { setTopNavbar } = topNavbarSlice.actions;

//paginnations
const paginationSlice = createSlice({
  name: "pagination",
  initialState: [{ previousUrl: null }],
  reducers: {
    setPreviousUrl: (state, action) => {
      state[0].previousUrl = action.payload;
    },
    resetPagination: (state, action) => {
      state = [{ previousUrl: null }];
    },
  },
});
export const { setPreviousUrl, resetPagination } = paginationSlice.actions;

const historyStackSlice = createSlice({
  name: "historyStack",
  initialState: {
    value: [],
    steps: 0,
  },
  reducers: {
    pushHistoryStack: (state, action) => {
      const newPath = action.payload;
      
      if (state.value.length > 10) {
        state.value.shift();
      }
      state.value.push(newPath);
    },
    setSteps:  (state, action) => {
      const goBackSteps = action.payload;
      state.steps = goBackSteps;
    },
  },
});

export const { pushHistoryStack, setSteps } = historyStackSlice.actions;

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState: {
    isDarkMode: JSON.parse(localStorage.getItem("darkMode")),
  },
  reducers: {
    toggleDarkMode: (state) => {
      localStorage.setItem("darkMode", !state.isDarkMode);
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;

//Top50Properties
const topPropertiesSlice = createSlice({
  name: "topProperties",
  initialState: null,
  reducers: {
    setTopProperties: (state, action) => {
      return action.payload;
    },
    deleteFromTopProperty: (state, action) => {
      // Extract the property to delete from the action payload
      const propertyToDeleteId = action.payload.propertyId;

      // Find the index of the property to delete
      const propertyIndex = state.findIndex(
        (topProperty) => topProperty.property._id === propertyToDeleteId
      );

      if (propertyIndex !== -1) {
        // If the property is found, delete it from the array
        state.splice(propertyIndex, 1);
      }
    },
    // Update a specific property
    updateTopProperty: (state, action) => {
      // Extract the updated property from the action payload
      const updatedProperty = action.payload;

      // Find the index of the property to update
      const topPropertyIndex = state.findIndex(
        (topProperty) => topProperty.property._id === updatedProperty._id
      );

      if (topPropertyIndex !== -1) {
        // If the property is found, update it in the array
        state[topPropertyIndex].property = updatedProperty;
      }
    },
  },
});

export const { setTopProperties, deleteFromTopProperty, updateTopProperty } =
  topPropertiesSlice.actions;

//the user's properties
const usersPropertiesSlice = createSlice({
  name: "usersProperties",
  initialState: null,
  reducers: {
    setUsersProperties: (state, action) => {
      return action.payload;
    },
    addUsersProperty: (state, action) => {
      state.unshift(action.payload);
    },
    deleteUsersProperty: (state, action) => {
      // Find and remove the property by its ID
      return (state = state.filter(
        (property) => property._id !== action.payload.propertyId
      ));
    },
    // Update a specific property
    updateReduxUsersProperties: (state, action) => {
      // Extract the updated property from the action payload
      const updatedProperty = action.payload;

      // Find the index of the property to update
      const propertyIndex = state.findIndex(
        (property) => property._id === updatedProperty._id
      );

      if (propertyIndex !== -1) {
        // If the property is found, update it in the array
        state[propertyIndex] = updatedProperty;
      }
    },
  },
});

export const {
  setUsersProperties,
  addUsersProperty,
  deleteUsersProperty,
  updateReduxUsersProperties,
} = usersPropertiesSlice.actions;

//properties
const propertiesSlice = createSlice({
  name: "properties",
  initialState: null,
  reducers: {
    pushProperty: (state, action) => {
      const isPropertyExists = state.some((property) => property._id === action.payload._id);
      if (!isPropertyExists) {
        state.unshift(action.payload);
      }
    },
    setProperties: (state, action) => {
      return (state = action.payload);
    },
    deleteFromProperties: (state, action) => {
      // Extract the property to delete from the action payload
      const propertyToDeleteId = action.payload.propertyId;

      // Find the index of the property to delete
      const propertyIndex = state.findIndex(
        (property) => property._id === propertyToDeleteId
      );

      if (propertyIndex !== -1) {
        // If the property is found, delete it from the array
        state.splice(propertyIndex, 1);
      }
    },
    // Update a specific property
    updateProperties: (state, action) => {
      // Extract the updated property from the action payload
      const updatedProperty = action.payload;

      // Find the index of the property to update
      const propertyIndex = state.findIndex(
        (property) => property._id === updatedProperty._id
      );

      if (propertyIndex !== -1) {
        // If the property is found, update it in the array
        state[propertyIndex] = updatedProperty;
      }
    },
  },
});

export const {
  pushProperty,
  setProperties,
  deleteFromProperties,
  updateProperties,
} = propertiesSlice.actions;

//notifications
const notificationSlice = createSlice({
  name: "notifications",
  initialState: null,
  reducers: {
    pushNotification: (state, action) => {
      const newNotification = action.payload;

      // Check if the notification with the same ID already exists
      const isNotificationExists = state.some(
        (notification) => notification._id === newNotification._id
      );

      // If the notification doesn't exist, add it to the beginning of the array
      if (!isNotificationExists) {
        state.unshift(newNotification);
      }
    },
    setNotifications: (state, action) => {
      return (state = action.payload);
    },
    deleteFromNotifications: (state, action) => {
      // Find and remove the notification by its ID
      return (state = state.filter(
        (notification) => notification._id !== action.payload._id
      ));
    },
    // New action to update the status of all notifications to "read"
    markAllNotificationsAsRead: (state) => {
      state.forEach((notification) => {
        notification.status = "read";
      });
    },
  },
});

export const {
  pushNotification,
  setNotifications,
  deleteFromNotifications,
  markAllNotificationsAsRead,
} = notificationSlice.actions;
//notifications
const notificationStatusSlice = createSlice({
  name: "notificationStatus",
  initialState: { reading: null, counter: 0 },
  reducers: {
    setNotificationReadingStatus: (state, action) => {
      state.reading = action.payload;
    },
    setNotificationCounterStatus: (state, action) => {
      state.counter = action.payload;
    },
    pushNotificationCounterStatus: (state, action) => {
      state.counter = state.counter + 1;
    },
  },
});

export const {
  setNotificationReadingStatus,
  setNotificationCounterStatus,
  pushNotificationCounterStatus,
} = notificationStatusSlice.actions;

//searchForm state
const searchFormSlice = createSlice({
  name: "searchForm",
  initialState: {
    byNumber: false,
    propertyNumber: null,
    selectedCity: null,
    selectedCommune: null,
    selectedDistrict: null,
    gmapValue: null,
  },
  reducers: {
    setReduxByNumber: (state, action) => {
      state.byNumber = action.payload.byNumber;
    },
    setReduxPropertyNumber: (state, action) => {
      state.propertyNumber = action.payload.propertyNumber;
    },
    setReduxSelectedCity: (state, action) => {
      state.selectedCity = action.payload.selectedCity;
    },
    setReduxSelectedDistrict: (state, action) => {
      state.selectedDistrict = action.payload.selectedDistrict;
    },
    setReduxSelectedCommune: (state, action) => {
      state.selectedCommune = action.payload.selectedCommune;
    },
    setReduxGmapValue: (state, action) => {
      state.gmapValue = action.payload.gmapValue;
    },
  },
});

export const {
  setReduxByNumber,
  setReduxPropertyNumber,
  setReduxSelectedCity,
  setReduxSelectedCommune,
  setReduxSelectedDistrict,
  setReduxGmapValue,
} = searchFormSlice.actions;


//search results
const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState: null,
  reducers: {
    setSearchResults: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setSearchResults } = searchResultsSlice.actions;

//liked properties
const likedPropertiesSlice = createSlice({
  name: "likedProperties",
  initialState: [],
  reducers: {
    setLikedPropreties: (state, action) => {
      return action.payload;
    },
    resetLikedPropreties: (state, action) => {
      return [];
    },
    addLike: (state, action) => {
      state.unshift(action.payload);
    },
    deleteLike: (state, action) => {
      const index = state.findIndex((like) => like._id === action.payload);
      if (index > -1) state.splice(index, 1) 
    },
    // Update a specific property
    updateLikedProperties: (state, action) => {
      // Extract the updated property from the action payload
      const updatedProperty = action.payload;

      // Find the index of the property to update
      const likeIndex = state.findIndex(
        (like) => like._id === updatedProperty._id
      );

      if (likeIndex !== -1) {
        // If the property is found, update it in the array
        state[likeIndex] = updatedProperty;
      }
    },
  },
});

export const {
  setLikedPropreties,
  resetLikedPropreties,
  addLike,
  deleteLike,
  updateLikedProperties,
} = likedPropertiesSlice.actions;

const quarterSlice = createSlice({
  name: "quarter",
  initialState: [{ quarters: [] }, { quartersName: [] }],
  reducers: {
    setquarter: (state, action) => {
      state[0].quarters = [...action.payload];
    },
    resetQuarter: (state, action) => {
      return [{ quarters: [] }, { quartersName: [] }];
    },
    setQuartersName: (state, action) => {
      state[1].quartersName = [...action.payload];
    },
  },
});
export const { setQuarter, setQuartersName, resetQuarter } =
  quarterSlice.actions;


//Payments slice

const paymentSlice = createSlice({
  name: "payments",
  initialState: [],
  reducers: {
    setPayments: (state, action) => {
      return action.payload;
    },
    addPayment: (state, action) => {
      const isPaymentExists = state.some(
        (payment) => payment._id === action.payload._id
      );
      if (!isPaymentExists) {
        state.unshift(action.payload);
      }
    },
    // Update a specific payments
    updatePayment: (state, action) => {
      const updatedPayment = action.payload;
      const paymentIndex = state.findIndex(
        (payment) => payment._id === updatedPayment._id
      );
      if (paymentIndex !== -1) {
        state[paymentIndex] = updatedPayment;
      }
    },
  },
});

export const { setPayments, addPayment , updatePayment } = paymentSlice.actions;

//Plan slice

const planSlice = createSlice({
  name: "plans",
  initialState: [],
  reducers: {
    setPlans: (state, action) => {
      return action.payload;
    },
  },
});

export const { setPlans } = planSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    geolocation: geolocationSlice.reducer,
    accountRecovery: accountRecoverySlice.reducer,
    timer: timerSlice.reducer,
    historyStack: historyStackSlice.reducer,
    signup: signUpSlice.reducer,
    img: imgSlice.reducer,
    imgPreview: imgPreviewSlice.reducer,
    loader: loaderSlice.reducer,
    navbar: navbarSlice.reducer,
    topNavbar: topNavbarSlice.reducer,
    pagination: paginationSlice.reducer,
    darkMode: darkModeSlice.reducer,
    topProperties: topPropertiesSlice.reducer,
    usersProperties: usersPropertiesSlice.reducer,
    properties: propertiesSlice.reducer,
    notifications: notificationSlice.reducer,
    notificationStatus: notificationStatusSlice.reducer,
    likedProperties: likedPropertiesSlice.reducer,
    searchResults: searchResultsSlice.reducer,
    searchForm: searchFormSlice.reducer,
    quarter: quarterSlice.reducer,
    payments: paymentSlice.reducer,
    plans: planSlice.reducer,
  },
});