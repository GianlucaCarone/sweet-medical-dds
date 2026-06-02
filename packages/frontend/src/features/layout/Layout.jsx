import { Outlet } from "react-router-dom";
import Header from "../../components/headers/Header.jsx";

const Layout = () => {
  return (
    <>
      <Header userName="Andino Franco" />
      <Outlet />
    </>
  );
};

export default Layout;
