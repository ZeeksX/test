import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/main.css";
import App from "./App.jsx";
import "./App.css";
import { Provider } from "react-redux";
import store from "./features/store.jsx";
import { HelmetProvider } from "react-helmet-async";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
