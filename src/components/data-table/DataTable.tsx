import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModesModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { CustomDataTableToolbar } from "./CustomDataTableToolbar";

const pageSizeOptions = [10, 20, 50];
const paginationModel = { page: 0, pageSize: pageSizeOptions[0] };

export const DataTable = ({
  className,
  columns,
  rows,
  rowModesModel,
  setRowModesModel,
  onExport,
  onImport,
  onCreate,
  onEdit,
}: {
  className?: string;
  columns: GridColDef[];
  rows: GridValidRowModel[];
  rowModesModel: GridRowModesModel;
  setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
  onExport: (format: "JSON" | "XML" | "CSV") => void;
  onImport: () => Promise<void>;
  onCreate: () => void;
  onEdit: (
    newRow: GridValidRowModel,
    oldRow: GridValidRowModel,
  ) => GridValidRowModel;
}) => {
  const onRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  return (
    <Paper className={className}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={pageSizeOptions}
        disableRowSelectionOnClick
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(m) => setRowModesModel(m)}
        onRowEditStop={onRowEditStop}
        processRowUpdate={onEdit}
        slots={{
          toolbar: () => (
            <CustomDataTableToolbar
              onCreate={onCreate}
              onExport={onExport}
              onImport={onImport}
            />
          ),
        }}
        sx={{
          border: 0,
        }}
      />
    </Paper>
  );
};
