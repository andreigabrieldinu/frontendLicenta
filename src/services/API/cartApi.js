import {
  getAllCartFailed,
  getAllCartSuccess,
  getAllCartStart,
} from "../../redux/cartSlice";
import axios from "axios";

export const getAllCarts = async (dispatch, token) => {
  dispatch(getAllCartStart());
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_DOMAIN}/api/v1/carts/`
    );
    dispatch(getAllCartSuccess(response.data));
  } catch (err) {
    dispatch(getAllCartFailed(err));
  }
};
