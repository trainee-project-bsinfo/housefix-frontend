import { matchPath, Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useEffect } from "react";
import { getApiBaseUrl } from "../helper/getApiBaseUrl";
import { useQuery } from "../hooks/useQuery";
import { routes } from "../main";
import { useCache } from "../hooks/useCache";

export const Page = () => {
  const { isSuccess: isAuthenticated, errorStatus } = useQuery(
    `${getApiBaseUrl()}/auth`,
  );
  const { setValue: setIsAuthenticated } = useCache<boolean | undefined>(
    "all_is_auth",
  );

  useEffect(() => {
    setIsAuthenticated(isAuthenticated);
    const validRoutes = Object.values(routes).filter(
      (route) => ![routes.login, routes.unknown].includes(route),
    );
    const isValidRoute = validRoutes.some((route) =>
      matchPath(route, location.pathname),
    );

    if (
      [routes.allReadings, routes.home].some((r) =>
        matchPath(r, location.pathname),
      ) &&
      errorStatus === 666
    ) {
      return;
    }

    if (isAuthenticated === false && isValidRoute) {
      location.href = routes.login;
    }
  }, [isAuthenticated, setIsAuthenticated, errorStatus]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
