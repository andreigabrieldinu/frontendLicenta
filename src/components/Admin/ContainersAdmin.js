import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function ContainerAdmin() {
  const [listContainers, setListContainers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [container, setContainer] = useState({});
  const [totalPage, setTotalPage] = useState();
  const [pagination, setPagination] = useState({
    page: "1",
    size: "6",
    search: "",
  });
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const query = queryString.stringify(pagination);
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/containers/?${query}`)
      .then((res) => res.json())
      .then((json) => {
        setListContainers(json.containers);
        setTotal(json.total);
      });
  }, [pagination, load, page]);

  useEffect(() => {
    setTotalPage(Math.ceil(total / pagination.size));
  }, [listContainers, pagination, page]);

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
      containerName: "",
      containerCapacity: "",
    },
    validationSchema: Yup.object().shape({
      containerName: Yup.string().required("(*) Numele este obligatoriu"),
      containerCapacity: Yup.string()
        .required("(*) Descrierea este obligatorie")
        .matches(/^[0-9]+$/, "Capacitatea este invalida"),
    }),
    onSubmit: async (value) => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      };
      fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/containers`, options)
        .then((res) => res.json())
        .then((json) => {
          listContainers.push(json);
          setListContainers(listContainers);
          setLoad(!load);
        })
        .catch((err) => {
          toast.error(`Recipientul nu poate fi adaugat deoarece ${err}`, {
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
    },
  });
  const formik1 = useFormik({
    initialValues: {
      occupiedCapacity: "",
      containerTemperature: "",
      wineName: "",
    },
    validationSchema: Yup.object().shape({
      occupiedCapacity: Yup.string()
        .matches(/^[0-9]+$/, "Capacitatea ocupata este invalida")
        .required("(*) Capacitatea ocupata este obligatorie"),
      containerTemperature: Yup.string()
        .matches(/^-?\d*(\.\d{0,2})?$/, "Temperatura este invalida")
        .required("(*) Temperatura este obligatorie"),
      wineName: Yup.string().required("(*) Numele vinului este obligatoriu"),
    }),
    onSubmit: async (values) => {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      };
      fetch(
        `${process.env.REACT_APP_DOMAIN}/api/v1/containers/${container}`,
        options
      ).then((res) => {
        res.json().then((json) => {
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
            setPagination({
              page: page,
              size: 6,
              search: pagination.search,
            });
          } else if (json.status !== 200) {
            toast.error(json.msg, {
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
      });
      setLoad(!load);
    },
  });

  const handleDelete = async (id) => {
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/containers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        res.json().then((res) => {
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
        toast.error(`Recipientul nu poate fi sters deoarece ${err}`, {
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
                    Recipiente
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
                <h4 className="card-title">Recipiente</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta recipiente"
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
                      Adauga recipient
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
                                Adauga Recipient
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
                                    <label htmlFor="containerName">
                                      Nume Recipient
                                    </label>
                                    <input
                                      type="text"
                                      name="containerName"
                                      className="form-control"
                                      id="containerName"
                                      placeholder="Introdu numele recipientului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.containerName}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="containerCapacity">
                                      Capacitate Recipient
                                    </label>
                                    <input
                                      name="containerCapacity"
                                      type="text"
                                      className="form-control"
                                      id="containerCapacity"
                                      placeholder="Introdu capacitatea recipientului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.containerCapacity}
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
                        <th>Capacitate recipient</th>
                        <th>Capacitate ocupata</th>
                        <th>Temperatura</th>
                        <th>Nume vin stocat</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listContainers?.map((container) => (
                        <tr key={container.id}>
                          <td>{container.containerName}</td>
                          <td>{container.containerCapacity} litri</td>
                          <td>
                            {container.occupiedCapacity
                              ? `${container.occupiedCapacity} litri`
                              : null}
                          </td>
                          <td>
                            {container.containerTemperature
                              ? `${container.containerTemperature}°C`
                              : null}
                          </td>
                          <td>{container.wineName}</td>
                          <td>
                            <button
                              type="button"
                              style={{ cursor: "pointer", color: "white" }}
                              className="btn btn-danger"
                              onClick={() => handleDelete(container.id)}
                            >
                              Sterge
                            </button>
                            <a
                              type="button"
                              className="btn btn-success mx-2"
                              data-toggle="modal"
                              data-target="#actualizeazaProdus"
                              style={{ color: "white" }}
                              onClick={() => {
                                setContainer(container.id);
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
                                  <form onSubmit={formik1.handleSubmit}>
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id="exampleModalLongTitle2"
                                        >
                                          Actualizeaza recipientul
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
                                            <label htmlFor="occupiedCapacity">
                                              Capacitate ocupata
                                            </label>
                                            <input
                                              type="text"
                                              name="occupiedCapacity"
                                              className="form-control"
                                              id="occupiedCapacity"
                                              placeholder="Introdu capacitatea ocupata"
                                              onChange={formik1.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik1.errors.occupiedCapacity}
                                            </p>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="containerTemperature">
                                              Temperatura
                                            </label>
                                            <input
                                              name="containerTemperature"
                                              type="text"
                                              className="form-control"
                                              id="containerTemperature"
                                              placeholder="Introdu temperatura de stocaj"
                                              onChange={formik1.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {
                                                formik1.errors
                                                  .containerTemperature
                                              }
                                            </p>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="wineName">
                                              Nume vin
                                            </label>
                                            <input
                                              type="text"
                                              name="wineName"
                                              className="form-control"
                                              id="wineName"
                                              placeholder="Introdu numele vinului"
                                              onChange={formik1.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik1.errors.wineName}
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
