import { MenuItem, TextField } from "@mui/material";
import { ChangeEventHandler, useState } from "react";
import { KindOfMeter } from "../../interfaces/KindOfMeter";
import { translateKindOfMeter } from "../../helper/translate/translateKindOfMeter";

interface Props {
  margin?: "dense" | "normal" | "none";
  required?: boolean;
  defaultValue?: string;
  withPlaceholder?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export const KindOfMeterSelect = ({
  margin,
  required,
  defaultValue,
  withPlaceholder,
  onChange,
}: Props) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <TextField
      select
      label="Zählerart"
      name="kindOfMeter"
      required={required}
      value={value}
      onChange={handleChange}
      variant="filled"
      margin={margin}
      fullWidth
    >
      {withPlaceholder && (
        <MenuItem value="" disabled>
          Bitte wählen...
        </MenuItem>
      )}
      {Object.values(KindOfMeter).map((kindOfMeter) => (
        <MenuItem key={kindOfMeter} value={kindOfMeter}>
          {translateKindOfMeter(kindOfMeter)}
        </MenuItem>
      ))}
    </TextField>
  );
};
