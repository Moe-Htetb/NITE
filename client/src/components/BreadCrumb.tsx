import { type FC } from "react";

import { LuChevronLeft, LuChevronRight, LuHouse } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
interface BreadCrumbProps {
  currentPageTitle: string;
  links?: { title: string; path: string }[];
}

const BreadCrumb: FC<BreadCrumbProps> = ({ currentPageTitle, links }) => {
  const navigate = useNavigate();

  return (
    <div className=" flex items-center justify-between gap-3 mb-5  py-2">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex  items-center">
            <Link
              to="/"
              className="inline-flex gap-1 items-center text-sm font-medium text-gray-700 hover:text-blue-600 "
            >
              <LuHouse />
              Home
            </Link>
          </li>

          {links &&
            links.map((link, index) => (
              <li key={index} className="inline-flex  items-center">
                <Link
                  to={link.path}
                  className="inline-flex gap-1 items-center text-sm font-medium text-gray-700 hover:text-blue-600 "
                >
                  <LuChevronRight />
                  {link.title}
                </Link>
              </li>
            ))}

          <li aria-current="page">
            <div className="flex items-center">
              <LuChevronRight />

              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                {currentPageTitle}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      <div className=" flex items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className=" size-7 flex justify-center items-center text-sm font-medium bg-white border border-gray-200 first:rounded-s-lg last:rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
        >
          <LuChevronLeft />
        </button>
        <button
          type="button"
          onClick={() => navigate(1)}
          className=" size-7 flex justify-center items-center text-sm font-medium bg-white border border-gray-200 first:rounded-s-lg last:rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
        >
          <LuChevronRight />
        </button>
      </div>
    </div>
  );
};

export default BreadCrumb;
