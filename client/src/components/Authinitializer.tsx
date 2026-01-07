// components/AuthInitializer.tsx
import { useEffect } from "react";

import { refreshAuthFromCookie, setLoading } from "../store/authSlice";
import { useAppDispatch } from "@/types/product";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshAuthFromCookie());
    dispatch(setLoading(false));
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
