import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getToken = () => sessionStorage.getItem('token');

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://blog.kata.academy/api/' }),
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (body) => ({
        url: 'users/login',
        method: 'POST',
        body,
      }),
    }),
    getUser: build.query({
      query: () => ({
        url: 'user',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),
  }),
});
export default userApi
