import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Products from "./Products";
import Pagination from "@mui/material/Pagination";
import queryString from "query-string";
import {
  getListProductPanigation,
  getListProductFilterByType,
} from "../services/API/productApi";
import Search from "./Search";
import Sort from "./Sort";

export default function Shop() {
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
    size: "9",
    search: "",
    category: "all",
  });
  const dispatch = useDispatch();

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
  }, [pagination, page, sort]);

  useEffect(() => {
    (async () => {
      const params = {
        page: "",
        size: "",
        search: pagination.search,
        category: pagination.category,
      };
      const categoryArr = params.category.split(" ");
      const categoryType = categoryArr[0] + " " + categoryArr[1].trim();
      const wineType = categoryArr[2].trim();
      await getListProductFilterByType(dispatch, categoryType, wineType);
    })();
  }, [page, pagination, sort]);

  useEffect(() => {
    if (!productFilter || productFilter.length === 0) return;
    let totalProduct = productFilter.length;
    totalProduct = Math.ceil(totalProduct / pagination.size);
    setTotalPage(totalProduct);
  }, [page, pagination, sort, productFilter]);

  useEffect(() => {
    setPage(1);
  }, [pagination.category]);

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

  const handleCategory = async (value) => {
    setPagination({
      page: pagination.page,
      size: pagination.size,
      search: pagination.search,
      category: value,
    });
  };

  const handleSearch = (value) => {
    setPagination({
      page: pagination.page,
      size: pagination.size,
      search: value,
      category: pagination.category,
    });
  };

  const handleSort = (value) => {
    setSort(value);
  };

  return (
    <div className="container">
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Magazin</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    <a href="/">Acasa</a>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {productFilter?.map((item, index) => (
        <div className="modal fade show" id={`product_${item.id}`} key={index}>
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-body p-0">
                <div className="row align-items-stretch">
                  <div className="col-lg-6 p-lg-0">
                    <img
                      style={{ width: "100%" }}
                      className="product-view d-block h-100 bg-cover bg-center"
                      src={item.img1}
                      data-lightbox={`product_${item._id}`}
                    />
                    <img className="d-none" href={item.img2} />
                    <img className="d-none" href={item.img3} />
                  </div>
                  <div className="col-lg-6">
                    <a
                      className="close p-3 dark"
                      type="button"
                      href="#section_product"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      x
                    </a>
                    <div className="p-5 my-md-4">
                      <ul className="list-inline mb-2">
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                      </ul>
                      <h2 className="h4">{item.name}</h2>
                      <p className="text-muted font-weight-bold">
                        {item.price} RON
                      </p>
                      <p className="text-muted font-weight-bold">
                        {item.productQuantity} buc.
                      </p>
                      {item.promotionPercent ? (
                        <p className="small text-muted font-weight-bold">
                          {Math.round(
                            item.price -
                              (item.price * item.promotionPercent) / 100
                          )}{" "}
                          RON -{" "}
                          <span className="bg-warning">
                            {item.promotionPercent}%
                          </span>
                        </p>
                      ) : null}
                      <p className="text-small mb-4"> {item.description} </p>
                      <p className="text-small mb-4">
                        {item.category} {item.wineType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* -------------Modal Product----------------- */}
      <section className="py-5">
        <div className="container p-0">
          <div className="row">
            <div className="col-lg-3 order-2 order-lg-1">
              <h5 className="text-uppercase mb-4">Categorii</h5>
              <div className="py-2 px-4 bg-dark text-white mb-3">
                <strong className="small text-uppercase font-weight-bold">
                  Tipuri de vin{" "}
                </strong>
              </div>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="/shop"
                    onClick={() => handleCategory("all")}
                  >
                    Toate{" "}
                  </a>
                </li>
              </ul>
              <div className="py-2 px-4 bg-light mb-3">
                <strong className="small text-uppercase font-weight-bold">
                  Vinuri Albe
                </strong>
              </div>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Alb sec")}
                  >
                    Sec
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Alb demi-sec")}
                  >
                    Demi-sec
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Alb demi-dulce")}
                  >
                    Demi-dulce
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Alb dulce")}
                  >
                    Dulce
                  </a>
                </li>
              </ul>
              <div className="py-2 px-4 bg-light mb-3">
                <strong className="small text-uppercase font-weight-bold">
                  Vinuri Rose
                </strong>
              </div>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Rose sec")}
                  >
                    Sec
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Rose demi-sec")}
                  >
                    Demi-sec
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Rose demi-dulce")}
                  >
                    Demi-dulce
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Rose dulce")}
                  >
                    Dulce
                  </a>
                </li>
              </ul>
              <div className="py-2 px-4 bg-light mb-3">
                <strong className="small text-uppercase font-weight-bold">
                  Vinuri Rosii
                </strong>
              </div>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Rosu sec")}
                  >
                    Sec
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Rosu demi-sec")}
                  >
                    Demi-sec
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Rosu demi-dulce")}
                  >
                    Demi-dulce
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Vin Rosu dulce")}
                  >
                    Dulce
                  </a>
                </li>
              </ul>
              <div className="py-2 px-4 bg-light mb-3">
                <strong className="small text-uppercase font-weight-bold">
                  Accesorii
                </strong>
              </div>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("Accesorii")}
                  >
                    Diferite accesorii pentru vin
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-9 order-1 order-lg-2 mb-5 mb-lg-0">
              <div className="row mb-3 align-items-center">
                <Search handleSearch={handleSearch} />

                <div className="col-lg-8">
                  <ul className="list-inline d-flex align-items-center justify-content-lg-end mb-0">
                    <li className="list-inline-item">
                      <Sort handleSort={handleSort} />
                    </li>
                  </ul>
                </div>
              </div>

              <Products productPanigation={productPanigation} sort={sort} />

              <div className="d-flex justify-content-center mt-5">
                <Pagination
                  count={totalPage}
                  page={page}
                  onChange={handleChangePage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
