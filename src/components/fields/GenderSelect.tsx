import { MenuItem, TextField } from "@mui/material";
import { ChangeEventHandler, useState } from "react";
import { Gender } from "../../interfaces/Gender";
import { translateGender } from "../../helper/translate/translateGender";

interface Props {
  margin?: "dense" | "normal" | "none";
  required?: boolean;
  defaultValue?: string;
  withPlaceholder?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  noLabel?: boolean;
}

export const GenderSelect = ({
  margin,
  required,
  defaultValue,
  withPlaceholder,
  onChange,
  noLabel,
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
      label={noLabel ? undefined : "Geschlecht"}
      name="gender"
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
      {Object.values(Gender).map((gender) => (
        <MenuItem key={gender} value={gender}>
          {translateGender(gender)}
        </MenuItem>
      ))}
    </TextField>
  );
};
