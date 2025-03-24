import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DateField } from "@mui/x-date-pickers";
import { GenderSelect } from "../fields/GenderSelect";

export const CreateCustomerDialog = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit,
        },
      }}
      fullWidth
    >
      <DialogTitle>Kunden erstellen</DialogTitle>
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
        <TextField
          label="Vorname"
          name="firstName"
          required
          variant="filled"
          margin="dense"
          fullWidth
        />
        <TextField
          label="Nachname"
          name="lastName"
          required
          variant="filled"
          margin="dense"
          fullWidth
        />
        <GenderSelect margin="dense" required defaultValue="" withPlaceholder />
        <DateField
          label="Geburtsdatum"
          name="birthDate"
          required
          variant="filled"
          margin="dense"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="warning">
          Abbrechen
        </Button>
        <Button type="submit">Erstellen</Button>
      </DialogActions>
    </Dialog>
  );
};
