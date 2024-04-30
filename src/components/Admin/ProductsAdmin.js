import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import {
  createProduct,
  deleteProduct,
  getListProductFilter,
  getListProductPanigation,
  updateProduct,
} from "../../services/API/productApi";
import Pagination from "@mui/material/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function ProductsAdmin() {
  const productPanigation = useSelector(
    (state) => state.product.productPanigation?.allProductPanigation
  );
  const productFilter = useSelector(
    (state) => state.product.productFilter?.allProductFilter
  );

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");
  const [totalPage, setTotalPage] = useState();
  const [pagination, setPagination] = useState({
    page: "1",
    size: "6",
    search: "",
    category: "all",
  });
  const [productToUpdate, setProductToUpdate] = useState();
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    (async () => {
      const params = {
        page: pagination.page,
        size: pagination.size,
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;
      await getListProductPanigation(dispatch, newQuery);
    })();
  }, [pagination, page, sort, load]);

  useEffect(() => {
    (async () => {
      const params = {
        page: "",
        size: "",
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;
      await getListProductFilter(dispatch, newQuery);
    })();
  }, [page, pagination, sort]);

  useEffect(() => {
    let totalProduct = productFilter?.length;
    totalProduct = Math.ceil(totalProduct / pagination.size);
    setTotalPage(totalProduct);
  }, [page, pagination, sort, productFilter]);

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
      name: "",
      description: "",
      price: "",
      img1: "",
      img2: "",
      img3: "",
      img4: "",
      category: "",
      promotionPercent: "",
      wineType: "",
      productQuantity: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("(*) Numele este obligatoriu"),
      description: Yup.string().required("(*) Descrierea este obligatorie"),
      price: Yup.string()
        .required("(*) Pretul este obligatoriu")
        .matches(/^[0-9]+$/, "Pretul este invalid"),
      img1: Yup.string().required("(*) Img1 este obligatorie"),
      img2: Yup.string().required("(*) Img2 este obligatorie"),
      img3: Yup.string().required("(*) Img3 este obligatorie"),
      img4: Yup.string().required("(*) Img4 este obligatorie"),
      category: Yup.string()
        .required("(*) Categoria este obligatorie")
        .matches(
          // Vin Rose, Vin Alb, Vin Rosu, Accesorii
          /^(Vin Rose|Vin Alb|Vin Rosu|Accesorii)$/,
          "Categoria trebuie sa fie Vin Rose, Vin Alb, Vin Rosu sau Accesorii"
        ),

      promotionPercent: Yup.string().matches(
        /^[0-9]+$/,
        "promotionPercent is invalid"
      ),
      wineType: Yup.string(),
      productQuantity: Yup.string()
        .matches(/^[0-9]+$/, "Cantitatea este invalida")
        .required("(*) Cantitatea este obligatorie"),
    }),
    onSubmit: async (value) => {
      await createProduct(dispatch, value);
      setLoad(!load);
    },
  });
  const handleDelete = async (id) => {
    productFilter.map((item) => {
      if (Number(item.id) !== Number(id)) {
        return item;
      }
    });

    productPanigation.map((item) => {
      if (Number(item.id) !== Number(id)) {
        return item;
      }
    });

    await deleteProduct(dispatch, id);
    toast.success("Produs sters cu succes", {
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
      page: 1,
      size: 6,
      search: pagination.search,
      category: pagination.category,
    });
  };
  const formik2 = useFormik({
    initialValues: {
      price2: "",
      promotionPercent2: "",
      productQuantity2: "",
    },
    validationSchema: Yup.object().shape({
      price2: Yup.string().matches(/^[0-9]+$/, "Pretul este invalid"),
      promotionPercent2: Yup.string().matches(
        /^[0-9]+$/,
        "promotionPercent is invalid"
      ),
      productQuantity2: Yup.string().matches(
        /^[0-9]+$/,
        "Cantitatea este invalida"
      ),
    }),
    onSubmit: async (values) => {
      await updateProduct(dispatch, productToUpdate, values);
      values.price2 = "";
      values.promotionPercent2 = "";
      values.productQuantity2 = "";
      setLoad(!load);
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
                    Produse
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
                <h4 className="card-title">Produse</h4>
                <div className="d-flex">
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Cauta produs"
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
                      Adauga produs
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
                                Adauga Produs
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
                                    <label htmlFor="name">Nume</label>
                                    <input
                                      type="text"
                                      name="name"
                                      className="form-control"
                                      id="name"
                                      placeholder="Introdu nume"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.name}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="description">
                                      Descriere
                                    </label>
                                    <input
                                      name="description"
                                      type="text"
                                      className="form-control"
                                      id="description"
                                      placeholder="Introdu descriere"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.description}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="price">Pret</label>
                                    <input
                                      name="price"
                                      type="text"
                                      className="form-control"
                                      id="price"
                                      placeholder="Introdu pret"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.price}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="img1">img1</label>
                                    <input
                                      name="img1"
                                      type="text"
                                      className="form-control"
                                      id="img1"
                                      placeholder="Introdu img1"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.img1}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="img2">img2</label>
                                    <input
                                      name="img2"
                                      type="text"
                                      className="form-control"
                                      id="img2"
                                      placeholder="Introdu img2"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.img2}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="cantitate">Cantitate</label>
                                    <input
                                      name="productQuantity"
                                      type="text"
                                      className="form-control"
                                      id="productQuantity"
                                      placeholder="Introdu cantitate"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.productQuantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="form-group">
                                    <label htmlFor="img3">img3</label>
                                    <input
                                      name="img3"
                                      type="text"
                                      className="form-control"
                                      id="img3"
                                      placeholder="Introdu img3"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.img3}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="img4">img4</label>
                                    <input
                                      name="img4"
                                      type="text"
                                      className="form-control"
                                      id="img4"
                                      placeholder="Introdu img4"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.img4}
                                    </p>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="category">Categorie</label>
                                    <input
                                      name="category"
                                      type="text"
                                      className="form-control"
                                      id="category"
                                      placeholder="Introdu categoria"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.category}
                                    </p>
                                  </div>

                                  <div className="form-group">
                                    <label htmlFor="promotionPercent">
                                      Procent promotie
                                    </label>
                                    <input
                                      name="promotionPercent"
                                      type="text"
                                      className="form-control"
                                      id="promotionPercent"
                                      placeholder="Introdu procentul promotiei"
                                      onChange={formik.handleChange}
                                    />
                                    <p className="text-2xs text-danger">
                                      {formik.errors.promotionPercent}
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
                        <th>Pret</th>
                        <th>Imagine</th>
                        <th>Categorie</th>
                        <th>Cantitate</th>
                        <th>Procent Promotie</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productPanigation?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>
                              <img
                                src={item.img1}
                                style={{ height: "60px", width: "60px" }}
                                alt={item.img1}
                              />
                            </td>
                            <td>{item.category}</td>
                            <td>{item.productQuantity}</td>
                            <td>
                              {item.promotionPercent
                                ? `${item.promotionPercent}%`
                                : null}
                            </td>
                            <td>
                              <button
                                type="button"
                                style={{ cursor: "pointer", color: "white" }}
                                className="btn btn-danger"
                                onClick={() => handleDelete(item.id)}
                              >
                                Sterge
                              </button>
                              <button
                                type="button"
                                className="btn btn-success mx-2"
                                data-toggle="modal"
                                data-target="#modificaProdus"
                                onClick={() => setProductToUpdate(item.id)}
                              >
                                Actualizeaza
                              </button>
                              <div>
                                <div
                                  className="modal show bd-example-modal-lg"
                                  tabIndex={-2}
                                  role="dialog"
                                  aria-labelledby="myLargeModalLabel2"
                                  aria-hidden="true"
                                  id="modificaProdus"
                                >
                                  <div className="modal-dialog modal-lg">
                                    <form onSubmit={formik2.handleSubmit}>
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <h5
                                            className="modal-title"
                                            id="exampleModalLongTitle2"
                                          >
                                            Modifica Produs
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
                                          <div className="row p-1">
                                            <div className="col-6">
                                              <div className="form-group">
                                                <label htmlFor="price2">
                                                  Pret Nou
                                                </label>
                                                <input
                                                  type="text"
                                                  name="price2"
                                                  className="form-control"
                                                  id="price2"
                                                  placeholder="Introdu pret nou"
                                                  onChange={
                                                    formik2.handleChange
                                                  }
                                                />
                                                <p className="text-2xs text-danger">
                                                  {formik2.errors.price2}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="col-6">
                                              <div className="form-group">
                                                <label htmlFor="promotionPercent2">
                                                  Procent Promotie
                                                </label>
                                                <input
                                                  name="promotionPercent2"
                                                  type="text"
                                                  className="form-control"
                                                  id="promotionPercent2"
                                                  placeholder="Introdu noul procent de promotie"
                                                  onChange={
                                                    formik2.handleChange
                                                  }
                                                />
                                                <p className="text-2xs text-danger">
                                                  {
                                                    formik2.errors
                                                      .promotionPercent2
                                                  }
                                                </p>
                                              </div>
                                            </div>
                                            <div className="col-6">
                                              <div className="form-group">
                                                <label htmlFor="productQuantity2">
                                                  Cantitate noua
                                                </label>
                                                <input
                                                  name="productQuantity2"
                                                  type="text"
                                                  className="form-control"
                                                  id="productQuantity2"
                                                  placeholder="Introdu noua cantitate"
                                                  onChange={
                                                    formik2.handleChange
                                                  }
                                                />
                                                <p className="text-2xs text-danger">
                                                  {
                                                    formik2.errors
                                                      .productQuantity2
                                                  }
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
                        );
                      })}
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
