  import { createSlice } from '@reduxjs/toolkit';
import { loadLocalStorageState } from '../utils/localstorage';

const locState=loadLocalStorageState();

const initialState = {
  user: locState || null,
  isAuthenticated: locState?.isAuthenticated? true : false,
  isLoading: false,
  error: null,
 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout(state) {
      state.user=null;
      state.isAuthenticated=false;
      state.isLoading =false;
      state.error=null;
    },
  },
});

export const { setUser, setLoading, setError, logout,setProfileData } = authSlice.actions;
export default authSlice.reducer;
