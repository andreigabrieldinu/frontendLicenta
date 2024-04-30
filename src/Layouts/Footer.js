import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container py-4">
        <div className="row py-5">
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="text-uppercase mb-3">Servicii clienti</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <a className="footer-link" href="#">
                  Ajutor &amp; Contacteaza-ne
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Anulare &amp; returnare
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Online Stores
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Termeni &amp; conditii
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="text-uppercase mb-3">Companie</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <a className="footer-link" href="#">
                  Ce facem?{" "}
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Serviciile disponibile
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Ultimele actualizari
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Intrebari frecvente
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-uppercase mb-3">Social media</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <a className="footer-link" href="#">
                  Twitter
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Instagram
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Facebook
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Tik-Tok
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="border-top pt-4"
          style={{ borderColor: "#1d1d1d !important" }}
        >
          <div className="row">
            <div className="col-lg-6">
              <p className="small text-muted mb-0">
                &copy; 2023 Toate drepturile rezervate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
