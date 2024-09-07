import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    email: '',
    username: '',
    image: null,
  },
};

const loginedUserSlice = createSlice({
  name: 'loginedUserSlice',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user.email = action.payload.email;
      state.user.username = action.payload.username;
      state.user.image = action.payload.image;
    },
    removeUser: (state) => {
      state.user.email = null;
      state.user.username = null;
      state.user.image = null;
      sessionStorage.removeItem('token');
    },
  },
});

export const { setUser, removeUser } = loginedUserSlice.actions;
export default loginedUserSlice.reducer;

export const selectLoginedUser = (state) => state.loginedUser.user
