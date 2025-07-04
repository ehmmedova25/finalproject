import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerInfo: {
    name: "",
    phone: "",
    deliveryMethod: "pickup", 
    address: "",
    note: "",
  },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCustomerInfo: (state, action) => {
      state.customerInfo = action.payload;
    },
    clearCustomerInfo: (state) => {
      state.customerInfo = initialState.customerInfo;
    },
  },
});

export const { setCustomerInfo, clearCustomerInfo } = checkoutSlice.actions;
export default checkoutSlice.reducer;
