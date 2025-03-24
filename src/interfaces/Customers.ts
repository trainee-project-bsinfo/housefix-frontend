import { Gender } from "./Gender";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  gender: Gender;
}

export interface SingleCustomer {
  customer: Customer;
}

export interface Customers {
  customers: Customer[];
}
