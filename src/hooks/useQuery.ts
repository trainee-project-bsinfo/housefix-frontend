import { useCallback, useEffect, useState } from "react";

export const useQuery = <RT>(
  url: string,
  skipFirstFetch?: boolean
): {
  data?: RT;
  isSuccess?: boolean;
  errorStatus?: number;
  refetch: () => Promise<void>;
} => {
  const [data, setData] = useState<RT>();
  const [isSuccess, setIsSuccess] = useState<boolean>();
  const [errorStatus, setErrorStatus] = useState<number>();

  const refetch = useCallback(async () => {
    let response: Response | undefined;
    try {
      response = await fetch(url);
    } catch {
      /* empty */
    }
    if (!response?.ok) {
      setErrorStatus(response?.status ?? 502);
      setData(undefined);
      setIsSuccess(false);
      return;
    }
    try {
      const data = (await response.json()) as RT;
      setData(data);
    } catch {
      /* empty */
    }
    setIsSuccess(true);
    setErrorStatus(undefined);
  }, [url]);

  useEffect(() => {
    if (!skipFirstFetch) void refetch();
  }, [skipFirstFetch, refetch]);

  return { data, isSuccess, errorStatus, refetch };
};
