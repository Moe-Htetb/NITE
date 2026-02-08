// store/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Remove token from interface since it's HTTP-only
export interface IAuthInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: string;
}

interface IAuthState {
  authInfo: IAuthInfo | null;
  isLoading: boolean; // Add loading state
}

// LocalStorage keys
const AUTH_INFO_KEY = "authInfo";
const TOKEN_KEY = "token";

const getAuthInfoFromStorage = (): IAuthInfo | null => {
  try {
    const authInfoStr = localStorage.getItem(AUTH_INFO_KEY);

    if (!authInfoStr) return null;

    const authData = JSON.parse(authInfoStr);
    return authData;
  } catch (error) {
    console.error("Error parsing authInfo from localStorage:", error);
    localStorage.removeItem(AUTH_INFO_KEY);
    return null;
  }
};

const initialState: IAuthState = {
  authInfo: getAuthInfoFromStorage(),
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthInfo: (state, action: PayloadAction<IAuthInfo>) => {
      state.authInfo = action.payload;
      // Store only non-sensitive user info in localStorage
      localStorage.setItem(AUTH_INFO_KEY, JSON.stringify(action.payload));
    },

    updateAuthInfo: (state, action: PayloadAction<Partial<IAuthInfo>>) => {
      if (state.authInfo) {
        state.authInfo = {
          ...state.authInfo,
          ...action.payload,
        };

        localStorage.setItem(AUTH_INFO_KEY, JSON.stringify(state.authInfo));
      }
    },

    clearAuthInfo: (state) => {
      state.authInfo = null;
      localStorage.removeItem(AUTH_INFO_KEY);
      localStorage.removeItem(TOKEN_KEY);
      // Optional: Clear all localStorage items related to auth
      // Object.keys(localStorage).forEach(key => {
      //   if (key.startsWith('auth_')) {
      //     localStorage.removeItem(key);
      //   }
      // });
    },

    refreshAuthFromStorage: (state) => {
      state.authInfo = getAuthInfoFromStorage();
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Optional: Add method to clear all auth-related storage
    clearAllAuthStorage: () => {
      localStorage.removeItem(AUTH_INFO_KEY);
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.clear(); // Also clear session storage if used
    },
  },
});

export const {
  setAuthInfo,
  updateAuthInfo,
  clearAuthInfo,
  refreshAuthFromStorage, // Renamed from refreshAuthFromCookie
  setLoading,
  clearAllAuthStorage, // Optional export
} = authSlice.actions;

export const selectAuthInfo = (state: { auth: IAuthState }) =>
  state.auth.authInfo;
export const selectIsAuthenticated = (state: { auth: IAuthState }) =>
  !!state.auth.authInfo;
export const selectIsLoading = (state: { auth: IAuthState }) =>
  state.auth.isLoading;

export const selectUserEmail = (state: { auth: IAuthState }) =>
  state.auth.authInfo?.email;
export const selectUserName = (state: { auth: IAuthState }) =>
  state.auth.authInfo?.name;
export const selectUserId = (state: { auth: IAuthState }) =>
  state.auth.authInfo?.id;
export const selectUserRole = (state: { auth: IAuthState }) =>
  state.auth.authInfo?.role;

export default authSlice.reducer;
