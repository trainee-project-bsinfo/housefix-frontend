import { DateField } from "@mui/x-date-pickers";
import { getLocalDateFormat } from "../helper/getLocalDateFormat";
import "./FilterFields.css";
import { KindOfMeterSelect } from "./fields/KindOfMeterSelect";
import { KindOfMeter } from "../interfaces/KindOfMeter";

export const FilterFields = ({
  setStartDate,
  setEndDate,
  setKindOfMeter,
}: {
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setKindOfMeter: React.Dispatch<React.SetStateAction<KindOfMeter | undefined>>;
}) => {
  return (
    <div className="container">
      <div>
        <DateField
          label="Start-Datum"
          className="field"
          variant="filled"
          onChange={(d) => {
            if (d === null) {
              setStartDate(undefined);
            } else if (
              !isNaN(d.getTime()) &&
              getLocalDateFormat(d).length === 10
            ) {
              setStartDate(d);
            }
          }}
        />
        <DateField
          label="End-Datum"
          className="field"
          variant="filled"
          onChange={(d) => {
            if (d === null) {
              setEndDate(undefined);
            } else if (
              !isNaN(d.getTime()) &&
              getLocalDateFormat(d).length === 10
            ) {
              setEndDate(d);
            }
          }}
        />
      </div>
      <KindOfMeterSelect
        className="field"
        defaultValue=""
        withAll
        fullWidth={false}
        onChange={(e) =>
          setKindOfMeter((e.target.value as KindOfMeter) || undefined)
        }
      />
    </div>
  );
};
