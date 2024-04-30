import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function WineBottling() {
  const [listBottledWines, setlistBottledWines] = useState([]);
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
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/bottledwines/?${query}`)
      .then((res) => res.json())
      .then((json) => {
        setlistBottledWines(json.botteledWines);
        setTotal(json.total);
      });
  }, [pagination, load, page]);

  useEffect(() => {
    setTotalPage(Math.ceil(total / pagination.size));
  }, [page, pagination, listBottledWines]);

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
      corkName: "",
      labelName: "",
      bottleName: "",
      wineName: "",
      bottledBottlesNumber: "",
    },
    validationSchema: Yup.object().shape({
      corkName: Yup.string().required("(*) Numele dopului este obligatoriu"),
      labelName: Yup.string().required("(*) Numele etichetei este obligatoriu"),
      bottleName: Yup.string().required("(*) Numele sticlei este obligatorie"),
      wineName: Yup.string().required("(*) Numele vinului este obligatoriu"),
      bottledBottlesNumber: Yup.string()
        .required("(*) Numarul de sticle imbuteliate este obligatoriu")
        .matches(/^[0-9]+$/, "Cantitatea este invalida"),
    }),
    onSubmit: async (value) => {
      fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/bottledwines`, {
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
  const handleDelete = async (id) => {
    await fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/bottledwines/${id}`, {
      method: "DELETE",
    })
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

    setLoad(!load);
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
                    Vinuri Imbuteliate
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
                <h4 className="card-title">Vinuri Imbuteliate</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta vinuri imbuteliate"
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
                      Adauga vin imbuteliat
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
                                Adauga Vin Imbuteliat
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
                                    <label htmlFor="corkName">Nume dop</label>
                                    <input
                                      type="text"
                                      name="corkName"
                                      className="form-control"
                                      id="corkName"
                                      placeholder="Introdu nume dop"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.corkName}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="labelName">
                                      Nume eticheta
                                    </label>
                                    <input
                                      name="labelName"
                                      type="text"
                                      className="form-control"
                                      id="labelName"
                                      placeholder="Introdu numele etichetei"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.labelName}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="bottleName">
                                      Nume sticla
                                    </label>
                                    <input
                                      name="bottleName"
                                      type="text"
                                      className="form-control"
                                      id="bottleName"
                                      placeholder="Introdu nume sticla"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.bottleName}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="wineName">
                                      Numele vinului
                                    </label>
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
                                  <div className="form-group">
                                    <label htmlFor="bottledBottlesNumber">
                                      Numar sticle imbuteliate
                                    </label>
                                    <input
                                      name="bottledBottlesNumber"
                                      type="text"
                                      className="form-control"
                                      id="bottledBottlesNumber"
                                      placeholder="Introdu numarul de sticle imbuteliate"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.bottledBottlesNumber}
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
                        <th>Nume eticheta</th>
                        <th>Nume dop</th>
                        <th>Nume sticla</th>
                        <th>Numar sticle imbuteliate</th>
                        <th>Imbuteliat in data de</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listBottledWines.map((bottledWine) => (
                        <tr key={bottledWine.id}>
                          <td>{bottledWine.wineName}</td>
                          <td>{bottledWine.labelName}</td>
                          <td>{bottledWine.corkName}</td>
                          <td>{bottledWine.bottleName}</td>
                          <td>{bottledWine.bottledBottlesNumber}</td>
                          <td>{bottledWine.createdAt}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleDelete(bottledWine.id)}
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
