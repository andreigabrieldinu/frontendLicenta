import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { v4 as uuidv4 } from "uuid";

export default function GrapesWineAdminAdmin() {
  const [listGrapesWines, setlistGrapesWines] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState();
  const [pagination, setPagination] = useState({
    page: "1",
    size: "6",
    search: "",
  });
  const [load, setLoad] = useState(false);
  const [idGrape, setIdGrape] = useState("");
  const [wineName, setWineName] = useState("");

  useEffect(() => {
    const query = queryString.stringify(pagination);
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/grapeWines/?${query}`)
      .then((res) => res.json())
      .then((json) => {
        setlistGrapesWines(json.grapeWines);
        setTotal(json.total);
      });
  }, [pagination, load, page]);

  useEffect(() => {
    setTotalPage(Math.ceil(total / pagination.size));
  }, [listGrapesWines, pagination, page]);

  const handleChangePage = (e, value) => {
    e.preventDefault();
    window.scrollTo(0, 0);

    setPage(value);
    setPagination({
      page: value,
      size: pagination.size,
      search: pagination.search,
      category: pagination.category,
    });
  };

  const formik = useFormik({
    initialValues: {
      grapeName: "",
      wineName: "",
    },
    validationSchema: Yup.object().shape({
      grapeName: Yup.string().required(
        "(*) Numele strugurelui este obligatoriu"
      ),
      wineName: Yup.string().required("(*) numele vinului este obligatoriu"),
    }),
    onSubmit: async (value) => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      };
      fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/grapeWines`, options)
        .then((res) => res.json())
        .then((json) => {
          listGrapesWines.push(json);
          console.log(json);
          setlistGrapesWines(listGrapesWines);
          setLoad(!load);
        })
        .catch((err) => {
          toast.error(err, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });
      toast.success("Recipientul a fost adaugat cu succes", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setLoad(!load);
    },
  });
  const handleDelete = async (idGrape, wineName) => {
    fetch(
      `${process.env.REACT_APP_DOMAIN}/api/v1/grapeWines/${idGrape}/${wineName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        res.json().then((res) => {
          console.log(res);
          setLoad(!load);
          if (res.status === 200) {
            toast.success(res.msg, {
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
              page: page,
              size: 6,
              search: pagination.search,
            });
          } else if (res.status !== 200) {
            toast.error(res.msg, {
              position: "bottom-left",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        });
      })
      .catch((err) => {
        toast.error(`Strugurele nu poate fi sters deoarece ${err}`, {
          position: "bottom-left",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

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
                  <li className="breadcrumb-item">Tabele</li>
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Strugurii din vin
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
                <h4 className="card-title">Struguri in vin</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta struguri in vin"
                    onChange={(e) => {
                      setPagination({
                        page: pagination.page,
                        size: pagination.size,
                        search: e.target.value,
                      });
                    }}
                  />
                  <div>
                    <button
                      type="button"
                      className="btn btn-success mx-2"
                      data-toggle="modal"
                      data-target="#addProduct"
                    >
                      Adauga struguri in vin
                    </button>

                    <div
                      className="modal show bd-example-modal-lg"
                      id="addProduct"
                      tabIndex={-1}
                      role="dialog"
                      aria-labelledby="myLargeModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <form onSubmit={formik.handleSubmit}>
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="exampleModalLongTitle"
                              >
                                Adauga Struguri in vin
                              </h5>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                id="buttonClose"
                              >
                                <span aria-hidden="true">x</span>
                              </button>
                            </div>

                            <div className="container-fluid">
                              <div className="row p-3">
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="grapeName">
                                      Nume Strugure
                                    </label>
                                    <input
                                      type="text"
                                      name="grapeName"
                                      className="form-control"
                                      id="grapeName"
                                      placeholder="Introdu numele strugurelui"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.grapeName}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="wineName">Nume Vin</label>
                                    <input
                                      name="wineName"
                                      type="text"
                                      className="form-control"
                                      id="wineName"
                                      placeholder="Introdu numele vinului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.wineName}
                                    </p>
                                  </div>
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
                              <button type="submit" className="btn btn-success">
                                Salveaza modificarile
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>Nume vin</th>
                        <th>Nume strugure</th>
                        <th>Data culegerii</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listGrapesWines.map((grape) => (
                        <tr key={uuidv4()}>
                          <td>{grape.wineName}</td>
                          <td>{grape.grapeName}</td>
                          <td>{grape.createdAt.slice(0, 10)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() =>
                                handleDelete(grape.idGrape, grape.wineName)
                              }
                            >
                              Sterge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination
                    count={totalPage}
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
