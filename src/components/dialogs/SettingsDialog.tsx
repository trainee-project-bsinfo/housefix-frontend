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

export const SettingsDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { isSuccess } = useQuery(`${getApiBaseUrl()}/health`);
  const { send: resetDB } = useMutation(`${getApiBaseUrl()}/setupDB`, "DELETE");

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
      <DialogContent>
        <Button
          onClick={() => {
            void (async () => {
              await resetDB();
              location.reload();
            })();
          }}
          color="warning"
          variant="outlined"
          disabled={!isSuccess}
        >
          Datenbank zurücksetzen
        </Button>
      </DialogContent>
    </Dialog>
  );
};
