import { useCallback, useEffect, useState } from "react";

export const useQuery = <RT>(
  url: string,
  skipFirstFetch?: boolean
): { data?: RT; errorStatus?: number; refetch: () => Promise<void> } => {
  const [data, setData] = useState<RT>();
  const [errorStatus, setErrorStatus] = useState<number>();

  const refetch = useCallback(async () => {
    const response = await fetch(url);
    if (!response.ok) {
      setErrorStatus(response.status);
      setData(undefined);
      return;
    }
    const data = (await response.json()) as RT;
    setData(data);
    setErrorStatus(undefined);
  }, [url]);

  useEffect(() => {
    if (!skipFirstFetch) void refetch();
  }, [skipFirstFetch, refetch]);

  return { data, errorStatus, refetch };
};
