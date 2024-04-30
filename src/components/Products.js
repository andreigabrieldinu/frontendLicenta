import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Products({ productPanigation, sort }) {
  if (!productPanigation) {
    return;
  }
  const productSort = [...productPanigation];

  if (sort === "DownToUp") {
    productSort.sort((a, b) => {
      return a.price - b.price;
    });
  }

  if (sort === "UpToDown") {
    productSort.sort((a, b) => {
      return b.price - a.price;
    });
  }

  return (
    <div className="row" style={{ rowGap: "20px" }}>
      {productSort?.map((item, index) => (
        <div
          className="col-lg-4 col-sm-5 Section_Category"
          style={{ marginBottom: 0 }}
          key={index}
        >
          <div>
            <div className="product text-center" style={{ height: "auto" }}>
              <div className="position-relative mb-3">
                <NavLink className="d-block" to={`/detail/${item.id}`}>
                  <img className="img-fluid w-100" src={item.img1} alt="..." />
                </NavLink>
                <div className="product-overlay">
                  <ul className="mb-0 list-inline">
                    <li className="list-inline-item m-0 p-0">
                      <NavLink
                        className="btn btn-sm btn-dark"
                        to={`/detail/${item.id}`}
                      >
                        Vizualizeaza
                      </NavLink>
                    </li>
                    <li className="list-inline-item mr-0">
                      <a
                        className="btn btn-sm btn-outline-dark"
                        href={`#product_${item.id}`}
                        data-toggle="modal"
                      >
                        <i className="fas fa-expand"></i>
                      </a>
                    </li>
                    <li className="list-inline-item mr-0"></li>
                  </ul>
                </div>
              </div>
              <h6>
                <a className="reset-anchor">{item.name}</a>
              </h6>
              <p className="small text-muted" style={{ marginBottom: 5 }}>
                {item.price} RON
              </p>

              {item.promotionPercent ? (
                <p className="small text-muted font-weight-bold">
                  {Math.round(
                    item.price - (item.price * item.promotionPercent) / 100
                  )}{" "}
                  RON -{" "}
                  <span className="bg-warning">{item.promotionPercent}%</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
