import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { logoutUser } from "../../services/API/authApi";
import { createAxios } from "../../services/API/createInstanceApi";

export default function HeaderAdmin() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const handleLogout = () => {
    logoutUser(dispatch, user.id, user.token, navigate, axiosJWT);
  };
  {
    return (
      <div className="topbar" data-navbarbg="skin6">
        <nav className="navbar top-navbar navbar-expand-md">
          <div className="navbar-header" data-logobg="skin6">
            <a
              className="nav-toggler waves-effect waves-light d-block d-md-none"
              href="#"
            >
              <i className="ti-menu ti-close"></i>
            </a>
            <div className="navbar-brand">
              <NavLink to="/admin">
                <b className="logo-icon">
                  <img
                    src="./image/logo-icon.png"
                    alt="homepage"
                    className="dark-logo"
                  />
                  <img
                    src="./image/logo-icon.png"
                    alt="homepage"
                    className="light-logo"
                  />
                </b>
                <span className="logo-text">
                  <img
                    src="./image/logo-no-background.png"
                    alt="homepage"
                    className="dark-logo"
                    width={150}
                    height={30}
                  />
                  <img
                    src="./image/logo-no-background.png"
                    className="light-logo"
                    alt="homepage"
                  />
                </span>
              </NavLink>
            </div>
            <a
              className="topbartoggler d-block d-md-none waves-effect waves-light"
              href="#"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="ti-more"></i>
            </a>
          </div>
          <div className="navbar-collapse collapse" id="navbarSupportedContent">
            <ul className="navbar-nav float-left mr-auto ml-3 pl-1">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i data-feather="settings" className="svg-icon"></i>
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#">
                    Actiune
                  </a>
                  <a className="dropdown-item" href="#">
                    Actiune
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">
                    Actiune
                  </a>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav float-right">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    src="./image/avatar.jpg"
                    alt="user"
                    className="rounded-circle"
                    width="40"
                  />
                  <span className="ml-2 d-none d-lg-inline-block">
                    <span>Salut,</span>{" "}
                    <span className="text-dark">{user.fullname}</span>{" "}
                    <i data-feather="chevron-down" className="svg-icon"></i>
                  </span>
                </a>
                <div className="dropdown-menu dropdown-menu-right user-dd animated flipInY">
                  <a className="dropdown-item" href="/">
                    <NavLink to="/">Inapoi la magazin</NavLink>
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
