import { useState, useEffect, useCallback } from "react";
import { getApiBaseUrl } from "../../helper/getApiBaseUrl";
import { useCache } from "../../hooks/useCache";
import { useMutation } from "../../hooks/useMutation";
import { useQuery } from "../../hooks/useQuery";
import {
  Customers,
  Customer,
  SingleCustomer,
} from "../../interfaces/Customers";

export const useCreateReadingDialog = (open: boolean) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const { setValue: setCache } = useCache<Customers | undefined>(
    "createreading_customers"
  );

  const { data: apiData, refetch } = useQuery<Customers>(
    `${getApiBaseUrl()}/customers`,
    true
  );
  const { send: createCustomer } = useMutation<Customer>(
    `${getApiBaseUrl()}/customers`,
    "POST"
  );

  useEffect(() => {
    if (open) void refetch();
    return () => {
      setSelectedCustomer("");
    };
  }, [open, refetch]);

  useEffect(() => {
    setCache(apiData);
  }, [apiData, setCache]);

  const onCreateCustomer = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const customer = Object.fromEntries(
        formData.entries()
      ) as unknown as Customer;

      const [day, month, year] = customer.birthDate?.split(".") ?? [];
      customer.birthDate = `${year}-${month}-${day}`;

      const res = await createCustomer(customer);
      const cc = (await res.json()) as SingleCustomer;

      await refetch();
      setShowCreateDialog(false);
      setSelectedCustomer(cc.customer.id);
    },
    [createCustomer, refetch]
  );

  return {
    onCreateCustomer,
    selectedCustomer,
    setSelectedCustomer,
    showCreateDialog,
    setShowCreateDialog,
    apiData,
  };
};
