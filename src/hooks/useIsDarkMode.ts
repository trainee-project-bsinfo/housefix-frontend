import { useTheme } from "@mui/material";

export const useIsDarkMode = () => {
  const theme = useTheme();
  return theme.palette.mode === "dark";
};
