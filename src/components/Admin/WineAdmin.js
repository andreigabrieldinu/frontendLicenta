import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function WineAdmin() {
  const [listWines, setListWines] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [wineToUpdate, setWineToUpdate] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [pagination, setPagination] = useState({
    page: "1",
    size: "6",
    search: "",
  });
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const query = queryString.stringify(pagination);
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/wines/?${query}`)
      .then((res) => res.json())
      .then((json) => {
        setListWines(json.wines);
        setTotal(json.total);
      });
  }, [pagination, load, page]);

  useEffect(() => {
    setTotalPage(Math.ceil(total / pagination.size));
  }, [page, pagination, listWines]);

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
      wineName: "",
      wineColor: "",
      wineType: "",
      wineStatus: "",
      wineQuantity: "",
    },
    validationSchema: Yup.object().shape({
      wineName: Yup.string().required("(*) Numele este obligatoriu"),
      wineColor: Yup.string()
        .required("(*) Culoarea este obligatorie")
        .matches(
          /Vin Rose|Vin Alb|Vin Rosu/,
          "Culoarea poate fi `Vin Rose`, `Vin Alb` sau `Vin Rosu`"
        ),
      wineType: Yup.string()
        .required("(*) Tipul vinului este obligatoriu")
        .matches(
          /dulce|sec|demi-sec|demi-dulce/,
          "Tipul vinului poate fi `dulce`, `sec`, `demi-sec` sau `demi-dulce`"
        ),
      wineStatus: Yup.string()
        .required("(*) Statusul este obligatoriu")
        .matches(
          /must|fermentat|tanar|maturizat|invechit/,
          "Statusul poate fi `must`, `fermentat`, `tanar`, `maturizat`, `invechit`"
        ),
      wineQuantity: Yup.string()
        .required("(*) Cantitatea este obligatorie")
        .matches(/^[0-9]+$/, "Cantitatea este invalida"),
    }),
    onSubmit: async (values) => {
      fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/wines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            setLoad(!load);
            toast.success("Vinul a fost adaugat cu succes!", {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } else {
            {
              toast.error(res.message, {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Vinul nu a fost adaugat!", {
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
    },
  });
  const handleDelete = async (name) => {
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/wines/${name}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Vinul a fost sters cu succes!") {
          setLoad(!load);
          toast.success(res.message, {
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
        } else {
          {
            toast.error(res.message, {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Vinul nu a fost sters!", {
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

    setPagination({
      page: 1,
      size: 6,
      search: pagination.search,
    });
  };
  const formik3 = useFormik({
    initialValues: {
      wineStatus2: "",
    },
    validationSchema: Yup.object().shape({
      wineStatus2: Yup.string()
        .required("(*) Statusul este obligatoriu")
        .matches(
          /must|fermentat|tanar|maturizat|invechit/,
          "Statusul poate fi `must`, `fermentat`, `tanar`, `maturizat`, `invechit`"
        ),
    }),
    onSubmit: async (values) => {
      fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/wines/${wineToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            toast.success("Vinul a fost modificat cu succes!", {
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
          } else {
            toast.error(res.msg, {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
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
                  <li className="breadcrumb-item">Tabele</li>
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Vinuri
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
                <h4 className="card-title">Vinuri</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta vin"
                    onChange={(e) => {
                      setPagination({
                        page: pagination.page,
                        size: pagination.size,
                        search: e.target.value,
                        category: pagination.category,
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
                      Adauga vin
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
                                Adaugare vin
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
                                    <label htmlFor="wineName">Nume Vin </label>
                                    <input
                                      type="text"
                                      name="wineName"
                                      className="form-control"
                                      id="wineName"
                                      placeholder="Introdu numele vinului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.wineName}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="wineColor">
                                      Culoare Vin
                                    </label>
                                    <input
                                      name="wineColor"
                                      type="text"
                                      className="form-control"
                                      id="wineColor"
                                      placeholder="Introdu culoarea vinului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.wineColor}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="wineType">Tip Vin</label>
                                    <input
                                      name="wineType"
                                      type="text"
                                      className="form-control"
                                      id="wineType"
                                      placeholder="Introdu tipul vinului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.wineType}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="wineStatus">
                                      Status Vin
                                    </label>
                                    <input
                                      name="wineStatus"
                                      type="text"
                                      className="form-control"
                                      id="wineStatus"
                                      placeholder="Introdu statusul vinului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.wineStatus}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="wineQuantity">
                                      Cantitate Vin
                                    </label>
                                    <input
                                      name="wineQuantity"
                                      type="text"
                                      className="form-control"
                                      id="wineQuantity"
                                      placeholder="Introdu cantitatea vinului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.wineQuantity}
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
                        <th>Nume</th>
                        <th>Culoare</th>
                        <th>Tip</th>
                        <th>Stare</th>
                        <th>Ultima actualizare</th>
                        <th>Cantitate</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listWines.map((wine) => (
                        <tr key={wine.wineName}>
                          <td>{wine.wineName}</td>
                          <td>{wine.wineColor}</td>
                          <td>{wine.wineType}</td>
                          <td>{wine.wineStatus}</td>
                          <td>
                            {wine.updatedAt
                              ? wine.updatedAt.slice(0, 10)
                              : wine.createdAt.slice(0, 10)}
                          </td>

                          <td>{`${wine.wineQuantity} litri`}</td>
                          <td>
                            <button
                              type="button"
                              style={{ cursor: "pointer", color: "white" }}
                              className="btn btn-danger"
                              onClick={() => handleDelete(wine.wineName)}
                            >
                              Sterge
                            </button>
                            <button
                              type="button"
                              className="btn btn-success mx-2"
                              data-toggle="modal"
                              data-target="#modificaProdus"
                              onClick={() => setWineToUpdate(wine.wineName)}
                            >
                              Actualizeaza
                            </button>
                            <div
                              className="modal show bd-example-modal-lg"
                              id="modificaProdus"
                              tabIndex={-12}
                              role="dialog"
                              aria-labelledby="myLargeModalLabel2"
                              aria-hidden="true"
                            >
                              <div
                                className="modal-dialog modal-lg"
                                style={{ maxWidth: "600px", minWidth: "600px" }}
                              >
                                <form onSubmit={formik3.handleSubmit}>
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5
                                        className="modal-title"
                                        id="exampleModalLongTitle"
                                      >
                                        Actualizare vin
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
                                        <div className="form-group">
                                          <label htmlFor="wineStatus2">
                                            Status Vin
                                          </label>
                                          <input
                                            type="text"
                                            name="wineStatus2"
                                            className="form-control"
                                            id="wineStatus2"
                                            placeholder="Introdu numele vinului"
                                            onChange={formik3.handleChange}
                                          />
                                          <p className="text-2xs text-danger">
                                            {formik3.errors.wineStatus2}
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
