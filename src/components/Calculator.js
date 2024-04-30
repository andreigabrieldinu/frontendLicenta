import React, { Fragment, useState } from "react";
import ProductForYou from "./ProductForYou";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListProduct } from "../services/API/productApi";
import { addToCartBigQuantity } from "../redux/cartSlice";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
export default function Calculator() {
  const listProduct = useSelector(
    (state) => state.product.products?.allProduct
  );
  const [budget, setBudget] = useState("0");
  const [event, setEvent] = useState("0");
  const [numberPersons, setNumberPersons] = useState(0);
  let [pressed, setPressed] = useState(0);
  const [bottles, setBottles] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [mapWines, setMapWines] = useState([]);
  const [recommendedWhite, setRecommendedWhite] = useState({});
  const [recommendedRose, setRecommendedRose] = useState({});
  const [recommendedRed, setRecommendedRed] = useState({});
  const dispatch = useDispatch();

  const product = (op, listProduct) => {
    switch (op) {
      case "0": {
        let min = listProduct[0];
        for (let i = 1; i < listProduct.length; i++) {
          if (Number(listProduct[i].price) <= Number(min.price)) {
            min = listProduct[i];
          }
        }
        return min;
      }
      case "2":
        {
          if (op === "2") {
            let max = listProduct[0];
            for (let i = 1; i < listProduct.length; i++) {
              if (Number(listProduct[i].price) >= Number(max.price)) {
                max = listProduct[i];
              }
            }
            return max;
          }
        }
        break;
      case "1":
        {
          if (op === "1") {
            let avg = listProduct[0];
            for (let i = 0; i < listProduct.length; i++) {
              if (
                Number(listProduct[i].price) >= 50 &&
                Number(listProduct[i].price) <= 90
              ) {
                avg = listProduct[i];
              }
            }
            return avg;
          }
        }
        break;
      default:
        return null;
    }
  };
  const handleEvent = (ev, nrBottles) => {
    switch (event) {
      case "0": {
        if (ev === "0") {
          let bottles = nrBottles * 0.85;
          let bottlesEvent = {
            bottlesWhite: Math.round(bottles * 0.45),
            bottlesRose: Math.round(bottles * 0.35),
            bottlesRed: Math.round(bottles * 0.2),
          };
          return bottlesEvent;
        }
      }
      case "1":
        {
          if (ev === "1") {
            let bottles = nrBottles * 0.75;
            let bottlesEvent = {
              bottlesWhite: Math.round(bottles * 0.4),
              bottlesRose: Math.round(bottles * 0.3),
              bottlesRed: Math.round(bottles * 0.3),
            };
            return bottlesEvent;
          }
        }
        break;
      case "2":
        {
          if (ev === "2") {
            let bottles = nrBottles * 0.65;
            let bottlesEvent = {
              bottlesWhite: Math.round(bottles * 0.4),
              bottlesRose: Math.round(bottles * 0.4),
              bottlesRed: Math.round(bottles * 0.2),
            };
            return bottlesEvent;
          }
        }
        break;
      default: {
        return null, null, null;
      }
    }
  };
  const handleCalculator = () => {
    if (!numberPersons) {
      toast.error("Introduceti numarul de persoane", {
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
      let nrBottles = Number(numberPersons);
      const wineWhite = listProduct?.filter((product) => {
        return product.category === "Vin Alb";
      });
      const wineRed = listProduct?.filter((product) => {
        return product.category === "Vin Rosu";
      });
      const wineRose = listProduct?.filter((product) => {
        return product.category === "Vin Rose";
      });
      let { bottlesWhite, bottlesRose, bottlesRed } = handleEvent(
        event,
        nrBottles
      );
      let wineWhiteEvent = product(budget, wineWhite);
      let wineRedEvent = product(budget, wineRed);
      let wineRoseEvent = product(budget, wineRose);

      let total =
        Number(
          Math.round(
            wineWhiteEvent.price -
              (wineWhiteEvent.price * wineWhiteEvent.promotionPercent) / 100
          )
        ) *
          bottlesWhite +
        Number(
          Math.round(
            wineRedEvent.price -
              (wineRedEvent.price * wineRedEvent.promotionPercent) / 100
          )
        ) *
          bottlesRed +
        Number(
          Math.round(
            wineRoseEvent.price -
              (wineRoseEvent.price * wineRoseEvent.promotionPercent) / 100
          )
        ) *
          bottlesRose;
      let totalBottles = bottlesWhite + bottlesRed + bottlesRose;
      setBottles(totalBottles);
      setTotalPrice(total);
      let objWhite = {
        product: wineWhiteEvent,
        quantity: bottlesWhite,
      };
      setRecommendedWhite(objWhite);
      let objRed = {
        product: wineRedEvent,
        quantity: bottlesRed,
      };
      setRecommendedRed(objRed);
      let objRose = {
        product: wineRoseEvent,
        quantity: bottlesRose,
      };
      setRecommendedRose(objRose);
      setMapWines([objWhite, objRed, objRose]);
      setPressed(1);
    }
  };

  useEffect(() => {
    getListProduct(dispatch);
  }, []);
  return (
    <Fragment>
      <div className="pt-5">
        <div className="container">
          <div className="py-5 bg-light">
            <div className="container">
              <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
                <div className="col-lg-6">
                  <h1 className="h6 text-uppercase mb-0">
                    Calculator pentru alegerea produselor potrivite
                  </h1>
                </div>
                <div className="col-lg-6 text-lg-right">
                  <nav aria-label="breadcrumb">
                    Alege produsele potrivite in functie de eveniment, buget si
                    numarul de persoane
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="container">
          <div className="float-left">
            <label htmlFor="select">Tipul bugetului:</label>
            <br></br>
            <select
              className="form-select"
              aria-label="Default select example"
              name="select"
              selected={budget}
              onClick={(e) => {
                setBudget(e.target.value);
              }}
              defaultValue="0"
            >
              <option selected value="0">
                Buget redus
              </option>
              <option value="1">Buget mediu</option>
              <option value="2">Buget ridicat</option>
            </select>
          </div>
          <div className="float-right">
            <label htmlFor="select">Tipul evenimentului:</label>
            <br></br>
            <select
              className="form-select"
              aria-label="Default select example"
              name="select"
              selected={event}
              onClick={(e) => {
                setEvent(e.target.value);
              }}
              defaultValue="0"
            >
              <option selected value="0">
                Nunta
              </option>
              <option value="1">Botez</option>
              <option value="2">Petreceri/Majorate</option>
            </select>
          </div>
          <br />
          <br />
          <br />
          <br />
          <div className="text-center">
            <h2 className="h5 text-uppercase mb-4">Numar persoane</h2>
            <input
              type="number"
              placeholder=""
              onChange={(e) => setNumberPersons(e.target.value)}
            />
          </div>
          <br />
          <div className="text-center">
            <button
              className="reset-anchor remove_cart  btn btn-dark"
              onClick={handleCalculator}
            >
              Calculeaza
            </button>
          </div>
        </div>
      </div>
      <br></br>
      {}
      {pressed === 1 ? (
        <div className="pt-4 container">
          <div className="table-responsive mb-4">
            <table className="table">
              <thead className="bg-light">
                <tr className="text-center">
                  <th className="border-0" scope="col">
                    {" "}
                    <strong className="text-small text-uppercase">
                      Imagine
                    </strong>
                  </th>
                  <th className="border-0" scope="col">
                    {" "}
                    <strong className="text-small text-uppercase">
                      Produs
                    </strong>
                  </th>
                  <th className="border-0" scope="col">
                    {" "}
                    <strong className="text-small text-uppercase">
                      Tip vin
                    </strong>
                  </th>
                  <th className="border-0" scope="col">
                    {" "}
                    <strong className="text-small text-uppercase">Pret</strong>
                  </th>
                  <th className="border-0" scope="col">
                    {" "}
                    <strong className="text-small text-uppercase">
                      Cantitate
                    </strong>
                  </th>
                  <th className="border-0" scope="col">
                    {" "}
                    <strong className="text-small text-uppercase">Total</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mapWines.map((wine, index) => {
                  return (
                    <Fragment key={index}>
                      <tr className="text-center">
                        <td>
                          <NavLink
                            className="reset-anchor d-block animsition-link"
                            to={`/detail/${wine.product.id}`}
                          >
                            <img
                              src={wine.product.img1}
                              alt={wine.product.img1}
                              width="80"
                            />
                          </NavLink>
                        </td>
                        <td className="align-middle product-name">
                          <NavLink
                            className="reset-anchor h6 animsition-link"
                            to={`/detail/${wine.product.id}`}
                          >
                            <strong className="h6 text-uppercase">
                              {wine.product.name}
                            </strong>
                          </NavLink>
                        </td>
                        <td className="align-middle product-name">
                          {wine.product.category}
                        </td>
                        <td className="align-middle">
                          <strong>{wine.product.price} RON</strong>
                          {wine.product.promotionPercent ? (
                            <p className="small text-muted font-weight-bold">
                              {Math.round(
                                wine.product.price -
                                  (wine.product.price *
                                    wine.product.promotionPercent) /
                                    100
                              )}{" "}
                              RON -{" "}
                              <span className="bg-warning">
                                {wine.product.promotionPercent}%
                              </span>
                            </p>
                          ) : null}
                        </td>
                        <td className="align-middle">
                          <strong>{wine.quantity}</strong>
                        </td>
                        <td className="align-middle">
                          <strong>
                            {Number(
                              Math.round(
                                wine.product.price -
                                  (wine.product.price *
                                    wine.product.promotionPercent) /
                                    100
                              )
                            ) * wine.quantity}{" "}
                            RON
                          </strong>
                        </td>
                        <td className="align-middle"></td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
            <div className="container">
              <div className="float-right">
                <a
                  className="reset-anchor remove_cart btn btn-dark mb-3"
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={() => setPressed(--pressed)}
                >
                  Sterge produse recomandate
                </a>
              </div>

              <div className="float-left">
                <a
                  className="reset-anchor remove_cart btn btn-dark mb-3"
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={() => {
                    dispatch(addToCartBigQuantity(recommendedWhite));
                    dispatch(addToCartBigQuantity(recommendedRed));
                    dispatch(addToCartBigQuantity(recommendedRose));
                  }}
                >
                  Adauga produsele in cos
                </a>
              </div>
            </div>{" "}
            <div className="text-center">Pret total : {totalPrice} RON</div>
            <div className="text-center">Numar total produse : {bottles}</div>
          </div>
        </div>
      ) : null}
      <div className="page-holder">
        <div className="header bg-white">
          <div className="container">
            <div className="py-5" id="section_product">
              <div>
                <h2 className="h5 text-uppercase mb-4">Alte produse</h2>
              </div>
              <div className="row d-block">
                <ProductForYou listProduct={listProduct} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
