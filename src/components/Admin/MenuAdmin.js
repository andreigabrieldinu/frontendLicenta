import React from "react";
import { useSelector } from "react-redux";

export default function MenuAdmin() {
  {
    return (
      <aside className="left-sidebar" data-sidebarbg="skin6">
        <div className="scroll-sidebar" data-sidebarbg="skin6">
          <nav className="sidebar-nav">
            <ul id="sidebarnav">
              <li className="sidebar-item">
                {" "}
                <a className="sidebar-link sidebar-link" href="/admin">
                  <i data-feather="home" className="feather-icon"></i>
                  <span className="hide-menu">Dashboard</span>
                </a>
              </li>
              <li className="list-divider"></li>

              <li className="nav-small-cap">
                <span className="hide-menu">Componente</span>
              </li>
              <li className="sidebar-item">
                {" "}
                <a className="sidebar-link sidebar-link" href="/chat">
                  <i data-feather="message-square" className="feather-icon"></i>
                  <span className="hide-menu">Chat Clienti</span>
                </a>
              </li>

              <li className="sidebar-item">
                {" "}
                <a
                  className="sidebar-link has-arrow"
                  href="#"
                  aria-expanded="false"
                >
                  <i data-feather="grid" className="feather-icon"></i>
                  <span className="hide-menu">Tabele</span>
                </a>
                <ul
                  aria-expanded="false"
                  className="collapse  first-level base-level-line"
                >
                  <li className="sidebar-item">
                    <a href="/users" className="sidebar-link">
                      <span className="hide-menu">Useri</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/history" className="sidebar-link">
                      <span className="hide-menu">Istoric</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/vouchers" className="sidebar-link">
                      <span className="hide-menu">Vouchere</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/products" className="sidebar-link">
                      <span className="hide-menu">Produse</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/botteledWines" className="sidebar-link">
                      <span className="hide-menu">Imbuteliere vinuri</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/winesBlending" className="sidebar-link">
                      <span className="hide-menu">Aditivare vinurii</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/suppliers" className="sidebar-link">
                      <span className="hide-menu">Furnizori</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/winesAnalysis" className="sidebar-link">
                      <span className="hide-menu">Analiza vinuri</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/wineGrapes" className="sidebar-link">
                      <span className="hide-menu">Strugurii pe vin</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/wines" className="sidebar-link">
                      <span className="hide-menu">Vinuri</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/containers" className="sidebar-link">
                      <span className="hide-menu">Recipiente</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/grapes" className="sidebar-link">
                      <span className="hide-menu">Struguri culesi</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/fields" className="sidebar-link">
                      <span className="hide-menu">Terenuri</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    );
  }
}
