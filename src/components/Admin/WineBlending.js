import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function WineBlending() {
  const [listWineIngredients, setlistWineIngredients] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [wineName, setWineName] = useState("");
  const [ingredientId, setIngredientId] = useState("");
  const [pagination, setPagination] = useState({
    page: "1",
    size: "6",
    search: "",
  });
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const query = queryString.stringify(pagination);
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/wineingredients/?${query}`)
      .then((res) => res.json())
      .then((json) => {
        setlistWineIngredients(json.wineIngredients);
        setTotal(json.total);
      });
  }, [pagination, load, page]);

  useEffect(() => {
    setTotalPage(Math.ceil(total / pagination.size));
  }, [page, pagination, listWineIngredients]);

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
      ingredientName: "",
      wineName: "",
      administratedQuantity: "",
    },
    validationSchema: Yup.object().shape({
      ingredientName: Yup.string().required(
        "(*) Numele ingredientului este obligatoriu"
      ),
      wineName: Yup.string().required("(*) Numele vinului este obligatoriu"),
      administratedQuantity: Yup.string()
        .required("(*) Cantitatea administrata este obligatorie")
        .matches(/^[0-9]+$/, "Cantitatea administrata este invalida"),
    }),
    onSubmit: async (value) => {
      await fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/wineingredients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status === 201) {
            toast.success(json.msg, {
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
            toast.error(json.msg, {
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

      setLoad(!load);
    },
  });
  const handleDelete = async (wineName, idIngredient) => {
    await fetch(
      `${process.env.REACT_APP_DOMAIN}/api/v1/wineingredients/${idIngredient}/${wineName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 200) {
          toast.success(json.msg, {
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
          toast.error(json.msg, {
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

    setPagination({
      page: 1,
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
                    Aditivare Vinuri
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
                <h4 className="card-title">Vinuri aditivate</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta aditivari pe vinuri prin nume"
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
                      Adauga ingredient pe vin
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
                                Adauga Ingredient pe Vin
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
                                    <label htmlFor="ingredientName">
                                      Nume Ingredient
                                    </label>
                                    <input
                                      type="text"
                                      name="ingredientName"
                                      className="form-control"
                                      id="ingredientName"
                                      placeholder="Introdu nume ingredient"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.ingredientName}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="wineName">Nume vin</label>
                                    <input
                                      name="wineName"
                                      type="text"
                                      className="form-control"
                                      id="wineName"
                                      placeholder="Introdu nume vin"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.wineName}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="administratedQuantity">
                                      Cantitatea administrata
                                    </label>
                                    <input
                                      name="administratedQuantity"
                                      type="text"
                                      className="form-control"
                                      id="administratedQuantity"
                                      placeholder="Introdu cantitatea administrata"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.administratedQuantity}
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
                        <th>Nume ingredient</th>
                        <th>Cantitate administrata</th>
                        <th>Data si ora administrare</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listWineIngredients.map((wine, index) => (
                        <tr key={index}>
                          <td>{wine.wineName}</td>
                          <td>{wine.ingredientName}</td>
                          <td>{wine.administratedQuantity}</td>
                          {
                            // scoate doar data si ora din createdAt
                            // din formatul asta 2023-07-13T00:00:00.000Z
                            // in formatul asta 2023-07-13, 00:00:00
                          }
                          {
                            // wine.createdAt.slice(0, 10) +
                            //   ", " +
                            //   wine.createdAt.slice(11, 19)
                          }
                          <td>{`${wine.createdAt.slice(
                            0,
                            10
                          )}, ${wine.createdAt.slice(11, 19)}  `}</td>

                          <td>
                            <button
                              type="button"
                              className="btn btn-danger"
                              data-toggle="modal"
                              data-target="#exampleModal"
                              onClick={() => {
                                handleDelete(wine.wineName, wine.idIngredient);
                              }}
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
