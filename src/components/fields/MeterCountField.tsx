import { TextField } from "@mui/material";
import { ChangeEvent, useMemo, useState } from "react";

interface Props {
  margin?: "none" | "dense" | "normal";
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: number;
}

export const MeterCountField = ({
  margin,
  required,
  onChange,
  defaultValue,
}: Props) => {
  const forbiddenCharsInNumberField = useMemo(
    () => ["e", "+", "-", ".", ","],
    []
  );

  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = Math.abs(Number(e.target.value)).toString();
    setValue(Number(e.target.value));
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <TextField
      type="number"
      label="Zählerwert"
      name="meterCount"
      required={required}
      variant="filled"
      margin={margin}
      fullWidth
      onPaste={(e) => {
        forbiddenCharsInNumberField.forEach((c) => {
          if (e.clipboardData.getData("Text").includes(c)) e.preventDefault();
        });
      }}
      onKeyDown={(e) => {
        if (forbiddenCharsInNumberField.includes(e.key)) {
          e.preventDefault();
        }
      }}
      value={value}
      onChange={handleChange}
    />
  );
};
