import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Page = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
