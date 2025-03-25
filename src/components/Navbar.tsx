import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";

export const Navbar = () => {
  const pages = {
    Kunden: "/",
    "Alle Auslesungen": "/all",
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            onClick={() => (window.location.href = pages.Kunden)}
            src="/favicon.ico"
            height="40px"
            width="40px"
            style={{ marginRight: "10px", cursor: "pointer" }}
          />
          <Box className="nav-links" sx={{ flexGrow: 1, display: "flex" }}>
            {Object.keys(pages).map((page) => (
              <Button
                key={page}
                onClick={() =>
                  (window.location.href = pages[page as keyof typeof pages])
                }
                sx={{ my: 2, marginLeft: "10px", color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
