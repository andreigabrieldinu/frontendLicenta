import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import queryString from "query-string";
import {
  checkoutProduct,
  sendMailCheckout,
  productsToStripe,
} from "../services/API/checkoutApi";
import "../css/checkout.css";
import { createHistoryUser } from "../services/API/historyApi";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";

const socket = io("http://localhost:3000");

export default function Checkout() {
  const { carts, cartTotalPrice } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.auth.login);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [load, setLoad] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      paymentMethod: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .required("Necesar pentru completare")
        .min(10, "Numele trebuie sa aiba minim de 10 caractere")
        .max(30, "Numele trebuie sa aiba maxim de 30 caractere"),
      email: Yup.string()
        .required("Necesar pentru completare")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email invalid"
        )
        .min(10),
      phone: Yup.string()
        .required("Necesar pentru completare")
        .matches(/^(?:\d{10}|\+\d{10,13})$/, "Numar telefon invalid")
        .min(10)
        .max(13),
      address: Yup.string()
        .required("Necesar pentru completare")
        .matches(
          "^[/0-9a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
            "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
            "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ.\\s]+$",
          "Adresa invalida"
        )
        .max(90),
      paymentMethod: Yup.string().required("Necesar pentru completare"),
    }),
    onSubmit: async (values) => {
      if (values.paymentMethod === "Ramburs") {
        for (let item of carts) {
          const params = {
            idProduct: item.product.id,
            productCount: item.quantity,
            paymentMethod: values.paymentMethod,
          };
          if (!params) {
            toast.error("Ceva a mers gresit");
          }
          const query = "?" + queryString.stringify(params);
          await checkoutProduct(
            dispatch,
            query,
            currentUser.token,
            currentUser.id
          );
          let final = Number(item.product.price);
          if (item.product.promotionPercent !== "") {
            final = Math.round(
              final -
                Math.round(
                  (final * Number(item.product.promotionPercent)) / 100
                )
            );
          }
          final = Math.round(
            final * item.quantity -
              Math.round((final * item.quantity * discount) / 100)
          );
          const paramsHistory = {
            idUser: currentUser.id,
            phone: values.phone,
            address: values.address,
            cart: `${currentUser.fullname}'s cart`,
            fullname: values.fullName,
            total: final,
            paymentMethod: values.paymentMethod,
            voucherPercentage: discount,
          };

          await createHistoryUser(dispatch, paramsHistory);
        }
        localStorage.setItem("billFullName", formik.values.fullName);
        localStorage.setItem("billEmail", formik.values.email);
        localStorage.setItem("billPhone", formik.values.phone);
        localStorage.setItem("billAddress", formik.values.address);
        localStorage.setItem("billPaymentMethod", formik.values.paymentMethod);
        if (!localStorage.getItem("billVoucher")) {
          localStorage.setItem("billVoucher", 0);
        }
        let obj = {
          fullName: localStorage.getItem("billFullName"),
          email: localStorage.getItem("billEmail"),
          phone: localStorage.getItem("billPhone"),
          address: localStorage.getItem("billAddress"),
          paymentMethod: localStorage.getItem("billPaymentMethod"),
          products: carts.length,
          voucher: localStorage.getItem("billVoucher"),
        };
        //send data to server
        const voucherName = localStorage.getItem("billVoucherName");
        localStorage.removeItem("billVoucherName");
        localStorage.removeItem("billFullName");
        localStorage.removeItem("billEmail");
        localStorage.removeItem("billPhone");
        localStorage.removeItem("billAddress");
        localStorage.removeItem("billPaymentMethod");
        localStorage.removeItem("billVoucher");
        localStorage.removeItem("billVoucherName");
        if (discount !== 0) {
          await axios.delete(
            `${process.env.REACT_APP_DOMAIN}/api/v1/vouchers/${voucherName}`
          );
        }
        socket.emit("send_order", currentUser.id);
        await sendMailCheckout(dispatch, obj, currentUser.token);
        setLoad(!load);
        setTimeout(() => {
          setLoad(false);
          setSuccess(!success);
        }, 2000);
      } else {
        if (values.paymentMethod === "Card") {
          const params = [];
          for (let item of carts) {
            const param = {
              idProduct: item.product.id,
              productCount: item.quantity,
            };
            const query = "?" + queryString.stringify(param);

            params.push(query);
          }
          const voucher1 = localStorage.getItem("billVoucher");
          await productsToStripe(
            dispatch,
            params,
            currentUser.token,
            voucher1,
            currentUser.id
          );
          localStorage.setItem("billFullName", formik.values.fullName);
          localStorage.setItem("billEmail", formik.values.email);
          localStorage.setItem("billPhone", formik.values.phone);
          localStorage.setItem("billAddress", formik.values.address);
          localStorage.setItem(
            "billPaymentMethod",
            formik.values.paymentMethod
          );
        }
      }
    },
  });
  const handleVoucher = async () => {
    try {
      const voucherul = await axios.get(
        `${process.env.REACT_APP_DOMAIN}/api/v1/vouchers/${voucher}`
      );
      if (voucherul.status === 200) {
        setDiscount(voucherul.data.voucherPercentage);
        localStorage.setItem("billVoucherName", voucherul.data.voucherName);
        localStorage.setItem("billVoucher", voucherul.data.voucherPercentage);
        toast.success("Voucherul a fost aplicat!", {
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
    } catch (err) {
      console.log(err);
      toast.error("Voucherul nu exista!", {
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

  return (
    <div>
      {load && (
        <div className="wrapper_loader">
          <div className="loader"></div>
        </div>
      )}
      <div className="container">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="h2 text-uppercase mb-0">Checkout</h1>
              </div>
              <div className="col-lg-6 text-lg-right">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                    <li className="breadcrumb-item">
                      <a href="/">Acasa</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/cart">Cart</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Checkout
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>
        {!success && (
          <section className="py-5">
            <h2 className="h5 text-uppercase mb-4">Detalii facturare</h2>
            <div className="row">
              <div className="col-lg-8">
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12 form-group m-0">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="fullName"
                      >
                        Nume intreg:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Introdu numele tau intreg aici"
                        id="fullName"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                      />
                      <p className="text-2xs text-danger">
                        {formik.errors.fullName}
                      </p>
                    </div>
                    <div className="col-lg-12 form-group m-0">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="email"
                      >
                        Email:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Introdu mail-ul pentru a primi factura"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                      <p className="text-2xs text-danger">
                        {formik.errors.email}
                      </p>
                    </div>
                    <div className="col-lg-12 form-group m-0">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="phone"
                      >
                        Numar de telefon:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Introduce numarul tau de telefon aici"
                        id="phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                      />
                      <p className="text-2xs text-danger">
                        {formik.errors.phone}
                      </p>
                    </div>
                    <div className="col-lg-12 form-group m-0">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="address"
                      >
                        Adresa:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Introduce adresa ta aici"
                        id="address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                      />
                      <p className="text-2xs text-danger">
                        {formik.errors.address}
                      </p>
                    </div>
                    <div className="col-lg-12 form-group m-0">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="voucher"
                      >
                        Ai un voucher de reducere? Introdu-l aici:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Introduce voucherul tau aici"
                        id="voucher"
                        name="voucher"
                        value={voucher}
                        onChange={(e) => {
                          setVoucher(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-lg-12 form-group m-0 text-left">
                      <button
                        className="btn btn-dark"
                        type="button"
                        onClick={handleVoucher}
                        style={{ color: "white", marginTop: "15px" }}
                      >
                        Verifica voucher
                      </button>
                    </div>

                    <div className="col-lg-12 form-group m-0">
                      <br></br>
                      <label
                        className="text-small text-uppercase"
                        htmlFor="paymentMethod"
                      >
                        Selecteaza metoda de plata:
                      </label>
                      <select
                        className="form-control form-control-lg"
                        value={formik.values.paymentMethod}
                        onChange={formik.handleChange}
                        id="paymentMethod"
                        name="paymentMethod"
                      >
                        <option value=""></option>
                        <option value="Card">Card</option>
                        <option value="Ramburs">Ramburs</option>
                      </select>
                      <p className="text-2xs text-danger">
                        {formik.errors.paymentMethod}
                      </p>
                    </div>
                    {formik.values.paymentMethod === "Ramburs" ? (
                      <div className="col-lg-12 form-group m-0">
                        <button
                          className="btn btn-dark"
                          style={{ color: "white" }}
                          type="submit"
                        >
                          Plaseaza comanda
                        </button>
                      </div>
                    ) : formik.values.paymentMethod === "Card" ? (
                      <div className="col-lg-12 form-group m-0">
                        <button className="btn btn-dark" type="submit">
                          Catre plata
                        </button>
                      </div>
                    ) : null}
                  </div>
                </form>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 rounded-0 p-lg-4 bg-light">
                  <div className="card-body">
                    <h5 className="text-uppercase mb-4">Comanda ta</h5>
                    <ul className="list-unstyled mb-0">
                      {carts.map((item, index) => (
                        <div key={index}>
                          <li className="d-flex align-items-center justify-content-between">
                            <strong className="small font-weight-bold">
                              {item.product.name}
                            </strong>
                            <span className="text-muted small">
                              {item.quantity} x{" "}
                              {Math.round(
                                Math.round(
                                  Math.round(
                                    item.product.price -
                                      (item.product.price / 100) *
                                        item.product.promotionPercent
                                  )
                                ) -
                                  Math.round(
                                    (Math.round(
                                      Math.round(
                                        item.product.price -
                                          (item.product.price / 100) *
                                            item.product.promotionPercent
                                      )
                                    ) *
                                      discount) /
                                      100
                                  )
                              )}{" "}
                              RON
                            </span>
                          </li>
                          <li className="border-bottom my-2"></li>
                        </div>
                      ))}
                      <li className="d-flex align-items-center justify-content-between">
                        <strong className="text-uppercase small font-weight-bold">
                          Total
                        </strong>
                        <span>
                          {Math.round(
                            Math.round(cartTotalPrice) -
                              Math.round((cartTotalPrice * discount) / 100)
                          )}{" "}
                          RON
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {success && (
          <section className="py-5">
            <div className="p-5">
              <h1>Ai plasat comanda cu succes!</h1>
              <p style={{ fontSize: "1.2rem" }}>
                Verifica mail-ul pentru a vedea factura.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
