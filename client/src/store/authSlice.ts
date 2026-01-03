// store/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface IAuthInfo {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface IAuthState {
  authInfo: IAuthInfo | null;
}

const getAuthInfoFromCookie = (): IAuthInfo | null => {
  try {
    const authInfoCookie = Cookies.get("authInfo");
    const authTokenCookie = Cookies.get("token");
    const authData = { ...JSON.parse(authInfoCookie!), token: authTokenCookie };
    if (authInfoCookie) {
      return authData;
    }
    return null;
  } catch (error) {
    console.error("Error parsing authInfo cookie:", error);
    Cookies.remove("authInfo"); // Remove invalid cookie
    return null;
  }
};

const initialState: IAuthState = {
  authInfo: getAuthInfoFromCookie(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthInfo: (state, action: PayloadAction<IAuthInfo>) => {
      state.authInfo = action.payload;

      Cookies.set("authInfo", JSON.stringify(action.payload));
    },

    updateAuthInfo: (state, action: PayloadAction<Partial<IAuthInfo>>) => {
      if (state.authInfo) {
        state.authInfo = {
          ...state.authInfo,
          ...action.payload,
        };

        Cookies.set("authInfo", JSON.stringify(state.authInfo));
      }
    },

    clearAuthInfo: (state) => {
      state.authInfo = null;
      Cookies.remove("authInfo");
    },

    refreshAuthFromCookie: (state) => {
      state.authInfo = getAuthInfoFromCookie();
    },
  },
});

export const {
  setAuthInfo,
  updateAuthInfo,
  clearAuthInfo,
  refreshAuthFromCookie,
} = authSlice.actions;

export const selectAuthInfo = (state: { auth: IAuthState }) =>
  state.auth.authInfo;
export const selectIsAuthenticated = (state: { auth: IAuthState }) =>
  !!state.auth.authInfo;

export const selectUserEmail = (state: { auth: IAuthState }) =>
  state.auth.authInfo?.email;
export const selectUserName = (state: { auth: IAuthState }) =>
  state.auth.authInfo?.name;
export const selectUserId = (state: { auth: IAuthState }) =>
  state.auth.authInfo?.id;

export default authSlice.reducer;
