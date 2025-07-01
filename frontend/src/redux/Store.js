import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import recipeReducer from './reducers/recipeSlice'; // <== bunu sonra yazacağıq

const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
  },
});

export default store;
