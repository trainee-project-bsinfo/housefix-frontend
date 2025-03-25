import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deDE } from "@mui/material/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { de } from "date-fns/locale/de";
import { GlobalStyles, useMediaQuery } from "@mui/material";
import { CustomerReadings } from "./pages/CustomerReadings";
import { AllReadings } from "./pages/AllReadings";
import { Page } from "./components/Page";

const App = () => {
  const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");

  const theme = createTheme(
    {
      components: {
        MuiInputBase: {
          defaultProps: {
            disableInjectingGlobalStyles: true,
          },
        },
      },
      palette: {
        mode: prefersLightMode ? "light" : "dark",
        warning: { main: "#ff0000" },
      },
    },
    deDE
  );

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            "@keyframes mui-auto-fill": { from: { display: "block" } },
            "@keyframes mui-auto-fill-cancel": { from: { display: "block" } },
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
          <BrowserRouter>
            <Routes>
              <Route element={<Page />}>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Home />} />
                <Route path="/c/:customerId" element={<CustomerReadings />} />
                <Route path="/all" element={<AllReadings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
