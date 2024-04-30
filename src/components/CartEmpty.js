import React from "react";
import { NavLink } from "react-router-dom";

export default function CartEmpty() {
  return (
    <div className=" d-flex flex-column text-center align-items-center my-5">
      <div>
        <img src="/image/emptyCart.png" alt="img" width={350} height={350} />
      </div>
      <div>
        <p className="mb-4 font-weight-normal "> </p>
        <NavLink
          to="/shop"
          className="text-sm text-center py-3 px-4 border border-dark bg-dark text-white hover-zoom my-5"
        >
          Catre magazin
        </NavLink>
      </div>
    </div>
  );
}
