import { configureStore, createSlice } from "@reduxjs/toolkit";

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
    userCurrentPosition: null,
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
    setSteps: (state, action) => {
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
    pushTopProperty: (state, action) => {
      const isPropertyExists = state.some((property) => property._id === action.payload._id);
      if (!isPropertyExists) {
        state.unshift(action.payload);
      }
    },
    setTopProperties: (state, action) => {
      return action.payload;
    },
    deleteFromTopProperty: (state, action) => {
      // Extract the property to delete from the action payload
      const propertyToDeleteId = action.payload.propertyId;

      // Find the index of the property to delete
      const propertyIndex = state.findIndex(
        (topProperty) => topProperty._id === propertyToDeleteId
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
      if (state) {
        // Find the index of the property to update
        const topPropertyIndex = state.findIndex(
          (topProperty) => topProperty._id === updatedProperty._id
        );

        if (topPropertyIndex !== -1) {
          // If the property is found, update it in the array
          state[topPropertyIndex] = updatedProperty;
        }
      }
    },
  },
});

export const {
  pushTopProperty,
  setTopProperties,
  deleteFromTopProperty,
  updateTopProperty
} = topPropertiesSlice.actions;

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
      if (state) {
        // Find the index of the property to update
        const propertyIndex = state.findIndex(
          (property) => property._id === updatedProperty._id
        );

        if (propertyIndex !== -1) {
          // If the property is found, update it in the array
          state[propertyIndex] = updatedProperty;
        }
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
      state.unshift(action.payload);
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
  initialState: { reading: null, counter: 0, bell: false },
  reducers: {
    setNotificationReadingStatus: (state, action) => {
      state.reading = action.payload;
    },
    setNotificationCounterStatus: (state, action) => {
      state.counter = action.payload;
    },
    setNotificationBellStatus: (state, action) => {
      state.bell = action.payload;
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
  setNotificationBellStatus
} = notificationStatusSlice.actions;


const initialState = {
  gmapValue: null,
  isRent: true,
  isSale: false,
  isColoc: false,
  budgetMax: null,
  budgetMin: null,
  rangeValue: [0, 0],
  selectedRoom: "1+",
  customRoom: "",
  carAccess: false,
  motoAccess: false,
  wifiAvailability: false,
  parkingSpaceAvailable: false,
  waterPumpSupply: false,
  electricity: false,
  securitySystem: false,
  waterWellSupply: false,
  surroundedByWalls: false,
  kitchenFacilities: false,
  airConditionerAvailable: false,
  swimmingPool: false,
  furnishedProperty: false,
  hotWaterAvailable: false,
  insideToilet: "all",
  insideBathroom: "all",
  elevator: false,
  garden: false,
  courtyard: false,
  balcony: false,
  roofTop: false,
  independentHouse: false,
  garage: false,
  guardianHouse: false,
  bassin: false,
  placardKitchen: false,
  bathtub: false,
  fireplace: false,
  fiberOpticReady: false,
  seaView: false,
  mountainView: false,
  panoramicView: false,
  solarPanels: false,
  seachArea: null,
  searchCoordinates: null,
  searchRadius: null,
  address: null,
};

const searchFormSlice = createSlice({
  name: "searchForm",
  initialState,
  reducers: {
    setReduxGmapValue: (state, action) => {
      state.gmapValue = action.payload.gmapValue;
    },
    setSearchFormState: (state, action) => {
      Object.assign(state, action.payload);
    },
    setSearchFormField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetSearchForm: () => initialState,
  },
});

export const {
  setReduxGmapValue,
  setSearchFormState,
  setSearchFormField,
  resetSearchForm,
} = searchFormSlice.actions;

//tranogasy map 
const tranogasyMapInitialState = {
  formFilter: false,
  activeFiltersCount: 0,
  selectedProperty: null,
  previousCenter: null,
  previousSelectedPlace: null,
  rawSearchResults: null,
};

const tranogasyMapSlice = createSlice({
  name: "tranogasyMap",
  initialState: tranogasyMapInitialState,
  reducers: {
    setReduxFormFilter: (state, action) => {
      state.formFilter = action.payload.formFilter;
    },
    setTranogasyMapState: (state, action) => {
      Object.assign(state, action.payload);
    },
    setTranogasyMapField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetTranogasyMap: () => tranogasyMapInitialState,
  },
});

export const {
  setReduxFormFilter,
  setTranogasyMapState,
  setTranogasyMapField,
  resetTranogasyMap
} = tranogasyMapSlice.actions;

//tranogasy Feed 
const tranogasyFeedInitialState = {
  selectedProperty: null,
  isFeedSliderVisible: false,
};

const tranogasyFeedSlice = createSlice({
  name: "tranogasyFeed",
  initialState: tranogasyFeedInitialState,
  reducers: {
    setTranogasyFeedState: (state, action) => {
      Object.assign(state, action.payload);
    },
    setTranogasyFeedField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetTranogasyFeed: () => tranogasyFeedInitialState,
  },
});

export const {
  setTranogasyFeedState,
  setTranogasyFeedField,
  resetTranogasyFeed
} = tranogasyFeedSlice.actions;


//tranogasy 
const tranogasyListInitialState = {
  selectedProperty: null,
  isListViewSliderVisible: false,
};

const tranogasyListSlice = createSlice({
  name: "tranogasyList",
  initialState: tranogasyListInitialState,
  reducers: {
    setTranogasyListState: (state, action) => {
      Object.assign(state, action.payload);
    },
    setTranogasyListField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetTranogasyList: () => tranogasyListInitialState,
  },
});

export const {
  setTranogasyListState,
  setTranogasyListField,
  resetTranogasyList
} = tranogasyListSlice.actions;

//search results
const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState: null,
  reducers: {
    setSearchResults: (state, action) => {
      return (state = action.payload);
    },
    resetSearchResults: (state, action) => {
      return null;
    },
  },
});

export const { setSearchResults, resetSearchResults } = searchResultsSlice.actions;

//liked properties
const likedPropertiesSlice = createSlice({
  name: "likedProperties",
  initialState: null,
  reducers: {
    setLikedPropreties: (state, action) => {
      return action.payload;
    },
    resetLikedPropreties: (state, action) => {
      return null;
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
      if (state) {
        const likeIndex = state.findIndex(
          (like) => like._id === updatedProperty._id
        );

        if (likeIndex !== -1) {
          // If the property is found, update it in the array
          state[likeIndex] = updatedProperty;
        }
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

export const { setPayments, addPayment, updatePayment } = paymentSlice.actions;

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

//tranogasy pricing
const pricingInitialState = {
  pricingModal: false,
};

const pricingSlice = createSlice({
  name: "pricing",
  initialState: pricingInitialState,
  reducers: {
    setPricingState: (state, action) => {
      Object.assign(state, action.payload);
    },
    setPricingField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetPricing: () => pricingInitialState,
  },
});

export const {
  setPricingState,
  setPricingField,
  resetPricing
} = pricingSlice.actions;

//tranogasy Gilbert AI
const gilbertAiInitialState = {
  isChatboxOpen: false,
  chatMessages: [
    {
      id: 1,
      text: `👋 Salama tompoko ! Je suis Gilbert (i Zily 😁), ton agent immobilier virtuel sur TranoGasy.
            Je peux t'aider à trouver, vendre ou louer une maison à Madagascar. \n
            😊 Que puis-je faire pour vous?`,
      isUser: false,
      timestamp: new Date(),
      status: "unread", // "read" | "unread" 
    },
  ],
};

const gilbertAiSlice = createSlice({
  name: "gilbertAi",
  initialState: gilbertAiInitialState,
  reducers: {
    setGilbertAiState: (state, action) => {
      Object.assign(state, action.payload);
    },
    setGilbertAiField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetGilbertAi: () => gilbertAiInitialState,
  },
});

export const {
  setGilbertAiState,
  setGilbertAiField,
  resetGilbertAi
} = gilbertAiSlice.actions;

//tranogasy modals
const modalsInitialState = {
  isMasterModalOpen: false,
  codeConfirmer: null,
  masterModalContent: "login",
};

const modalsSlice = createSlice({
  name: "modals",
  initialState: modalsInitialState,
  reducers: {
    setModalsState: (state, action) => {
      Object.assign(state, action.payload);
    },
    setModalsField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetModals: () => modalsInitialState,
  },
});

export const {
  setModalsState,
  setModalsField,
  resetModals
} = modalsSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    geolocation: geolocationSlice.reducer,
    accountRecovery: accountRecoverySlice.reducer,
    timer: timerSlice.reducer,
    historyStack: historyStackSlice.reducer,
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
    tranogasyMap: tranogasyMapSlice.reducer,
    tranogasyFeed: tranogasyFeedSlice.reducer,
    tranogasyList: tranogasyListSlice.reducer,
    quarter: quarterSlice.reducer,
    payments: paymentSlice.reducer,
    plans: planSlice.reducer,
    pricing: pricingSlice.reducer,
    gilbertAi: gilbertAiSlice.reducer,
    modals: modalsSlice.reducer,
  },
});
