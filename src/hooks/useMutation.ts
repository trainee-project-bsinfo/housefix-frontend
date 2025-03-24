import { useCallback, useState } from "react";

export const useMutation = <BT>(
  url: string,
  method: "POST" | "PUT" | "DELETE"
): { errorStatus?: number; send: (body?: BT, vars?: object) => Promise<Response> } => {
  const [errorStatus, setErrorStatus] = useState<number>();

  const send = useCallback(
    async (body?: BT, vars?: object): Promise<Response> => {
      let filledUrl = url;
      if (vars && /\{\w+\}/gi.test(url)) {
        for (const [key, value] of Object.entries(vars)) {
          filledUrl = filledUrl.replaceAll(`{${key}}`, String(value));
        }
      }

      const response = await fetch(filledUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        setErrorStatus(response.status);
        return response;
      }
      setErrorStatus(undefined);
      return response;
    },
    [url, method]
  );

  return { errorStatus, send };
};
