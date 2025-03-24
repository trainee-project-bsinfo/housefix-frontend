import { Customer } from "./Customers";
import { KindOfMeter } from "./KindOfMeter";

export interface Reading {
  id: string;
  customer: Customer | null;
  dateOfReading: string;
  comment?: string | null;
  meterId: string;
  substitute: boolean;
  meterCount: number;
  kindOfMeter: KindOfMeter;
}

export interface SingleReading {
  reading: Reading;
}

export interface Readings {
  readings: Reading[];
}
