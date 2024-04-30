import React, { Fragment } from "react";
import HeaderAdmin from "../components/Admin/HeaderAdmin";
import MenuAdmin from "../components/Admin/MenuAdmin";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  const user = useSelector((state) => state.auth.login.currentUser);
  if (user.admin != 1) {
    return (
      <div className="product text-center">
        <h2>Nu poti accesa aceasta pagina!</h2>
        <p>
          Mergi <Link to="/">Acasa</Link>
        </p>
      </div>
    );
  } else {
    return (
      <Fragment>
        <div
          id="main-wrapper"
          data-theme="light"
          data-layout="vertical"
          data-navbarbg="skin6"
          data-sidebartype="full"
          data-sidebar-position="fixed"
          data-header-position="fixed"
          data-boxed-layout="full"
        >
          <HeaderAdmin />
          <MenuAdmin />
          <div>{children}</div>
        </div>
      </Fragment>
    );
  }
}
