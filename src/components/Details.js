import React, { Fragment } from "react";

export default function Details() {
  return (
    <Fragment>
      <div className="py-5">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row text-center">
              <div className="col-lg-4 mb-3 mb-lg-0">
                <div className="d-inline-block">
                  <div className="media align-items-end">
                    <div className="media-body text-left ml-3">
                      <h6 className="text-uppercase mb-1">Livrare gratis</h6>
                      <p className="text-small mb-0 text-muted">
                        Prin partenerii nostri
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-3 mb-lg-0">
                <div className="d-inline-block">
                  <div className="media align-items-end">
                    <div className="media-body text-left ml-3">
                      <h6 className="text-uppercase mb-1">
                        Serviciu disponibil 24/7
                      </h6>
                      <p className="text-small mb-0 text-muted">
                        Deschideti chat-ul pentru intrebari
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="d-inline-block">
                  <div className="media align-items-end">
                    <div className="media-body text-left ml-3">
                      <h6 className="text-uppercase mb-1">
                        Oferte personalizate
                      </h6>
                      <p className="text-small mb-0 text-muted">
                        Pentru astfel de oferte folositi chat-ul
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
