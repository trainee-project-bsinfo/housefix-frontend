import "./page.css";
import { useCallback, useMemo, useRef, useState } from "react";
import { DataTable } from "../components/data-table/DataTable";
import { getApiBaseUrl } from "../helper/getApiBaseUrl";
import { useQuery } from "../hooks/useQuery";
import { Reading, Readings } from "../interfaces/Readings";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { Alert, Checkbox, Snackbar } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

import { exportReadings } from "../helper/import-export/exportReadings";
import { parseImportReadings } from "../helper/import-export/parseImportReadings";
import { useMutation } from "../hooks/useMutation";
import { CreateReadingDialog } from "../components/dialogs/CreateReadingDialog";
import { SingleCustomer } from "../interfaces/Customers";
import { flattenObject } from "../helper/flatten-object/flattenObject";
import { unflattenObject } from "../helper/flatten-object/unflattenObject";
import { KindOfMeterSelect } from "../components/fields/KindOfMeterSelect";
import { translateKindOfMeter } from "../helper/translate/translateKindOfMeter";
import { KindOfMeter } from "../interfaces/KindOfMeter";
import { MeterCountField } from "../components/fields/MeterCountField";
import { DateField } from "@mui/x-date-pickers";
import { getLocalDateFormat } from "../helper/getLocalDateFormat";
import { useParams } from "react-router-dom";
import { FilterFields } from "../components/FilterFields";

export const CustomerReadings = () => {
  const { customerId } = useParams();
  const fileInput = useRef<HTMLInputElement>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [kindOfMeterFilter, setKindOfMeterFilter] = useState<KindOfMeter>();

  const { data: singleCustomer } = useQuery<SingleCustomer>(
    `${getApiBaseUrl()}/customers/${customerId}`,
  );

  const { data, refetch } = useQuery<Readings>(
    `${getApiBaseUrl()}/readings?customer=${customerId}&${
      kindOfMeterFilter ? `kindOfMeter=${kindOfMeterFilter}&` : ""
    }${startDate ? `start=${getLocalDateFormat(startDate)}&` : ""}${
      endDate ? `end=${getLocalDateFormat(endDate)}` : ""
    }`,
  );
  const { send: createReading } = useMutation<Reading>(
    `${getApiBaseUrl()}/readings`,
    "POST",
  );
  const { send: deleteReading } = useMutation(
    `${getApiBaseUrl()}/readings/{readingId}`,
    "DELETE",
  );
  const { send: updateReading } = useMutation(
    `${getApiBaseUrl()}/readings`,
    "PUT",
  );

  const onCreateReading = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const formReading = Object.fromEntries(
        formData.entries(),
      ) as unknown as Omit<Reading, "customer">;

      const reading: Reading = {
        ...formReading,
        customer: singleCustomer?.customer ?? null,
      };
      reading.substitute = Boolean(reading.substitute);
      reading.dateOfReading = getLocalDateFormat(reading.dateOfReading);

      await createReading(reading);
      await refetch();
      setShowCreateDialog(false);
    },
    [singleCustomer, createReading, refetch],
  );

  const onDelete = useCallback(
    async (id: GridRowId) => {
      await deleteReading(undefined, { readingId: id });
      await refetch();
    },
    [deleteReading, refetch],
  );

  const onEdit = useCallback(
    async (newRow: GridValidRowModel, oldRow: GridValidRowModel) => {
      const newReading = unflattenObject<Reading>(newRow);
      newReading.customer = singleCustomer?.customer ?? null;
      if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(newReading.dateOfReading)) {
        return oldRow;
      }

      await updateReading(newReading);
      return newRow;
    },
    [updateReading, singleCustomer],
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
      },
      {
        field: "kindOfMeter",
        headerName: "Zählerart",
        editable: true,
        renderCell: (params) =>
          translateKindOfMeter(params.value as KindOfMeter),
        renderEditCell: (params) => (
          <KindOfMeterSelect
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
      {
        field: "dateOfReading",
        headerName: "Auslesungsdatum",
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
        field: "meterId",
        headerName: "Zähler-ID",
        editable: true,
      },
      {
        field: "substitute",
        headerName: "Zähler ersetzt",
        editable: true,
        renderCell: (params) => (
          <Checkbox
            name="substitute"
            checked={Boolean(params.value)}
            disabled
          />
        ),
        renderEditCell: (params) => (
          <Checkbox
            name="substitute"
            checked={Boolean(params.value)}
            onChange={(event) =>
              void params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: event.target.checked,
              })
            }
          />
        ),
      },
      {
        field: "meterCount",
        headerName: "Auslesungswert",
        editable: true,
        renderEditCell: (params) => (
          <MeterCountField
            noLabel
            defaultValue={params.value as number}
            onChange={(event) =>
              void params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: Number(event.target.value),
              })
            }
          />
        ),
      },
      {
        field: "comment",
        headerName: "Kommentar",
        minWidth: 300,
        editable: true,
      },
    ],
    [onDelete, onSaveClick, onCancelClick, rowModesModel, onEditClick],
  );

  const rows = useMemo<GridValidRowModel[]>(
    () => data?.readings.map((r) => flattenObject(r)) ?? [],
    [data],
  );

  const onExport = useCallback(
    (format: "JSON" | "XML" | "CSV") => exportReadings(format, data),
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

    const readings = parseImportReadings(data, format);
    if (readings.length === 0) {
      setShowSnackbar(true);
      return;
    }
    for (const reading of readings) {
      if (reading.customer?.id !== singleCustomer?.customer.id) {
        continue;
      }
      await createReading(reading);
    }
    fileInput.current.value = "";
    await refetch();
  }, [fileInput, createReading, refetch, singleCustomer]);

  if (!singleCustomer?.customer) {
    return (
      <h2
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "50px auto",
        }}
      >
        Der Kunde existiert nicht!
      </h2>
    );
  }
  return (
    <>
      <h1 className="page-title">
        {singleCustomer.customer.lastName}, {singleCustomer.customer.firstName}{" "}
        Auslesungen:
      </h1>
      <FilterFields
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        setKindOfMeter={setKindOfMeterFilter}
      />
      <DataTable
        className="data-table"
        columns={columns}
        rows={rows}
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

      <CreateReadingDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={(e) => void onCreateReading(e)}
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
