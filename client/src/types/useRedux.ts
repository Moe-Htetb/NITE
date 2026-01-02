import type { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

//use this hook instead of plain `useDispatch` and `useSelector` to get type safety and autocompletion.
//typescript don't know the types of your state and dispatch by default.
//use  useAppSelector instead of useSelector to know counter state
//use  useAppDispatch instead of useDispatch to know dispatch types
