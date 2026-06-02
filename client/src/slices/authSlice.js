import { createSlice } from '@reduxjs/toolkit';

const stored = localStorage.getItem('ss-user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored ? JSON.parse(stored) : null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('ss-user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('ss-user');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;