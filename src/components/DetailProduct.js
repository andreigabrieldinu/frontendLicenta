import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { incrementItem } from "../redux/cartSlice";
import { createComment, getCommentProduct } from "../services/API/commentAPI";
import { getListProduct, getProductById } from "../services/API/productApi";
import ProductForYou from "./ProductForYou";
import axios from "axios";
import queryString from "query-string";
import moment from "moment";
import { toast } from "react-toastify";

export default function DetailProduct(props) {
  const { id } = useParams();
  const product = useSelector((state) => state.product.productDetail?.product);

  const listProduct = useSelector(
    (state) => state.product.products?.allProduct
  );
  const user = useSelector((state) => state.auth.login.currentUser);
  let listComment = useSelector(
    (state) => state.comment.loadComment.listComment
  );
  const [star, setStar] = useState(1);
  const [comment, setComment] = useState("");
  const [loadComment, setLoadComment] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    getProductById(dispatch, id);
  }, [id]);
  useEffect(() => {
    getCommentProduct(dispatch, id);
  }, [id]);
  useEffect(() => {
    getListProduct(dispatch);
  }, [id]);

  const decrementQuantity = () => {
    if (quantity <= 1) {
      toast.warn("Trebuie comandat minim 1 produs", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    } else {
      setQuantity((value) => value - 1);
      toast.success("Cantitatea a fost scazuta", {
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
  };
  const incrementQuantity = () => {
    setQuantity((value) => value + 1);
    if (quantity >= product.productQuantity) {
      toast.warn("Cantitatea maxima a fost atinsa", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setQuantity(product.productQuantity);
      return;
    }
    toast.success("Cantitatea a fost marita", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const onChangeText = (value) => {
    quantity(value);
  };

  const handleAddToCart = (product, quantity) => {
    dispatch(incrementItem({ product, quantity }));
  };

  const handleComment = async () => {
    const data = { id, comment, star };
    await createComment(dispatch, data, user.token);
    setLoadComment(true);
    setShowComment(true);
    setComment("");
  };

  useEffect(() => {
    (async () => {
      if (loadComment) {
        const params = {
          idProduct: id,
        };
        const query = "?" + queryString.stringify(params);
        await getCommentProduct(dispatch, query);
      }
      setLoadComment(false);
    })();
  }, [loadComment, id]);

  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-6">
            <div className="row m-sm-0">
              <div className="col-sm-2 p-sm-0 order-2 order-sm-1 mt-2 mt-sm-0">
                <div
                  className="owl-thumbs d-flex flex-row flex-sm-column"
                  data-slider-id="1"
                >
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img
                      className="w-100"
                      src={product?.img1}
                      alt={product?.img1}
                    />
                  </div>
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img
                      className="w-100"
                      src={product?.img2}
                      alt={product?.img2}
                    />
                  </div>
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img
                      className="w-100"
                      src={product?.img3}
                      alt={product?.img3}
                    />
                  </div>
                </div>
              </div>
              <div
                id="carouselExampleControls"
                className="carousel slide col-sm-10 order-1 order-sm-2"
                data-ride="carousel"
              >
                <div className="carousel-inner owl-carousel product-slider">
                  <div className="carousel-item active">
                    <img
                      className="d-block w-100"
                      src={product?.img1}
                      alt="First slide"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      className="d-block w-100"
                      src={product?.img2}
                      alt="Second slide"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      className="d-block w-100"
                      src={product?.img3}
                      alt="Third slide"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      className="d-block w-100"
                      src={product?.img4}
                      alt="Fourth slide"
                    />
                  </div>
                </div>
                <a
                  className="carousel-control-prev"
                  href="#carouselExampleControls"
                  role="button"
                  data-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a
                  className="carousel-control-next"
                  href="#carouselExampleControls"
                  role="button"
                  data-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
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
            <h1>{product?.name}</h1>
            <p className="text-muted lead">{product?.price} RON</p>
            <p className="text-muted font-weight-bold">
              {product?.productQuantity} buc.
            </p>
            {product?.promotionPercent ? (
              <p className="small text-muted font-weight-bold">
                {Math.round(
                  product.price -
                    (product.price * product?.promotionPercent) / 100
                )}{" "}
                RON -{" "}
                <span className="bg-warning">{product?.promotionPercent}%</span>
              </p>
            ) : null}
            <p className="text-small mb-4">{product?.description}</p>
            <div className="row align-items-stretch mb-4">
              <div className="col-sm-5 pr-sm-0">
                <div className="border d-flex align-items-center justify-content-between px-3 bg-white border-black">
                  <span className="small text-uppercase text-gray mr-4 no-select">
                    Cantitate
                  </span>
                  <div className="quantity">
                    <button
                      className="dec-btn p-0"
                      style={{ cursor: "pointer" }}
                      onClick={() => decrementQuantity()}
                    >
                      <i className="fas fa-caret-left"></i>
                    </button>
                    <input
                      className="form-control border-0 shadow-0 p-0"
                      type="text"
                      onChange={(e) => onChangeText(e.target.value)}
                      value={quantity}
                    />
                    <button
                      className="inc-btn p-0"
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className="fas fa-caret-right"
                        onClick={() => incrementQuantity()}
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-sm-3 pl-sm-0">
                <button
                  className="btn btn-dark btn-md btn-block d-flex align-items-center justify-content-center px-0 text-white ml-2"
                  onClick={() => handleAddToCart(product, quantity)}
                >
                  Adauga la cos
                </button>
              </div>

              <ul
                className="list-unstyled small d-block"
                style={{ width: "100%", marginTop: "10px" }}
              >
                <li className="px-3 py-2 mb-1 bg-white text-muted">
                  <strong className="text-uppercase text-dark">
                    Categorie:
                  </strong>
                  <a className="reset-anchor ml-2">{product?.category}</a>
                </li>
                {product?.category !== "Accesorii" ? (
                  <li className="px-3 py-2 mb-1 bg-white text-muted">
                    <strong className="text-uppercase text-dark">
                      Tip vin:
                    </strong>
                    <a className="reset-anchor ml-2">{product?.wineType}</a>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1">Comentariu:</label>
          <textarea
            className="form-control"
            rows="3"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex w-25">
            <span className="mt-2">Evalueaza: </span>
            &nbsp; &nbsp;
            <input
              className="form-control w-25"
              type="number"
              min="1"
              max="5"
              value={star}
              onChange={(e) => {
                setStar(e.target.value);
              }}
            />
            &nbsp; &nbsp;
            <span className="mt-2">Stele</span>
          </div>
          <div>
            <button
              className="btn btn-dark btn-sm btn-block px-0 text-white"
              style={{ width: "12rem" }}
              onClick={() => handleComment()}
            >
              Trimite comentariu
            </button>
          </div>
        </div>
        <br />
        <ul className="nav nav-tabs border-0">
          <li className="nav-item">
            <a
              className="nav-link fix_comment"
              style={{ backgroundColor: "#383838", color: "#ffffff" }}
              onClick={() => {
                if (showComment === false) {
                  setShowComment(true);
                } else {
                  setShowComment(false);
                }
              }}
            >
              Recenzii
            </a>
          </li>
        </ul>
        <div className="tab-content mb-1">
          <div className="tab-pane fade show active">
            <div className="p-4 p-lg-5 bg-white">
              <div className="col-lg-8">
                {showComment === true
                  ? listComment.map((value) => (
                      <div className="media mb-3" key={value.id}>
                        <img
                          className="rounded-circle"
                          src="https://img.icons8.com/color/36/000000/administrator-male.png"
                          alt=""
                          width="50"
                        />
                        <div className="media-body ml-3">
                          <h6 className="mb-0 text-uppercase">
                            {value.fullname}
                          </h6>
                          <p className="small text-muted mb-0 text-uppercase">
                            {moment(value.createdAt).format(
                              "DD-MM-YYYY hh:mm:ss"
                            )}
                          </p>
                          <ul className="list-inline mb-1 text-xs">
                            <li className="list-inline-item m-0">
                              <i className={value.star1}></i>
                            </li>
                            <li className="list-inline-item m-0">
                              <i className={value.star2}></i>
                            </li>
                            <li className="list-inline-item m-0">
                              <i className={value.star3}></i>
                            </li>
                            <li className="list-inline-item m-0">
                              <i className={value.star4}></i>
                            </li>
                            <li className="list-inline-item m-0">
                              <i className={value.star5}></i>
                            </li>
                          </ul>
                          <p className="text-small mb-0 text-muted">
                            {value.content}
                          </p>
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
        <h2 className="h5 text-uppercase mb-4">Produse asemanatoare</h2>
        <div className="row d-block">
          <ProductForYou listProduct={listProduct} />
        </div>
      </div>
    </div>
  );
}
