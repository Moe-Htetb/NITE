import { Outlet } from "react-router";

import { Suspense } from "react";
import PageLoading from "../components/PageLoading";
import Header from "../features/Home/components/Header";
import Footer from "../features/Home/components/Footer";
import CartSidebar from "../features/Home/components/CartSidebar";

const MainLayout = () => {
  return (
    <div className=" px-1 md:px-10 mx-auto flex flex-col min-h-screen  ">
      <Header />
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default MainLayout;
