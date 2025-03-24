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
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
