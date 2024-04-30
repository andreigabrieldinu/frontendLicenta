import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../../services/API/authApi";
import { toast } from "react-toastify";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      phone: "",
      birthDate: "",
    },
    validationSchema: Yup.object().shape({
      fullname: Yup.string().required("(*) Numele nu trebuie sa fie gol"),
      email: Yup.string()
        .required("(*) Mail-ul nu trebuie sa fie gol")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email invalid"
        ),
      password: Yup.string()
        .required("(*) Parola trebuie sa fie introdusa")
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
          "Parola trebuie sa contina cel putin o litera mare, un caracter special si sa fie intre 8 si 32 de caractere"
        )
        .max(32),
      phone: Yup.string()
        .required("(*) Numarul de telefon trebuie sa fie introdus")
        .matches(
          /^(?:\d{10}|\+\d{10,11})$/,
          "Numarul de telefon trebuie sa aiba 10 cifre sau sa fie introdus in formatul +40721234567"
        ),
      birthDate: Yup.string()
        .required("(*) Data de nastere este obligatorie")
        .matches(
          /^\d{4}-\d{2}-\d{2}$/,
          "Data trebuie introdusa in formatul `YYYY-MM-DD`"
        ),
    }),
    onSubmit: async (value) => {
      await registerUser(dispatch, navigate, value);
    },
  });

  return (
    <div className="limiter">
      <div className="container-login100">
        <form onSubmit={formik.handleSubmit}>
          <div className="wrap-login100">
            <span className="login100-form-title mt-5">Inregistrare</span>
            <div className="d-flex justify-content-center pb-5"></div>
            <div className="wrap-input100">
              <input
                name="fullname"
                className="input100"
                type="text"
                placeholder="Numele intreg"
                onChange={formik.handleChange}
              />
              {formik.errors.fullname && formik.touched.fullname ? (
                <div className="text-danger">{formik.errors.fullname}</div>
              ) : null}
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                placeholder="Email"
                name="email"
                onChange={formik.handleChange}
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="text-danger">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="password"
                placeholder="Parola"
                name="password"
                onChange={formik.handleChange}
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="text-danger">{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                placeholder="Telefon"
                name="phone"
                onChange={formik.handleChange}
              />
              {formik.errors.phone && formik.touched.phone ? (
                <div className="text-danger">{formik.errors.phone}</div>
              ) : null}
            </div>
            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                placeholder="Data nasterii"
                name="birthDate"
                onChange={formik.handleChange}
              />
              {formik.errors.birthDate && formik.touched.birthDate ? (
                <div className="text-danger">{formik.errors.birthDate}</div>
              ) : null}
            </div>

            <button className="login100-form-btn" type="submit">
              Inregistrare
            </button>

            <div className="text-center py-4">
              <span className="txt1">Login?</span>
              &nbsp;
              <NavLink to="/login" className="txt2">
                Click aici
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
