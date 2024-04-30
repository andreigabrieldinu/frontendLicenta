import axios from "axios";

import {
  getVoucherStart,
  getVoucherSuccess,
  getVoucherFailed,
} from "../../redux/voucherSlice";

export const getListVouchers = async (dispatch) => {
  dispatch(getVoucherStart());
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_DOMAIN}/api/v1/vouchers`
    );
    dispatch(getVoucherSuccess(response.data));
  } catch (err) {
    dispatch(getVoucherFailed(err));
  }
};
