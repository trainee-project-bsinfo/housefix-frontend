import { Customers } from "../../interfaces/Customers";

const getKeys = (obj: object, prefix = ""): string[] => {
  return Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? getKeys(value as object, `${prefix}${key}.`)
      : `${prefix}${key}`,
  );
};

export const exportCustomers = (
  format: "JSON" | "CSV" | "XML",
  data?: Customers,
) => {
  const fileName = "Kunden";

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
        getKeys(data?.customers[0] ?? {}).join(",") +
        "\n" +
        data?.customers
          .map((c) =>
            Object.values(c)
              .map((value) =>
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                typeof value === "string" ? `"${value}"` : value,
              )
              .join(","),
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
        `<?xml version="1.0" encoding="UTF-8"?>\n<customers>` +
        data?.customers
          .map((c) => {
            const keys = Object.keys(c) as (keyof typeof c)[];
            let str = "\n\t<customer>\n";
            keys.forEach((k) => {
              str += `\t\t<${k}>${c[k]}</${k}>\n`;
            });
            return str;
          })
          .join("\t</customer>") +
        `\t</customer>\n</customers>`;
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
