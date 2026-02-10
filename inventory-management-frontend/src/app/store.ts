import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import { productApi } from '../features/products/productApi';
import { rawMaterialApi } from '../features/rawMaterials/rawMaterialApi';
import { productRawMaterialApi } from '../features/productRawMaterials/productRawMaterialApi';
import { productionApi } from '../features/production/productionApi'; // Import productionApi

/**
 * Configures the Redux store for the application.
 * It combines reducers from different slices and integrates RTK Query APIs.
 */
export const store = configureStore({
  reducer: {
    // Reducer for basic product state (though currently unused, good practice for future expansion)
    products: productsReducer,
    // RTK Query API reducer for products
    [productApi.reducerPath]: productApi.reducer,
    // RTK Query API reducer for raw materials
    [rawMaterialApi.reducerPath]: rawMaterialApi.reducer,
    // RTK Query API reducer for product-raw material associations
    [productRawMaterialApi.reducerPath]: productRawMaterialApi.reducer,
    // RTK Query API reducer for production suggestions
    [productionApi.reducerPath]: productionApi.reducer,
  },
  // Adds API middleware to the store, enabling caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(rawMaterialApi.middleware)
      .concat(productRawMaterialApi.middleware)
      .concat(productionApi.middleware),
});

/**
 * Type definition for the entire Redux store state.
 * This is used for type-checking when selecting data from the store.
 */
export type RootState = ReturnType<typeof store.getState>;
/**
 * Type definition for the Redux store's dispatch function.
 * This is used for type-checking when dispatching actions.
 */
export type AppDispatch = typeof store.dispatch;

