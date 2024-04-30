import axios from "axios";
import {
  getHistoryFailed,
  getHistoryStart,
  getHistorySuccess,
  getListHistoryFailed,
  getListHistoryStart,
  getListHistorySucess,
} from "../../redux/historySlice";

export const createHistoryUser = async (dispatch, params) => {
  dispatch(getHistoryStart());
  try {
    await axios.post(`${process.env.REACT_APP_DOMAIN}/api/v1/history`, params);
    dispatch(getHistorySuccess());
  } catch (err) {
    dispatch(getHistoryFailed(err));
  }
};

export const getListHistoryUser = async (dispatch, params = "") => {
  dispatch(getListHistoryStart());
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_DOMAIN}/api/v1/history/${params}`
    );
    dispatch(getListHistorySucess(response.data));
  } catch (err) {
    dispatch(getListHistoryFailed());
  }
};

export const updateHistoryUser = async (dispatch, order, params) => {
  dispatch(getHistoryStart());
  try {
    await axios.put(
      `${process.env.REACT_APP_DOMAIN}/api/v1/history/${order}`,
      params
    );
    dispatch(getHistorySuccess());
  } catch (err) {
    dispatch(getHistoryFailed(err));
  }
};
