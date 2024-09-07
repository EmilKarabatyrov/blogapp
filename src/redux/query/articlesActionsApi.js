import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getToken = () => sessionStorage.getItem('token');

const articlesActionsApi = createApi({
  reducerPath: 'articlesActionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://blog.kata.academy/api/' }),
  endpoints: (build) => ({
    createArticle: build.mutation({
      query: (body) => ({
        url: 'articles',
        method: 'POST',
        body,
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
    }),
    deleteArticle: build.mutation({
      query: (slug) => ({
        url: `articles/${slug}`,
        method: 'DELETE',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
    }),
    favoriteAnArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
    }),
    noFavoriteAnArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
    }),
  }),
});
export default articlesActionsApi
