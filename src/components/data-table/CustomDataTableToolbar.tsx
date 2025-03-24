import {
  Button,
  Tooltip,
  Typography,
  Divider,
  MenuItem,
  IconButton,
} from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export const CustomDataTableToolbar = ({
  onExport,
  onImport,
  onCreate,
}: {
  onExport: (format: "JSON" | "XML" | "CSV") => void;
  onImport: () => Promise<void>;
  onCreate: () => void;
}) => (
  <GridToolbarContainer
    sx={{
      justifyContent: "space-between",
      padding: "5px",
    }}
  >
    <Button variant="outlined" onClick={onCreate}>
      Eintragen
    </Button>

    <div>
      <Tooltip
        title={
          <>
            <Typography variant="body1" sx={{ userSelect: "none" }}>
              Exportieren
            </Typography>
            <Divider />
            <MenuItem onClick={() => onExport("JSON")}>JSON</MenuItem>
            <MenuItem onClick={() => onExport("CSV")}>CSV</MenuItem>
            <MenuItem onClick={() => onExport("XML")}>XML</MenuItem>
          </>
        }
      >
        <IconButton color="info">
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>

      <IconButton color="info" onClick={() => void onImport()}>
        <FileUploadIcon />
      </IconButton>
    </div>
  </GridToolbarContainer>
);
