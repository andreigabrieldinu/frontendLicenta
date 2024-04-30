import axios from "axios";
import {
  getListMessageFailed,
  getListMessageStart,
  getListMessageSuccess,
  sendMessengerFailed,
  sendMessengerStart,
  sendMessengerSuccess,
} from "../../redux/messengerSlice";

export const createMessage = async (dispatch, params) => {
  dispatch(sendMessengerStart());
  try {
    await axios.post(
      `${process.env.REACT_APP_DOMAIN}/api/v1/messengers`,
      params
    );
    dispatch(sendMessengerSuccess());
  } catch (err) {
    dispatch(sendMessengerFailed(err));
  }
};

export const getListMessage = async (dispatch, params) => {
  dispatch(getListMessageStart());
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_DOMAIN}/api/v1/messengers${params}`
    );
    dispatch(getListMessageSuccess(response.data));
  } catch (err) {
    dispatch(getListMessageFailed(err));
  }
};
