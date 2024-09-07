import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getToken = () => sessionStorage.getItem('token');

const userActionsApi = createApi({
  reducerPath: 'userActionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://blog.kata.academy/api/' }),
  endpoints: (build) => ({
    createUser: build.mutation({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
    }),
    changeUser: build.mutation({
      query: (body) => ({
        url: 'user',
        method: 'PUT',
        body,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),
  }),
});
export default userActionsApi
