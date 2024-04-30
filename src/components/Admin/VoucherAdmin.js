import React, { useEffect, useState } from "react";
import queryString from "query-string";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function VoucherAdmin() {
  const [listVouchers, setlistVouchers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [pagination, setPagination] = useState({
    page: "1",
    size: "6",
    search: "",
  });
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const query = queryString.stringify(pagination);
    fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/vouchers/?${query}`)
      .then((res) => res.json())
      .then((json) => {
        setlistVouchers(json.vouchers);
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
      voucherName: "",
      voucherPercentage: "",
    },
    validationSchema: Yup.object().shape({
      voucherName: Yup.string().required(
        "(*) Numele voucherului este obligatoriu"
      ),
      voucherPercentage: Yup.string().required(
        "(*) Procentaj voucher este obligatorie"
      ),
    }),
    onSubmit: async (value) => {
      await fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/vouchers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
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
    },
  });
  const handleDelete = async (voucherName) => {
    await fetch(
      `${process.env.REACT_APP_DOMAIN}/api/v1/vouchers/${voucherName}`,
      {
        method: "DELETE",
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
                    Vouchere
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
                <h4 className="card-title">Vouchere</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta voucher"
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
                      Adauga voucher
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
                                Adauga Voucher
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
                                    <label htmlFor="voucherName">
                                      Nume Voucher
                                    </label>
                                    <input
                                      type="text"
                                      name="voucherName"
                                      className="form-control"
                                      id="voucherName"
                                      placeholder="Introdu numele voucherului"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.voucherName}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="voucherPercentage">
                                      Procentaj reducere
                                    </label>
                                    <input
                                      name="voucherPercentage"
                                      type="text"
                                      className="form-control"
                                      id="voucherPercentage"
                                      placeholder="Introdu procentaj voucher"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.voucherPercentage}
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
                        <th>Nume Voucher</th>
                        <th>Procentaj Reducere</th>
                        <th>Data creare</th>
                        <th>Detalii</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listVouchers.map((voucher, index) => (
                        <tr key={index}>
                          <td>{voucher.voucherName}</td>
                          <td>{voucher.voucherPercentage}</td>
                          <td>{voucher.createdAt}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleDelete(voucher.voucherName)}
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
