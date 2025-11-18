import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export type featureProduct = {
  id: number;
  product_name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
  description: string;
};

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
}>();
