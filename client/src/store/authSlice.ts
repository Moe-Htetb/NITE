// store/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Remove token from interface since it's HTTP-only
interface IAuthInfo {
  id: string;
  name: string;
  email: string;
  role: string; // Add role if you need it
}

interface IAuthState {
  authInfo: IAuthInfo | null;
  isLoading: boolean; // Add loading state
}

const getAuthInfoFromCookie = (): IAuthInfo | null => {
  try {
    const authInfoCookie = Cookies.get("authInfo");

    if (!authInfoCookie) return null;

    const authData = JSON.parse(authInfoCookie);
    return authData;
  } catch (error) {
    console.error("Error parsing authInfo cookie:", error);
    Cookies.remove("authInfo");
    return null;
  }
};

const initialState: IAuthState = {
  authInfo: getAuthInfoFromCookie(),
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthInfo: (state, action: PayloadAction<IAuthInfo>) => {
      state.authInfo = action.payload;
      // Store only non-sensitive user info in cookie
      Cookies.set("authInfo", JSON.stringify(action.payload), {
        expires: 7, // 7 days
      });
    },

    updateAuthInfo: (state, action: PayloadAction<Partial<IAuthInfo>>) => {
      if (state.authInfo) {
        state.authInfo = {
          ...state.authInfo,
          ...action.payload,
        };

        Cookies.set("authInfo", JSON.stringify(state.authInfo), {
          expires: 7,
        });
      }
    },

    clearAuthInfo: (state) => {
      state.authInfo = null;
      Cookies.remove("authInfo");
      Cookies.remove("token");
    },

    refreshAuthFromCookie: (state) => {
      state.authInfo = getAuthInfoFromCookie();
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setAuthInfo,
  updateAuthInfo,
  clearAuthInfo,
  refreshAuthFromCookie,
  setLoading,
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
