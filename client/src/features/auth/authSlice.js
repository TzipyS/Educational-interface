import { createSlice } from '@reduxjs/toolkit';

const getUserFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      _id: payload._id,
      username: payload.username,
      phone: payload.phone,
    };
  } catch {
    return null;
  }
};

const token = localStorage.getItem('token');
const user = token ? getUserFromToken(token) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,  
    user: user || null, 
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user || getUserFromToken(token);
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null; 
      localStorage.removeItem('token'); 
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
