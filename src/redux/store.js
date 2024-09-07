import { configureStore } from '@reduxjs/toolkit';

import articlesApi from './query/articlesApi';
import userActionsApi from './query/userActionsApi';
import userApi from './query/userApi';
import articlesActionsApi from './query/articlesActionsApi';
import articlesReducer from './slices/articlesSlice';
import identificationReducer from './slices/identificationSlice';
import loginedUserReducer from './slices/loginedUserSlice';

const store = configureStore({
  reducer: {
    [articlesApi.reducerPath]: articlesApi.reducer,
    [userActionsApi.reducerPath]: userActionsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [articlesActionsApi.reducerPath]: articlesActionsApi.reducer,
    articles: articlesReducer,
    identification: identificationReducer,
    loginedUser: loginedUserReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    articlesApi.middleware,
    userActionsApi.middleware,
    userApi.middleware,
    articlesActionsApi.middleware,
  ),
});
export default store
