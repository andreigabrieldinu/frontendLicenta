import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getListHistoryUser } from "../../services/API/historyApi";
import queryString from "query-string";

export default function HistoryUser() {
  const dispatch = useDispatch();
  const { histories } = useSelector((state) => state.history?.listHistory);
  const user = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    const params = {
      idUser: user.id,
    };
    const query = "?" + queryString.stringify(params);
    getListHistoryUser(dispatch, query);
  }, []);
  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Istoric Comenzi</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active">Istoric Comenzi</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">
                  ID comanda
                </strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">
                  ID utilizator
                </strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Nume</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Telefon</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Adresa</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Total</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Livrare</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Status</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {histories?.map((item, index) => (
              <tr className="text-center" key={index}>
                <td className="align-middle border-0">
                  <p className="mb-0 small">{item.id}</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">{item.idUser}</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">{item.fullname}</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">{item.phone}</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">{item.address}</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">{item.total} RON</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">
                    {item.delivery === 0
                      ? "Neexpediat"
                      : item.delivery === 1
                      ? "Predat curierului"
                      : item.delivery === 2
                      ? "Livrat"
                      : item.delivery === 3
                      ? "Anulat"
                      : "Necunoscut"}
                  </p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">
                    {item.status ? "Platit" : "Neplatit"}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
