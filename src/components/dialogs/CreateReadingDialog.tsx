import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { DateField } from "@mui/x-date-pickers";
import AddIcon from "@mui/icons-material/Add";
import { CreateCustomerDialog } from "./CreateCustomerDialog";
import { useCreateReadingDialog } from "./CreateReadingDialog.hook";
import { KindOfMeterSelect } from "../fields/KindOfMeterSelect";
import { MeterCountField } from "../fields/MeterCountField";

export const CreateReadingDialog = ({
  open,
  onClose,
  onSubmit,
  withCustomerSelection,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  withCustomerSelection?: boolean;
}) => {
  const {
    onCreateCustomer,
    selectedCustomer,
    setSelectedCustomer,
    showCreateDialog,
    setShowCreateDialog,
    apiData,
  } = useCreateReadingDialog(open);

  return (
    <>
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
        <DialogTitle>Auslesung eintragen</DialogTitle>
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
          <DateField
            label="Auslesungsdatum"
            name="dateOfReading"
            required
            variant="filled"
            margin="dense"
            fullWidth
          />
          <KindOfMeterSelect
            margin="dense"
            required
            defaultValue=""
            withPlaceholder
          />
          <TextField
            label="Zähler-ID"
            name="meterId"
            required
            variant="filled"
            margin="dense"
            fullWidth
          />
          <MeterCountField margin="dense" required />
          <FormControlLabel
            label="Zähler ersetzt:"
            labelPlacement="start"
            sx={{ margin: "8px 0 4px 0", userSelect: "none" }}
            control={<Checkbox name="substitute" />}
          />
          {withCustomerSelection && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "8px 0 4px 0",
              }}
            >
              <TextField
                select
                label="Kunde"
                name="customerId"
                required
                defaultValue=""
                variant="filled"
                margin="dense"
                fullWidth
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                sx={{ margin: 0 }}
              >
                <MenuItem value="" disabled>
                  Bitte wählen...
                </MenuItem>
                {apiData?.customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </MenuItem>
                ))}
              </TextField>
              <IconButton
                onClick={() => setShowCreateDialog(true)}
                sx={{
                  borderRadius: 0,
                  height: "56px",
                  borderBottom: "solid 1px",
                  borderLeft: "solid 1px",
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
          )}
          <TextField
            multiline
            minRows={3}
            maxRows={7}
            defaultValue=""
            label="Kommentar"
            name="comment"
            variant="filled"
            margin="dense"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="warning">
            Abbrechen
          </Button>
          <Button type="submit">Eintragen</Button>
        </DialogActions>
      </Dialog>

      <CreateCustomerDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={(e) => void onCreateCustomer(e)}
      />
    </>
  );
};
