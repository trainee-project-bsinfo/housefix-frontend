import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import { SettingsDialog } from "./dialogs/SettingsDialog";

const pages = {
  Kunden: "/",
  "Alle Auslesungen": "/all",
};

export const Navbar = () => {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                onClick={() => (window.location.href = pages.Kunden)}
                src="/logo.png"
                height="40px"
                width="40px"
                style={{ marginRight: "5px", cursor: "pointer" }}
              />
              <Box className="nav-links" sx={{ flexGrow: 1, display: "flex" }}>
                {Object.keys(pages).map((page) => (
                  <Button
                    key={page}
                    onClick={() =>
                      (window.location.href = pages[page as keyof typeof pages])
                    }
                    sx={{
                      my: 2,
                      marginLeft: "5px",
                      color: "white",
                      display: "block",
                    }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            </div>
            <IconButton onClick={() => setShowSettingsDialog(true)}>
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <SettingsDialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
      />
    </>
  );
};
