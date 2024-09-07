import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  articles: [],
  offset: 1,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
  },
});
export const { setOffset, setArticles } = articlesSlice.actions;
export default articlesSlice.reducer;

export const selectArticles = (state) => state.articles;
