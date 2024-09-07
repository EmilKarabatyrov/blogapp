import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const articlesApi = createApi({
  reducerPath: 'articlesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://blog.kata.academy/api/' }),
  endpoints: (build) => ({
    getArticles: build.query({
      query: ({ offset, limit }) => `articles?offset=${offset}&limit=${limit}`,
    }),
    getOneArticle: build.query({
      query: (slug) => `articles/${slug}`,
    }),
  }),
});
export default articlesApi
