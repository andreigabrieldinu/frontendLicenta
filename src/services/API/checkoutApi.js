import axios from "axios";
import {
  checkOutFailed,
  checkOutStart,
  checkOutSuccess,
  sendMailFailed,
  sendMailStart,
  sendMailSuccess,
} from "../../redux/checkoutSlice";

export const checkoutProduct = async (dispatch, params, accessToken, id) => {
  dispatch(checkOutStart());
  try {
    await axios.post(
      `${process.env.REACT_APP_DOMAIN}/api/v1/carts${params}`,
      id,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    dispatch(checkOutSuccess());
  } catch (err) {
    dispatch(checkOutFailed(err));
  }
};

export const sendMailCheckout = async (dispatch, user, accessToken) => {
  dispatch(sendMailStart());
  try {
    await axios.post(`${process.env.REACT_APP_DOMAIN}/api/v1/emails`, user, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    dispatch(sendMailSuccess());
  } catch (err) {
    dispatch(sendMailFailed(err));
  }
};

export const productsToStripe = async (
  dispatch,
  params,
  accessToken,
  voucher,
  id
) => {
  dispatch(checkOutStart());
  try {
    const payload = {
      voucher,
      id,
    };
    await axios
      .post(
        `${process.env.REACT_APP_DOMAIN}/api/v1/stripe/${params}`,
        payload,
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        window.location = res.data;
      });
    dispatch(checkOutSuccess());
  } catch (err) {
    console.log(err);
    dispatch(checkOutFailed(err));
  }
};
