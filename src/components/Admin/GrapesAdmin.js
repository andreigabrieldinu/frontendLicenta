import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function GrapesAdmin() {
  const [listGrapes, setListGrapes] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState();
  const [pagination, setPagination] = useState({
    page: "1",
    size: "6",
    search: "",
  });
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const query = queryString.stringify(pagination);
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/grapes/?${query}`)
      .then((res) => res.json())
      .then((json) => {
        setListGrapes(json.grapes);
        setTotal(json.total);
      });
  }, [pagination, load, page]);

  useEffect(() => {
    setTotalPage(Math.ceil(total / pagination.size));
  }, [listGrapes, pagination, page]);

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
      grapeName: "",
      grapeColor: "",
      grapeQuantity: "",
      fieldName: "",
    },
    validationSchema: Yup.object().shape({
      grapeName: Yup.string().required(
        "(*) Numele strugurelui este obligatoriu"
      ),
      grapeColor: Yup.string().required(
        "(*) Culoarea strugurelui este obligatorie"
      ),
      grapeQuantity: Yup.string()
        .required("(*) Cantitatea de strugure este obligatorie")
        .matches(/^[0-9]+$/, "Cantitatea este doar numerica"),
      fieldName: Yup.string().required(
        "(*) Numele terenului de pe care este cultivat este obligatoriu"
      ),
    }),
    onSubmit: async (value) => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      };
      fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/grapes`, options).then(
        (json) => {
          if (json.ok) {
            toast.success("Strugure adaugat cu succes", {
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
            console.log(json.msg);
            toast.error("Strugurele nu a fost adaugat", {
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
      );

      setLoad(!load);
    },
  });
  const handleDelete = async (id) => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/grapes/${id}`, options)
      .then((res) => setLoad(!load))
      .catch((err) => console.log(err));

    toast.success("Strugure sters cu succes", {
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
                    Struguri
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
                <h4 className="card-title">Struguri</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta strugure"
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
                      Adauga strugure
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
                                Adauga strugure
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
                                      id="name"
                                      placeholder="Introdu numele strugurelui"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.grapeName}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="grapeColor">
                                      Culoare Strugure
                                    </label>
                                    <input
                                      name="grapeColor"
                                      type="text"
                                      className="form-control"
                                      id="grape"
                                      placeholder="Introdu culoare strugure"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.grapeColor}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="grapeQuantity">
                                      Cantitate Strugure
                                    </label>
                                    <input
                                      name="grapeQuantity"
                                      type="text"
                                      className="form-control"
                                      id="grape"
                                      placeholder="Introdu cantitate strugure"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.grapeQuantity}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="fieldName">
                                      Nume Teren
                                    </label>
                                    <input
                                      name="fieldName"
                                      type="text"
                                      className="form-control"
                                      id="numeTeren"
                                      placeholder="Introdu numele terenului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.fieldName}
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
                        <th>Cantitate culeasa</th>
                        <th>Data culegerii</th>
                        <th>Nume teren</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listGrapes.map((grape) => (
                        <tr key={grape.id}>
                          <td>{grape.grapeName}</td>
                          <td>{grape.grapeColor}</td>
                          <td>{grape.grapeQuantity} kg</td>
                          <td>
                            {grape.createdAt
                              ? grape.createdAt.slice(0, 10)
                              : ""}
                          </td>

                          <td>{grape.fieldName}</td>

                          <td>
                            <button
                              type="button"
                              style={{ cursor: "pointer", color: "white" }}
                              className="btn btn-danger"
                              onClick={() => handleDelete(grape.id)}
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
