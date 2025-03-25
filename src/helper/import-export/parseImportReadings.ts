import { Customer } from "../../interfaces/Customers";
import { Reading, Readings } from "../../interfaces/Readings";

export const parseImportReadings = (
  data: string,
  format: "JSON" | "CSV" | "XML"
): Reading[] => {
  switch (format) {
    case "JSON": {
      const parsed = JSON.parse(data) as Reading[] | Readings;
      if (!Array.isArray(parsed)) {
        return parsed.readings;
      }
      return parsed;
    }

    case "CSV": {
      const readings: Reading[] = [];

      const lines = data.split("\n");
      const varNames = lines[0].split(",");

      lines.forEach((line, index) => {
        if (index === 0) return;
        const values = line
          .split(",")
          .map((str) => str.trim().replace(/"/g, ""));

        readings.push({
          id: values[varNames.findIndex((n) => n === "id")],
          kindOfMeter: values[
            varNames.findIndex((n) => n === "kindOfMeter")
          ] as Reading["kindOfMeter"],
          dateOfReading:
            values[varNames.findIndex((n) => n === "dateOfReading")],
          customer: {
            id: values[varNames.findIndex((n) => n === "customer.id")],
            firstName:
              values[varNames.findIndex((n) => n === "customer.firstName")],
            lastName:
              values[varNames.findIndex((n) => n === "customer.lastName")],
            gender: values[
              varNames.findIndex((n) => n === "customer.gender")
            ] as Customer["gender"],
            birthDate:
              values[varNames.findIndex((n) => n === "customer.birthDate")],
          },
          comment: values[varNames.findIndex((n) => n === "comment")],
          meterCount: Number(
            values[varNames.findIndex((n) => n === "meterCount")]
          ),
          meterId: values[varNames.findIndex((n) => n === "meterId")],
          substitute: Boolean(
            values[varNames.findIndex((n) => n === "substitute")]
          ),
        } satisfies Reading);
      });

      return readings;
    }

    case "XML": {
      const readings: Reading[] = [];

      const parsed = new DOMParser().parseFromString(data, "application/xml");
      parsed.querySelectorAll("readings > reading").forEach((reading) => {
        readings.push({
          id: reading.querySelector("id")?.textContent ?? "",
          kindOfMeter: reading.querySelector("kindOfMeter")?.textContent as Reading["kindOfMeter"],
          dateOfReading: reading.querySelector("dateOfReading")?.textContent ?? "",
          customer: {
            id: reading.querySelector("customer > id")?.textContent ?? "",
            firstName: reading.querySelector("customer > firstName")?.textContent ?? "",
            lastName: reading.querySelector("customer > lastName")?.textContent ?? "",
            birthDate: reading.querySelector("customer > birthDate")?.textContent ?? "",
            gender: reading.querySelector("customer > gender")?.textContent as Customer["gender"],
          },
          comment: reading.querySelector("comment")?.textContent ?? "",
          meterCount: Number(reading.querySelector("meterCount")?.textContent ?? ""),
          meterId: reading.querySelector("meterId")?.textContent ?? "",
          substitute: Boolean(reading.querySelector("substitute")?.textContent ?? ""),
        } satisfies Reading);
      });
      
      return readings;
    }
  }
};
