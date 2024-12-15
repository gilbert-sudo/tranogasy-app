import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//all redux dependencies
import { Provider } from "react-redux";
import { store } from "./redux/redux";

// import { StatusBar, Style } from '@capacitor/status-bar';

// Set status bar style to light content (white background, dark text/icons)
// const setStatusBarStyleLight = async () => {
//   await StatusBar.setStyle({ style: Style.Light });
// };

// setStatusBarStyleLight();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
