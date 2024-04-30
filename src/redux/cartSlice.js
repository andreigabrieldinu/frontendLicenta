import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carts: [],
    cartTotalPrice: 0,
    cartToTalProduct: 0,
    listCarts: {
      allCarts: [],
      isFetching: false,
      isError: false,
    },
  },
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.carts.findIndex(
        (item) => item.product.id === action.payload.product.id
      );
      if (itemIndex !== -1) {
        if (
          state.carts[itemIndex].product.productQuantity <
          state.carts[itemIndex].quantity + 1
        ) {
          toast.error("Nu exista stocul necesar pentru adaugarea in cos", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        }
        toast.success("Ai adaugat cantitatea in cos", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        state.carts[itemIndex].quantity += 1;
      } else {
        const temProduct = { ...action.payload, quantity: 1 };
        state.carts.push(temProduct);
      }
    },
    addToCartBigQuantity: (state, action) => {
      const itemIndex = state.carts.findIndex(
        (item) => item.product.id === action.payload.product.id
      );
      const { quantity } = action.payload;
      if (itemIndex !== -1) {
        if (state.carts[itemIndex].product.productQuantity < quantity) {
          toast.error(
            `Puteti comanda maxim ${state.carts[itemIndex].product.productQuantity} bucati din ${state.carts[itemIndex].product.name}`,
            {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
          return;
        }
        toast.success(
          `Ai adaugat inca ${quantity} bucati de ${state.carts[itemIndex].product.name} `,
          {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );

        state.carts[itemIndex].quantity += quantity;
        state.cartToTalProduct += quantity;
        state.cartTotalPrice += quantity * action.payload.product.price;
      } else {
        const temProduct = {
          ...action.payload,
          quantity: action.payload.quantity,
        };
        if (temProduct.product.productQuantity < quantity) {
          toast.error(
            `Puteti comanda maxim ${temProduct.product.productQuantity} bucati din ${temProduct.product.name}`,
            {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
          return;
        }
        toast.success(
          `Ai adaugat ${temProduct.quantity} bucati de ${temProduct.product.name} in cos `,
          {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

            theme: "colored",
          }
        );
        state.carts.push(temProduct);
        state.cartToTalProduct += quantity;
        state.cartTotalPrice += quantity * action.payload.product.price;
      }
    },

    decrementItem: (state, action) => {
      const indexItem = state.carts.findIndex(
        (item) => item.product.id === action.payload.product.id
      );
      if (action.payload.quantity <= 1) {
        toast.warn("Cantitatea nu poate fi mai mica de 1", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      } else {
        toast.success("Cantitate diminuata cu succes", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        state.carts[indexItem].quantity -= 1;
      }
    },
    incrementItem: (state, action) => {
      const { product, quantity } = action.payload;
      const itemIndex = state.carts.findIndex(
        (item) => item.product.id === product.id
      );
      if (itemIndex !== -1) {
        if (
          state.carts[itemIndex].product.productQuantity <
          state.carts[itemIndex].quantity + quantity
        ) {
          toast.error("Nu exista stocul necesar pentru adaugarea in cos", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        }
        toast.success("Ai adaugat cantitatea in cos", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        state.carts[itemIndex].quantity += quantity;
        state.cartToTalProduct += quantity;
      } else {
        const temProduct = { ...action.payload, quantity };
        state.carts.push(temProduct);
        state.cartToTalProduct += quantity;
        toast.success("Ai adaugat produsul in cos.", {
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
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      const newCart = state.carts.filter((item) => item.product.id !== itemId);
      if (state.carts.length === 1) {
        return {
          ...state,
          carts: newCart,
          cartTotalPrice: 0,
          cartToTalProduct: 0,
        };
      } else {
        return { ...state, carts: newCart };
      }
    },
    showQuantity: (state, action) => {
      const { product, quantity } = action.payload;
      const indexItem = state.carts.findIndex((item) => item.id === product.id);
      state.carts[indexItem].quantity = quantity;
    },
    getTotalPrice: (state) => {
      const totalPrice = state.carts.reduce((total, product) => {
        return (
          total +
          Math.round(
            product.product.price -
              (product.product.promotionPercent * product.product.price) / 100
          ) *
            product.quantity
        );
      }, 0);
      const totalProduct = state.carts.reduce((total, product) => {
        return total + product.quantity;
      }, 0);

      if (totalPrice && totalProduct) {
        state.cartTotalPrice = totalPrice;
        state.cartToTalProduct = totalProduct;
      }
    },
    resetState: (state) => {
      state.carts = [];
      state.cartTotalPrice = 0;
      state.cartToTalProduct = 0;
    },
    getAllCartStart: (state) => {
      state.listCarts.isFetching = true;
    },
    getAllCartSuccess: (state, action) => {
      state.listCarts.isFetching = false;
      state.listCarts.allCarts = action.payload;
    },
    getAllCartFailed: (state) => {
      state.listCarts.isFetching = false;
      state.listCarts.isError = true;
    },
  },
});

export const {
  addToCart,
  addToCartBigQuantity,
  removeItem,
  getTotalPrice,
  decrementItem,
  incrementItem,
  showQuantity,
  resetState,
  getAllCartFailed,
  getAllCartSuccess,
  getAllCartStart,
} = cartSlice.actions;
export default cartSlice.reducer;
