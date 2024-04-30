import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { min } from "moment/moment";

export default function WineAnalysis() {
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
      alcohol: "",
      sugar: "",
      totalAcidity: "",
      totalVolatility: "",
      freeSulphur: "",
      totalSulphur: "",
      density: "",
      nonReducingDryExtract: "",
    },
    validationSchema: Yup.object().shape({
      alcohol: Yup.string()
        .required("(*) Alcoolul este obligatoriu")
        .matches(/^-?\d+(?:.\d+)?$/, "Alcoolul este invalid"),
      sugar: Yup.string()
        .required("(*) Zaharul este obligatoriu")
        .matches(
          // real cu virgula
          /^-?\d+(?:.\d+)?$/,
          "Zaharul este invalid"
        ),
      totalAcidity: Yup.string()
        .required("(*) Aciditatea totala este obligatorie")
        .matches(/^-?\d+(?:.\d+)?$/, "Aciditatea totala este invalida"),
      totalVolatility: Yup.string()
        .required("(*) Volatilitatea totala este obligatorie")
        .matches(/^-?\d+(?:.\d+)?$/, "Volatilitatea totala este invalida"),
      freeSulphur: Yup.string()
        .required("(*) Sulful liber este obligatoriu")
        .matches(/^-?\d+(?:.\d+)?$/, "Sulful liber este invalid"),
      //regex pentru numere cu virgula
      totalSulphur: Yup.string()
        .required("(*) Sulful total este obligatoriu")
        .matches(/^-?\d+(?:.\d+)?$/, "Sulful total este invalid"),
      density: Yup.string()
        .required("(*) Densitatea este obligatorie")
        .matches(/^-?\d+(?:.\d+)?$/, "Densitatea este invalida"),
      nonReducingDryExtract: Yup.string()
        .required("(*) Extractul sec nereducator este obligatoriu")
        .matches(/^-?\d+(?:.\d+)?$/, "Extractul sec nereducator este invalid"),
    }),
    onSubmit: async (value) => {
      await fetch(
        `${process.env.REACT_APP_DOMAIN}/api/v1/wines/${wineToUpdate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
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

      setLoad(!load);
    },
  });
  const handleDelete = async (wineName) => {
    await fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/wines/${wineName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        alcohol: null,
        sugar: null,
        totalAcidity: null,
        totalVolatility: null,
        freeSulphur: null,
        totalSulphur: null,
        density: null,
        nonReducingDryExtract: null,
      }),
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
                    Analize
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
                <h4 className="card-title">Analize</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta analize"
                    onChange={(e) => {
                      setPagination({
                        page: pagination.page,
                        size: pagination.size,
                        search: e.target.value,
                      });
                    }}
                  />
                </div>

                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>Nume Vin</th>
                        <th>Alcool</th>
                        <th>Zahar</th>
                        <th>Aciditate totala</th>
                        <th>Volatilitate totala</th>
                        <th>Sulf liber</th>
                        <th>Sulf total</th>
                        <th>Densitate</th>
                        <th>Extract sec nereducator</th>
                        <th>Ultima actualizare</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listWines.map((wine) => (
                        <tr key={wine.wineName}>
                          <td>
                            {wine.wineName === null ? null : `${wine.wineName}`}
                          </td>
                          <td>
                            {wine.alcohol === null
                              ? null
                              : `${wine.alcohol}g/l`}
                          </td>
                          <td>
                            {wine.alcohol === null ? null : `${wine.sugar}g/l`}
                          </td>
                          <td>
                            {wine.totalAcidity === null
                              ? null
                              : `${wine.totalAcidity}g/l`}
                          </td>
                          <td>
                            {wine.totalVolatility === null
                              ? null
                              : `${wine.totalVolatility}g/l`}
                          </td>
                          <td>
                            {wine.freeSulphur === null
                              ? null
                              : `${wine.freeSulphur}g/l`}
                          </td>
                          <td>
                            {wine.totalSulphur === null
                              ? null
                              : `${wine.totalSulphur}g/l`}
                          </td>
                          <td>
                            {wine.density === null
                              ? null
                              : `${wine.density}g/l`}
                          </td>
                          <td>
                            {wine.nonReducingDryExtract === null
                              ? null
                              : `${wine.nonReducingDryExtract}g/l`}
                          </td>
                          {
                            //taie orele din data}
                          }
                          <td>{wine.updatedAt.substring(0, 10)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleDelete(wine.wineName)}
                            >
                              Sterge Analiza
                            </button>
                            <a
                              type="button"
                              className="btn btn-success mx-2"
                              data-toggle="modal"
                              data-target="#actualizeazaProdus"
                              style={{ color: "white" }}
                              onClick={() => {
                                setWineToUpdate(wine.wineName);
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
                                          Actualizeaza Analiza
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
                                            <label htmlFor="alcohol">
                                              Alcool
                                            </label>
                                            <input
                                              type="text"
                                              name="alcohol"
                                              className="form-control"
                                              id="alcohol"
                                              placeholder="Introdu alcoolul"
                                              onChange={formik.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik.errors.alcohol}
                                            </p>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="sugar">Zahar</label>
                                            <input
                                              name="sugar"
                                              type="text"
                                              className="form-control"
                                              id="sugar"
                                              placeholder="Introdu zaharul"
                                              onChange={formik.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik.errors.sugar}
                                            </p>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="totalAcidity">
                                              Aciditate totala
                                            </label>
                                            <input
                                              type="text"
                                              name="totalAcidity"
                                              className="form-control"
                                              id="totalAcidity"
                                              placeholder="Introdu aciditatea totala"
                                              onChange={formik.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik.errors.totalAcidity}
                                            </p>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="totalVolatility">
                                              Volatilitate totala
                                            </label>
                                            <input
                                              type="text"
                                              name="totalVolatility"
                                              className="form-control"
                                              id="totalVolatility"
                                              placeholder="Introdu aciditatea volatila"
                                              onChange={formik.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik.errors.totalVolatility}
                                            </p>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="freeSulphur">
                                              Capacitate ocupata
                                            </label>
                                            <input
                                              type="text"
                                              name="freeSulphur"
                                              className="form-control"
                                              id="freeSulphur"
                                              placeholder="Introdu sulf liber"
                                              onChange={formik.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik.errors.freeSulphur}
                                            </p>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="totalSulphur">
                                              Sulf total
                                            </label>
                                            <input
                                              type="text"
                                              name="totalSulphur"
                                              className="form-control"
                                              id="totalSulphur"
                                              placeholder="Introdu sulf total"
                                              onChange={formik.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik.errors.totalSulphur}
                                            </p>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="density">
                                              Densitate
                                            </label>
                                            <input
                                              type="text"
                                              name="density"
                                              className="form-control"
                                              id="density"
                                              placeholder="Introdu densitatea"
                                              onChange={formik.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {formik.errors.density}
                                            </p>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="nonReducingDryExtract">
                                              Extract sec nereducator
                                            </label>
                                            <input
                                              type="text"
                                              name="nonReducingDryExtract"
                                              className="form-control"
                                              id="nonReducingDryExtract"
                                              placeholder="Introdu extractul sec nereducator"
                                              onChange={formik.handleChange}
                                            />
                                            <p className="text-2xs text-danger">
                                              {
                                                formik.errors
                                                  .nonReducingDryExtract
                                              }
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
