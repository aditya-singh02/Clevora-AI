import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import store, { persistor } from "./redux/store.js"; // ← Named + default export
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";

// Axios global defaults
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
