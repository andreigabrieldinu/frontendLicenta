import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutUserFailed,
  logoutUserStart,
  logoutUserSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "../../redux/authSlice";

import axios from "axios";
import { toast } from "react-toastify";

export const loginUser = async (dispatch, navigate, user) => {
  dispatch(loginStart());
  try {
    await axios
      .post(`${process.env.REACT_APP_DOMAIN}/api/v1/users/login`, user)
      .then((resp) => {
        dispatch(loginSuccess(resp.data));
        navigate("/");
        toast.success("Autentificat", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((err) => {
        dispatch(loginFailed(err));
        toast.error("Email sau parola incorecta", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  } catch (err) {
    dispatch(loginFailed(err));
  }
};

export const registerUser = async (dispatch, navigate, user) => {
  dispatch(registerStart());
  try {
    axios
      .post(`${process.env.REACT_APP_DOMAIN}/api/v1/users/register`, user)
      .then(
        (response) => {
          dispatch(registerSuccess());
          navigate("/login");
          toast.success("Inregistrarea s-a efectuat", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        },
        (error) => {
          //error data
          if (error.response.data.msg === "Email already exists") {
            toast.error("Acest email este rezervat deja altui cont", {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } else if (error.response.data.msg === "You are not old enough") {
            toast.error("Trebuie sa ai minim 18 ani ca sa te inregistrezi", {
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
        }
      );
  } catch (err) {
    dispatch(registerFailed(err.response.data));
  }
};

export const logoutUser = async (
  dispatch,
  id,
  accessToken,
  navigate,
  axiosJWT
) => {
  dispatch(logoutUserStart());
  try {
    await axiosJWT.post(
      `${process.env.REACT_APP_DOMAIN}/api/v1/users/logout`,
      id,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    dispatch(logoutUserSuccess());
    localStorage.clear();
    navigate("/");
  } catch (err) {
    dispatch(logoutUserFailed(err));
  }
};
