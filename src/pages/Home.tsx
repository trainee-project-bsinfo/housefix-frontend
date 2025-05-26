import { Snackbar, Alert } from "@mui/material";
import {
  GridRowModesModel,
  GridRowId,
  GridValidRowModel,
  GridRowModes,
  GridColDef,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { DateField } from "@mui/x-date-pickers";
import { useRef, useState, useCallback, useMemo } from "react";
import { DataTable } from "../components/data-table/DataTable";
import { getApiBaseUrl } from "../helper/getApiBaseUrl";
import { getLocalDateFormat } from "../helper/getLocalDateFormat";
import { translateGender } from "../helper/translate/translateGender";
import { useMutation } from "../hooks/useMutation";
import { useQuery } from "../hooks/useQuery";
import { Customer, Customers } from "../interfaces/Customers";
import { Gender } from "../interfaces/Gender";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { GenderSelect } from "../components/fields/GenderSelect";
import { exportCustomers } from "../helper/import-export/exportCustomers";
import { CreateCustomerDialog } from "../components/dialogs/CreateCustomerDialog";
import { parseImportCustomers } from "../helper/import-export/parseImportCustomers";
import { SlotMachine } from "../components/slot/SlotMachine";

export const Home = () => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const { data, refetch, errorStatus } = useQuery<Customers>(
    `${getApiBaseUrl()}/customers`,
  );
  const { send: createCustomer } = useMutation<Customer>(
    `${getApiBaseUrl()}/customers`,
    "POST",
  );
  const { send: deleteCustomer } = useMutation(
    `${getApiBaseUrl()}/customers/{customerId}`,
    "DELETE",
  );
  const { send: updateCustomer } = useMutation(
    `${getApiBaseUrl()}/customers`,
    "PUT",
  );

  const onCreateCustomer = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const customer = Object.fromEntries(
        formData.entries(),
      ) as unknown as Customer;

      customer.birthDate = getLocalDateFormat(customer.birthDate!);

      await createCustomer(customer);
      await refetch();
      setShowCreateDialog(false);
    },
    [createCustomer, refetch],
  );

  const onDelete = useCallback(
    async (id: GridRowId) => {
      await deleteCustomer(undefined, { customerId: id });
      await refetch();
    },
    [deleteCustomer, refetch],
  );

  const onEdit = useCallback(
    async (newRow: GridValidRowModel, oldRow: GridValidRowModel) => {
      if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(newRow.birthDate as string)) {
        return oldRow;
      }

      await updateCustomer(newRow as Customer);
      return newRow;
    },
    [updateCustomer],
  );

  const onEditClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel],
  );
  const onSaveClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel],
  );
  const onCancelClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    },
    [rowModesModel],
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "actions",
        type: "actions",
        resizable: false,
        hideable: false,
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key={id}
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={onCancelClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                key={id}
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={onSaveClick(id)}
              />,
            ];
          }

          return [
            <GridActionsCellItem
              key={id}
              icon={<DeleteForeverIcon />}
              label="Delete"
              onClick={() => void onDelete(id)}
              color="warning"
            />,
            <GridActionsCellItem
              key={id}
              icon={<EditIcon />}
              label="Edit"
              onClick={onEditClick(id)}
              color="inherit"
            />,
          ];
        },
      },
      {
        field: "id",
        headerName: "ID",
        minWidth: 300,
        renderCell: (params) => (
          <a href={`${window.location.origin}/c/${params.value}`}>
            {params.value}
          </a>
        ),
      },
      {
        field: "firstName",
        headerName: "Vorname",
        minWidth: 300,
        editable: true,
      },
      {
        field: "lastName",
        headerName: "Nachname",
        minWidth: 300,
        editable: true,
      },
      {
        field: "birthDate",
        headerName: "Geburtsdatum",
        editable: true,
        renderCell: (params) =>
          new Date(params.value as string).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
        renderEditCell: (params) => (
          <DateField
            variant="filled"
            fullWidth
            defaultValue={new Date(params.value as string)}
            onChange={(newDate) =>
              void params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: getLocalDateFormat(newDate ?? (params.value as string)),
              })
            }
          />
        ),
      },
      {
        field: "gender",
        headerName: "Geschlecht",
        editable: true,
        renderCell: (params) => translateGender(params.value as Gender),
        renderEditCell: (params) => (
          <GenderSelect
            noLabel
            defaultValue={params.value as string}
            onChange={(event) =>
              void params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: event.target.value,
              })
            }
          />
        ),
      },
    ],
    [onDelete, onSaveClick, onCancelClick, rowModesModel, onEditClick],
  );

  const onExport = useCallback(
    (format: "JSON" | "XML" | "CSV") => exportCustomers(format, data),
    [data],
  );

  const onImport = useCallback(async () => {
    fileInput.current?.click();
    while (!fileInput.current?.files || fileInput.current.files.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const file = fileInput.current?.files?.[0];
    const format = file?.type.split("/")[1].toUpperCase() as
      | "JSON"
      | "XML"
      | "CSV";
    const data = (await file?.text()) ?? "";

    const customers = parseImportCustomers(data, format);
    if (customers.length === 0) {
      setShowSnackbar(true);
      return;
    }
    for (const customer of customers) {
      await createCustomer(customer);
    }
    fileInput.current.value = "";
    await refetch();
  }, [fileInput, createCustomer, refetch]);

  if (errorStatus) {
    return <SlotMachine />;
  }
  return (
    <>
      <h1 className="page-title">Alle Kunden:</h1>
      <DataTable
        className="data-table"
        columns={columns}
        rows={data?.customers ?? []}
        rowModesModel={rowModesModel}
        setRowModesModel={setRowModesModel}
        onExport={onExport}
        onImport={onImport}
        onCreate={() => setShowCreateDialog(true)}
        onEdit={onEdit}
      />

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackbar}
        autoHideDuration={5_000}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="error"
          variant="filled"
        >
          Die Datei ist nicht im geforderten Format oder beinhaltet keine Daten.
        </Alert>
      </Snackbar>

      <CreateCustomerDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={(e) => void onCreateCustomer(e)}
      />

      <input
        type="file"
        accept="application/json,application/xml,text/csv"
        ref={fileInput}
        style={{ display: "none" }}
      />
    </>
  );
};
