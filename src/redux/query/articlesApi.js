import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getToken = () => sessionStorage.getItem('token');

const articlesApi = createApi({
  reducerPath: 'articlesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://blog.kata.academy/api/' }),
  endpoints: (build) => ({
    getArticles: build.query({
      query: ({ offset, limit }) => ({
        url: `articles?offset=${offset}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),
    getOneArticle: build.query({
      query: (slug) => ({
        url: `articles/${slug}`,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),
  }),
});
export default articlesApi
