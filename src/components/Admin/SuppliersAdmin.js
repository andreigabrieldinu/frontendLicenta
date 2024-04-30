import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { min } from "moment/moment";

export default function SuppliersAdmin() {
  const [listElements, setListElements] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    page: "1",
    size: "6",
    search: "",
  });
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const query = queryString.stringify(pagination);
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/suppliers/?${query}`)
      .then((res) => res.json())
      .then((json) => {
        setListElements(json.objects);
        setTotal(json.total);
      });
  }, [pagination, load, page]);

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
      supplierName: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierAddress: "",
      obj: "",
      objName: "",
    },
    validationSchema: Yup.object().shape({
      supplierName: Yup.string().required("(*) Numele este obligatoriu"),
      supplierEmail: Yup.string().required("(*) Email-ul este obligatoriu"),
      supplierPhone: Yup.string().required("(*) Telefonul este obligatoriu"),
      supplierAddress: Yup.string().required("(*) Adresa este obligatorie"),
      obj: Yup.string()
        .required("(*) Tipul produsului este obligatoriu")
        .matches(
          //regex ca sa matcheze Dop/Eticheta/Sticla/Ingredient
          /^(Dop|Eticheta|Sticla|Ingredient)$/,
          "Tipul produsului trebuie sa fie Dop/Eticheta/Sticla/Ingredient"
        ),
      objName: Yup.string().required("(*) Numele produsului este obligatoriu"),
    }),
    onSubmit: async (value) => {
      fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/suppliers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status) {
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
          } else if (json.id) {
            toast.success("Furnizorul a fost adaugat cu succes!", {
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
        page: page,
        size: 6,
        search: pagination.search,
      });
      setLoad(!load);
    },
  });
  const handleDelete = async (objName, obj) => {
    fetch(
      `${process.env.REACT_APP_DOMAIN}/api/v1/suppliers/${objName}/${obj}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
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
        } else if (json.id) {
          toast.success("Furnizorul a fost sters cu succes!", {
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
                    Furnizori
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
                <h4 className="card-title">Furnizori</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta obiect dupa nume"
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
                      Adauga furnizor
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
                                Adauga furnizor
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
                                    <label htmlFor="supplierName">
                                      Nume furnizor
                                    </label>
                                    <input
                                      type="text"
                                      name="supplierName"
                                      className="form-control"
                                      id="supplierName"
                                      placeholder="Introdu nume furnizor"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.supplierName}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="supplierEmail">
                                      Email furnizor
                                    </label>
                                    <input
                                      name="supplierEmail"
                                      type="text"
                                      className="form-control"
                                      id="supplierEmail"
                                      placeholder="Introdu email furnizor"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.supplierEmail}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="supplierPhone">
                                      Numar furnizor
                                    </label>
                                    <input
                                      name="supplierPhone"
                                      type="text"
                                      className="form-control"
                                      id="supplierPhone"
                                      placeholder="Introdu telefon furnizor"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.supplierPhone}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="supplierAddress">
                                      Adresa furnizorului
                                    </label>
                                    <input
                                      name="supplierAddress"
                                      type="text"
                                      className="form-control"
                                      id="supplierAddress"
                                      placeholder="Introdu adresa furnizorului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.supplierAddress}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="obj">Obiect furnizat</label>
                                    <input
                                      name="obj"
                                      type="text"
                                      className="form-control"
                                      id="obj"
                                      placeholder="Introdu tipul obiectului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.obj}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="objName">
                                      Numele obiectului
                                    </label>
                                    <input
                                      name="objName"
                                      type="text"
                                      className="form-control"
                                      id="objName"
                                      placeholder="Introdu numele obiectului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.objName}
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
                        {/* //primele 3 pt must, urmatoarele pentru vin
        isIn: [
          [
            "Drojdie", //20 g / hectolitru MUST
            "Sulf18", //0.15 ml / litru MUST //  0.3 ml / litru VIN
            "Enzime", //2 g /hectolitru MUST
            "Acid metatartaric", //1 kg / 10000 lt vin
            "Sorbat de potasiu", //3 lt/ 10000 lt vin
            "Guma Arabica", //3 lt / 10000 litri vin
          ],
        ], */}

                        <th>Nume Furnizor</th>
                        <th>Email Furnizor</th>
                        <th>Adresa Furnizor</th>
                        <th>Telefon Furnizor</th>
                        <th>Tip obiect</th>
                        <th>Nume obiect</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listElements.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.supplierName}</td>
                            <td>{item.supplierEmail}</td>
                            <td>{item.supplierAddress}</td>
                            <td>{item.supplierPhone}</td>
                            <td>
                              {item.corkName
                                ? "Dop"
                                : item.bottleName
                                ? "Sticla"
                                : item.labelName
                                ? "Eticheta"
                                : item.ingredientName
                                ? "Ingredient"
                                : null}
                            </td>
                            <td>
                              {item.corkName
                                ? item.corkName
                                : item.bottleName
                                ? item.bottleName
                                : item.labelName
                                ? item.labelName
                                : item.ingredientName
                                ? item.ingredientName
                                : null}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger"
                                data-toggle="modal"
                                data-target="#exampleModal"
                                onClick={() => {
                                  handleDelete(
                                    item.corkName
                                      ? item.corkName
                                      : item.bottleName
                                      ? item.bottleName
                                      : item.labelName
                                      ? item.labelName
                                      : item.ingredientName
                                      ? item.ingredientName
                                      : null,
                                    item.corkName
                                      ? "Dop"
                                      : item.bottleName
                                      ? "Sticla"
                                      : item.labelName
                                      ? "Eticheta"
                                      : item.ingredientName
                                      ? "Ingredient"
                                      : null
                                  );
                                }}
                              >
                                Sterge
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <Pagination
                    count={Math.ceil(total / 6)}
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
