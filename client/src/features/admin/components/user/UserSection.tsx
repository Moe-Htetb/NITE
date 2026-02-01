import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import BreadCrumb from "@/components/BreadCrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersQuery } from "@/store/rtk/adminApi";
import { Skeleton } from "@/components/ui/skeleton";
import { debounce } from "lodash";
import UserRow from "./UserRow";
import type { User } from "@/types/user";

const UserSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("keyword") || "",
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get("keyword") || "",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    Number(searchParams.get("limit")) || 10,
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort_by") || "createdAt",
  );
  const [sortDirection, setSortDirection] = useState(
    searchParams.get("sort_direction") || "desc",
  );
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "all",
  );

  // Sync URL with state
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("keyword", searchQuery);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (itemsPerPage !== 10) params.set("limit", itemsPerPage.toString());
    if (sortBy !== "createdAt") params.set("sort_by", sortBy);
    if (sortDirection !== "desc") params.set("sort_direction", sortDirection);
    if (roleFilter !== "all") params.set("role", roleFilter);

    const newSearch = params.toString();
    const currentSearch = location.search.substring(1);

    if (newSearch !== currentSearch) {
      navigate(`?${newSearch}`, { replace: true });
    }
  }, [
    searchQuery,
    currentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    roleFilter,
    navigate,
    location.search,
  ]);

  // Debounced search
  const debouncedSearch = debounce((value: string) => {
    if (value !== searchQuery) {
      setSearchQuery(value);
      setCurrentPage(1);
    }
  }, 3000);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
    debouncedSearch.cancel();
  };

  // Cleanup debounce
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  // RTK Query for users
  const {
    data: usersData,
    isLoading,
    isFetching,
    error,
  } = useGetUsersQuery({
    keyword: searchQuery,
    role: roleFilter !== "all" ? roleFilter : "",
    page: currentPage,
    limit: itemsPerPage,
    sort_by: sortBy,
    sort_direction: sortDirection,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newLimit = parseInt(value, 10);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortDirection] = value.split("_");
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  // Format date

  // Table Skeleton Loader
  const TableSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border-b">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-6 space-y-6">
      <BreadCrumb currentPageTitle="Users" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Users</h1>
          <p className="text-gray-600 mt-1">Manage your user accounts</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchInput}
            onChange={handleSearchInputChange}
            className="pl-10 pr-10 border-gray-300 focus:border-black focus:ring-black"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Role:</span>
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-28 border-gray-300 focus:border-black focus:ring-black">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select
              value={`${sortBy}_${sortDirection}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-40 border-gray-300 focus:border-black focus:ring-black">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">Newest First</SelectItem>
                <SelectItem value="createdAt_asc">Oldest First</SelectItem>
                <SelectItem value="name_asc">Name: A to Z</SelectItem>
                <SelectItem value="name_desc">Name: Z to A</SelectItem>
                <SelectItem value="email_asc">Email: A to Z</SelectItem>
                <SelectItem value="email_desc">Email: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-black">
            All Users
            {isFetching && !isLoading && (
              <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin" />
            )}
          </CardTitle>
          {usersData && (
            <div className="text-sm text-gray-600">
              Showing {usersData.meta.from || 0} to {usersData.meta.to || 0} of{" "}
              {usersData.meta.total} users
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="py-12 text-center">
              <div className="text-red-600 mb-2">⚠️</div>
              <p className="text-gray-600">
                Error loading users. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="mt-4 border-gray-300 text-black hover:bg-gray-100"
              >
                Retry
              </Button>
            </div>
          ) : usersData?.data.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center space-y-3">
                <Users className="h-12 w-12 text-gray-400" />
                <p className="text-gray-600">
                  {searchQuery || roleFilter !== "all"
                    ? "No users found matching your criteria"
                    : "No users found"}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                        User
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                        Joined Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                        Status
                      </th>
                      {/* <th className="text-left py-3 px-4 text-sm font-semibold text-black">
                        Actions
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.data.map((user: User) => (
                      <UserRow key={user._id} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>

              {usersData && usersData.meta.total > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white"
                      disabled={isFetching}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={
                        !usersData.links.prev || currentPage === 1 || isFetching
                      }
                      className="border-gray-300 text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {usersData.meta.links
                        .filter((link: any) => {
                          if (
                            link.label.includes("Previous") ||
                            link.label.includes("Next")
                          ) {
                            return false;
                          }
                          const pageNum = parseInt(link.label);
                          if (isNaN(pageNum)) return false;
                          return (
                            pageNum === 1 ||
                            pageNum === usersData.meta.last_page ||
                            Math.abs(pageNum - currentPage) <= 1
                          );
                        })
                        .map((link: any, index: number, array: any[]) => {
                          const pageNum = parseInt(link.label);
                          const showEllipsisBefore =
                            index > 0 &&
                            array[index - 1].label !== "..." &&
                            parseInt(array[index - 1].label) !== pageNum - 1;

                          return (
                            <div key={link.label} className="flex items-center">
                              {showEllipsisBefore && (
                                <span className="px-2 text-gray-400">...</span>
                              )}
                              <Button
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                disabled={!link.url || isFetching}
                                className={
                                  link.active
                                    ? "bg-black text-white hover:bg-gray-800"
                                    : "border-gray-300 text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                }
                              >
                                {link.label}
                              </Button>
                            </div>
                          );
                        })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        !usersData.links.next ||
                        currentPage === usersData.meta.last_page ||
                        isFetching
                      }
                      className="border-gray-300 text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSection;
