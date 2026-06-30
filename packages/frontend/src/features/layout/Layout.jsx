import { Outlet } from "react-router-dom";
import Header from "../../components/headers/Header.jsx";
import Footer from "../../components/footers/Footer.jsx";
import "./Layout.css";

const Layout = () => {

  return (
    <>
      <div className="app-grid">
        <Header
          className="app-header"
          userName={null} //aún no tenemos autenticación, así que por ahora lo dejamos como null
        />
        <main className="app-main">
          <Outlet />
        </main>
        <Footer className="app-footer" />
      </div>
    </>
  );
};

export default Layout;
