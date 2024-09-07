import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  login: false,
  user: {},
};

const identificationSlice = createSlice({
  name: 'IdentificationSlice',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.login = action.payload;
    },
    setUser: (state, action) => {
      state.user.username = action.payload.username;
      state.user.email = action.payload.email;
      state.user.password = action.payload.password;
    },
  },
});

export const { setLogin, setUser } = identificationSlice.actions;
export default identificationSlice.reducer;

export const selectUnLoginedUser = (state) => state.identification.user;
export const selectLoginValue = (state) => state.identification;
