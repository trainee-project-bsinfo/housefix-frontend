import { Button, TextField } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useMutation } from "../hooks/useMutation";
import { getApiBaseUrl } from "../helper/getApiBaseUrl";
import { routes } from "../main";
import { setToken } from "../helper/token";
import { useQuery } from "../hooks/useQuery";

export const Login = () => {
  const { isSuccess: isAuthenticated } = useQuery(`${getApiBaseUrl()}/auth`);
  const { send: login } = useMutation<{ username: string; password: string }>(
    `${getApiBaseUrl()}/auth`,
    "POST"
  );

  useEffect(() => {
    if (isAuthenticated) {
      location.href = routes.home;
    }
  }, [isAuthenticated]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const payload = Object.fromEntries(formData.entries()) as unknown as {
        username: string;
        password: string;
      };

      const res = await login(payload);
      if (res.ok) {
        const token = (await res.json()).token as string;
        if (token) {
          setToken(token);
          location.href = routes.home;
        }
      }
    },
    [login]
  );

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 auto",
        width: "100%",
        maxWidth: "700px",
      }}
    >
      <h1>Einloggen</h1>
      <TextField
        label="Benutzername"
        name="username"
        required
        variant="filled"
        margin="dense"
        fullWidth
      />
      <TextField
        label="Passwort"
        name="password"
        type="password"
        required
        variant="filled"
        margin="dense"
        fullWidth
      />
      <Button sx={{ marginTop: "20px" }} type="submit" variant="contained">
        Login
      </Button>
    </form>
  );
};
