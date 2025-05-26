import { Customer, Customers } from "../../interfaces/Customers";

export const parseImportCustomers = (
  data: string,
  format: "JSON" | "CSV" | "XML",
): Customer[] => {
  switch (format) {
    case "JSON": {
      const parsed = JSON.parse(data) as Customer[] | Customers;
      if (!Array.isArray(parsed)) {
        return parsed.customers;
      }
      return parsed;
    }

    case "CSV": {
      const customers: Customer[] = [];

      const lines = data.split("\n");
      const varNames = lines[0].split(",");

      lines.forEach((line, index) => {
        if (index === 0) return;
        const values = line
          .split(",")
          .map((str) => str.trim().replace(/"/g, ""));

        customers.push({
          id: values[varNames.findIndex((n) => n === "id")],
          firstName: values[varNames.findIndex((n) => n === "firstName")],
          lastName: values[varNames.findIndex((n) => n === "lastName")],
          gender: values[
            varNames.findIndex((n) => n === "gender")
          ] as Customer["gender"],
          birthDate: values[varNames.findIndex((n) => n === "birthDate")],
        } satisfies Customer);
      });

      return customers;
    }

    case "XML": {
      const customers: Customer[] = [];

      const parsed = new DOMParser().parseFromString(data, "application/xml");
      parsed.querySelectorAll("customers > customer").forEach((customer) => {
        customers.push({
          id: customer.querySelector("id")?.textContent ?? "",
          firstName: customer.querySelector("firstName")?.textContent ?? "",
          lastName: customer.querySelector("lastName")?.textContent ?? "",
          birthDate: customer.querySelector("birthDate")?.textContent ?? "",
          gender: customer.querySelector("gender")
            ?.textContent as Customer["gender"],
        } satisfies Customer);
      });

      return customers;
    }
  }
};
