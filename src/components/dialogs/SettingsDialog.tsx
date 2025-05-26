import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "../../hooks/useMutation";
import { getApiBaseUrl } from "../../helper/getApiBaseUrl";
import { useQuery } from "../../hooks/useQuery";
import { useCache } from "../../hooks/useCache";
import { routes } from "../../main";
import { removeToken } from "../../helper/token";

export const SettingsDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { value: isAuthenticated } = useCache<boolean | undefined>(
    "all_is_auth",
  );

  const { isSuccess } = useQuery(`${getApiBaseUrl()}/health`);
  const { send: resetDB } = useMutation(`${getApiBaseUrl()}/setupDB`, "DELETE");
  const { send: logout } = useMutation(`${getApiBaseUrl()}/auth`, "DELETE");

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Einstellungen</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
      >
        <Button
          onClick={() => {
            void (async () => {
              await resetDB();
              location.reload();
            })();
          }}
          color="warning"
          variant="outlined"
          disabled={!isSuccess || !isAuthenticated}
        >
          Datenbank zurücksetzen
        </Button>
        <Button
          onClick={() => {
            void (async () => {
              await logout();
              removeToken();
              location.href = routes.login;
            })();
          }}
          variant="outlined"
          disabled={!isAuthenticated}
        >
          Ausloggen
        </Button>
      </DialogContent>
    </Dialog>
  );
};
