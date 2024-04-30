import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getListHistoryUser,
  updateHistoryUser,
} from "../../services/API/historyApi";
import { getAllCarts } from "../../services/API/cartApi";
import io from "socket.io-client";
import queryString from "query-string";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Pagination } from "@mui/material";

const socket = io("http://localhost:3000");

export default function HistoryAdmin() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [obj, setObj] = useState([]);
  const [order, setOrder] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");
  const [totalPage, setTotalPage] = useState();
  const [pagination, setPagination] = useState({
    page: "1",
    size: "6",
    search: "",
  });
  const [load, setLoad] = useState(false);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDateTime = new Intl.DateTimeFormat("ro-RO", options).format(
      date
    );
    return formattedDateTime;
  };

  useEffect(() => {
    const query = queryString.stringify(pagination);
    fetch(
      `${process.env.REACT_APP_DOMAIN}/api/v1/history/pagination?${query}`
    ).then((res) => {
      res.json().then((data) => {
        setObj(data.content);
      });
    });
  }, [pagination]);

  useEffect(() => {
    let totalHistories = obj.length;
    console.log(totalHistories);
    totalHistories = Math.ceil(totalHistories / pagination.size);
    setTotalPage(totalHistories);
  }, [page, pagination, obj]);

  useEffect(() => {
    //Primeste date de la server trimise prin socket cu cheia receive_order
    socket.on("receive_order", (data) => {
      setText("User ID: " + data + " tocmai a comandat");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }, []);
  const handleChangePage = (e, value) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setPage(value);
    setPagination({
      page: value,
      size: pagination.size,
      search: pagination.search,
    });
  };
  const formik = useFormik({
    initialValues: {
      livrare: "",
      plata: "",
    },
    validationSchema: Yup.object().shape({
      livrare: Yup.string().matches(
        /^[1-2-3]+$/,
        "Introduceti 1 pentru predat curierului, 2 pentru livrat sau 3 pentru anulat"
      ),
      plata: Yup.string().matches(
        /^[0-1]+$/,
        "Introduceti 1 pentru platit, 0 neplatit"
      ),
    }),
    onSubmit: async (values) => {
      await updateHistoryUser(dispatch, order, values);
      toast.success("Comanda a fost actualizata cu succes!", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setPagination({
        page: 1,
        size: pagination.size,
        search: pagination.search,
      });
    },
  });
  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Admin
            </h4>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/admin" className="text-muted">
                      Admin
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Istoric
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Istoric</h4>
                <h3>{text}</h3>
                <input
                  className="form-control w-25"
                  type="text"
                  placeholder="Cauta dupa nume client"
                  onChange={(e) => {
                    setPagination({
                      page: pagination.page,
                      size: pagination.size,
                      search: e.target.value,
                    });
                  }}
                />
                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>Nume produs</th>
                        <th>Numar produse</th>
                        <th>Nume client</th>
                        <th>Adresa </th>
                        <th>Total</th>
                        <th>Livrare</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Actualizeaza status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {obj?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.productName}</td>
                          <td>{item.productCount}</td>
                          <td>{item.name}</td>
                          <td>{item.address}</td>
                          <td>{item.total} RON</td>
                          {
                            //item.delivery = 3 => anulat
                            //item.delivery = 2 => livrat
                            //item.delivery = 1 => predat curierului
                          }
                          <td>
                            {item.delivery === 0
                              ? "Neexpediat"
                              : item.delivery === 1
                              ? "Predat curierului"
                              : item.delivery === 2
                              ? "Livrat"
                              : item.delivery === 3
                              ? "Anulat"
                              : "Necunoscut"}
                          </td>
                          <td>{item.status ? "Platit" : "Neplatit"}</td>
                          <td>{formatTimestamp(item.createdAt)}</td>
                          <td>
                            <a
                              type="button"
                              className="btn btn-success mx-2"
                              data-toggle="modal"
                              data-target="#actualizeazaProdus"
                              style={{ color: "white" }}
                              onClick={() => {
                                setOrder(item.id);
                              }}
                            >
                              Actualizeaza
                            </a>
                            <div>
                              <div
                                className="modal show bd-example-modal-lg"
                                tabIndex={-2}
                                role="dialog"
                                aria-labelledby="myLargeModalLabel2"
                                aria-hidden="true"
                                id="actualizeazaProdus"
                                style={{
                                  height: "90vh",
                                  width: "30vw",
                                  position: "absolute",
                                  top: "25%",
                                  left: "25%",
                                }}
                              >
                                <div>
                                  <form onSubmit={formik.handleSubmit}>
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id="exampleModalLongTitle2"
                                        >
                                          Actualizeaza comanda
                                        </h5>
                                        <button
                                          type="button"
                                          className="close"
                                          data-dismiss="modal"
                                          aria-label="Close"
                                        >
                                          x
                                        </button>
                                      </div>
                                      <div className="container-fluid">
                                        <div
                                          className="row p-3"
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div className="form-group">
                                            <label htmlFor="livrare">
                                              Livrare
                                            </label>
                                            <input
                                              type="text"
                                              name="livrare"
                                              className="form-control"
                                              id="livrare"
                                              placeholder="Introdu detaliile despre livrare"
                                              onChange={formik.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik.errors.livrare}
                                            </p>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="plata">Plata</label>
                                            <input
                                              name="plata"
                                              type="text"
                                              className="form-control"
                                              id="plata"
                                              placeholder="Introdu detaliile despre plata"
                                              onChange={formik.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik.errors.plata}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="modal-footer">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          data-dismiss="modal"
                                        >
                                          Inchide
                                        </button>
                                        <button
                                          type="submit"
                                          className="btn btn-success"
                                        >
                                          Salveaza modificarile
                                        </button>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination
                    count={3}
                    page={page}
                    onChange={handleChangePage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
