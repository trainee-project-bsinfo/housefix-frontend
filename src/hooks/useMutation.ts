import { useCallback, useState } from "react";
import { getToken } from "../helper/token";

export const useMutation = <BT>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
): {
  errorStatus?: number;
  send: (body?: BT, vars?: object) => Promise<Response>;
} => {
  const [errorStatus, setErrorStatus] = useState<number>();

  const send = useCallback(
    async (body?: BT, vars?: object) => {
      let filledUrl = url;
      if (vars && /\{\w+\}/gi.test(url)) {
        for (const [key, value] of Object.entries(vars)) {
          filledUrl = filledUrl.replaceAll(`{${key}}`, String(value));
        }
      }

      const token = getToken();

      let response: Response | undefined;
      try {
        response = await fetch(filledUrl, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: body ? JSON.stringify(body) : undefined,
        });
      } catch {
        /*empty*/
      }
      if (!response?.ok) {
        const serverNotAvailableCode = 666;
        setErrorStatus(response?.status ?? serverNotAvailableCode);
        return (
          response ?? new Response(null, { status: serverNotAvailableCode })
        );
      }
      setErrorStatus(undefined);
      return response;
    },
    [url, method],
  );

  return { errorStatus, send };
};
