import { Customer } from "../../interfaces/Customers";
import { Readings } from "../../interfaces/Readings";
import { flattenObject } from "../flatten-object/flattenObject";

const getKeys = (obj: object, prefix = ""): string[] => {
  return Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? getKeys(value as object, `${prefix}${key}.`)
      : `${prefix}${key}`
  );
};

export const exportReadings = (
  format: "JSON" | "CSV" | "XML",
  data?: Readings
) => {
  const fileName = "Auslesungen";

  switch (format) {
    case "JSON": {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      break;
    }

    case "CSV": {
      const csv =
        getKeys(flattenObject(data?.readings[0] ?? {})).join(",") +
        "\n" +
        data?.readings
          .map((r) =>
            Object.values(flattenObject(r))
              .map((value) =>
                typeof value === "string" ? `"${value}"` : value
              )
              .join(",")
          )
          .join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      break;
    }

    case "XML": {
      const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n<readings>` +
        data?.readings
          .map((r) => {
            const keys = Object.keys(r) as (keyof typeof r)[];
            let str = "\n\t<reading>\n";
            keys.forEach((k) => {
              if (typeof r[k] === "object") {
                str += `\t\t<${k}>\n`;
                const cKeys = Object.keys(r[k] ?? {}) as (keyof Customer)[];

                cKeys.forEach((cK) => {
                  str += `\t\t\t<${cK}>${(r[k] as Customer)[cK]}</${cK}>\n`;
                });
                str += `\t\t</${k}>\n`;

                return str;
              }
              str += `\t\t<${k}>${r[k]}</${k}>\n`;
            });
            return str;
          })
          .join("\t</reading>") +
        `\t</reading>\n</readings>`;
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.xml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      break;
    }
  }
};
