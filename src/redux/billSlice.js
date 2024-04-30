import { createSlice } from "@reduxjs/toolkit";
const billSlice = createSlice({
  name: "bill",
  initialState: {
    fullName: "",
    address: "",
    phone: "",
    email: "",
    paymentMethod: "",
  },
  reducers: {
    setBill: (state, action) => {
      state.fullName = action.payload.fullName;
      state.address = action.payload.address;
      state.phone = action.payload.phone;
      state.email = action.payload.email;
      state.paymentMethod = action.payload.paymentMethod;
    },
    resetBill: (state) => {
      state.fullName = "";
      state.address = "";
      state.phone = "";
      state.email = "";
      state.paymentMethod = "";
    },
  },
});

export const { setBill, resetBill } = billSlice.actions;
export default billSlice.reducer;
