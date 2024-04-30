import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { checkoutProduct, sendMailCheckout } from "../services/API/checkoutApi";
import { createHistoryUser } from "../services/API/historyApi";
import queryString from "query-string";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const socket = io("http://localhost:3000");

export default function SuccessCardPayment(props) {
  const { carts, cartTotalPrice } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.auth.login);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const handleSuccess = async () => {
    for (let item of carts) {
      const params = {
        idProduct: item.product.id,
        productCount: item.quantity,
        paymentMethod: "Card",
      };
      const query = "?" + queryString.stringify(params);
      await checkoutProduct(dispatch, query, currentUser.token, currentUser.id);

      let final = Number(item.product.price);
      if (item.product.promotionPercent !== "") {
        final = Math.round(
          final - (final * Number(item.product.promotionPercent)) / 100
        );
      }
      final = Math.round(
        final * item.quantity -
          (final * item.quantity * localStorage.getItem("billVoucher")) / 100
      );
      const paramsHistory = {
        idUser: currentUser.id,
        phone: localStorage.getItem("billPhone"),
        address: localStorage.getItem("billAddress"),
        cart: `${currentUser.fullname}'s cart`,
        fullname: localStorage.getItem("billFullName"),
        total: final,
        paymentMethod: "Card",
        status: true,
        voucherPercentage: localStorage.getItem("billVoucher"),
      };
      await createHistoryUser(dispatch, paramsHistory);
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
    const voucherName = localStorage.getItem("billVoucherName");

    localStorage.removeItem("billVoucherName");
    localStorage.removeItem("billFullName");
    localStorage.removeItem("billEmail");
    localStorage.removeItem("billPhone");
    localStorage.removeItem("billAddress");
    localStorage.removeItem("billPaymentMethod");
    localStorage.removeItem("billVoucher");
    localStorage.removeItem("bill");
    if (voucherName !== null) {
      await axios.delete(
        `${process.env.REACT_APP_DOMAIN}/api/v1/vouchers/${voucherName}`
      );
    }
    console.log(obj);
    if (obj.fullName !== undefined) {
      //send data to server
      socket.emit("send_order", currentUser.id);
      await sendMailCheckout(dispatch, obj, currentUser.token);
      toast.success("Comanda a fost plasata cu succes!", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate("/");
    }
  };

  return (
    <div className="container">
      <section className="py-5">
        <div className="p-5">
          <h1>Comanda platita!</h1>
          <p style={{ fontSize: "1.2rem" }}>
            <button onClick={handleSuccess}>
              Apasa aici pentru a finaliza comanda si a primi mail-ul cu factura
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
