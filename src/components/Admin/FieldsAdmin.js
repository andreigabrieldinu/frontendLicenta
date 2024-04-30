import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function ProductsAdmin() {
  const [listFields, setListFields] = useState([]);
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
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/fields/?${query}`)
      .then((res) => res.json())
      .then((json) => {
        setListFields(json.fields);
        setTotal(json.total);
      });
  }, [pagination, load, page]);

  useEffect(() => {
    setTotalPage(Math.ceil(total / pagination.size));
  }, [listFields, pagination, page]);

  const handleChangePage = (e, value) => {
    e.preventDefault();
    window.scrollTo(0, 0);

    setPage(value);
    setPagination({
      page: value,
      size: pagination.size,
    });
  };

  const formik = useFormik({
    initialValues: {
      fieldName: "",
      fieldArea: "",
      longitude: "",
      latitude: "",
    },
    validationSchema: Yup.object().shape({
      fieldName: Yup.string().required("(*) Numele terenului este obligatoriu"),
      fieldArea: Yup.string().required("(*) Aria este obligatorie"),
      longitude: Yup.string().required("(*) Longitudinea este obligatorie"),
      latitude: Yup.string().required("(*) Latitudinea este obligatorie"),
    }),
    onSubmit: async (value) => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      };
      fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/fields`, options)
        .then((res) => res.json())
        .then((json) => {
          listFields.push(json);
          setListFields(listFields);
          setLoad(!load);
        })
        .catch((err) => {
          toast.error(`Terenul nu a fost adaugat deoarece ${err}`, {
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
      toast.success("Teren adaugat cu succes", {
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

  const handleDelete = async (id) => {
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/fields/${id}`, {
      method: "DELETE",
    }).then((res) => {
      setLoad(!load);
      if (res.status === 200) {
        toast.success("Teren sters cu succes", {
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
      } else if (res.status === 500) {
        toast.error(
          "Terenul nu poate fi sters fiindca avem struguri culesi de pe el",
          {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
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
                    Terenuri
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
                <h4 className="card-title">Terenuri</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta teren"
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
                      Adauga teren
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
                                Adauga Teren
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
                                    <label htmlFor="fieldName">
                                      Nume Teren
                                    </label>
                                    <input
                                      type="text"
                                      name="fieldName"
                                      className="form-control"
                                      id="teren"
                                      placeholder="Introdu numele terenului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.fieldName}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="fieldArea">Arie</label>
                                    <input
                                      name="fieldArea"
                                      type="text"
                                      className="form-control"
                                      id="arie"
                                      placeholder="Introdu aria"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.fieldArea}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="latitude">Latitudine</label>
                                    <input
                                      name="latitude"
                                      type="text"
                                      className="form-control"
                                      id="latitudine"
                                      placeholder="Introdu latitudine"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.latitude}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="longitudine">
                                      Longitudine
                                    </label>
                                    <input
                                      name="longitude"
                                      type="text"
                                      className="form-control"
                                      id="longitudine"
                                      placeholder="Introdu longitudine"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.longitude}
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
                        <th>Id</th>
                        <th>Nume</th>
                        <th>longitudine</th>
                        <th>latitudine</th>
                        <th>Arie</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listFields.map((field) => (
                        <tr key={field.id}>
                          <td>{field.id}</td>
                          <td>{field.fieldName}</td>
                          <td>{field.longitude}</td>
                          <td>{field.latitude}</td>
                          <td>
                            {field.fieldArea} mp<sup>2</sup>
                          </td>
                          <td>
                            <button
                              type="button"
                              style={{ cursor: "pointer", color: "white" }}
                              className="btn btn-danger"
                              onClick={() => handleDelete(field.id)}
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
