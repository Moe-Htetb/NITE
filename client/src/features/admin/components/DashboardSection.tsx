import { Separator } from "@/components/ui/separator";
import StatsCard from "./StatsCard";
// import RecentProductsTable from "./RecentProductsTable";
// import QuickActions from "./QuickActions";
import ChartSection from "./ChartSection";
import { useGetProductsQuery } from "@/store/rtk/productApi";
import DashboardSkeleton from "./DashboardSkeleton"; // You'll need to create this
import { AlertCircle } from "lucide-react"; // For error icon

const DashboardSection = () => {
  const { data, isLoading, error } = useGetProductsQuery({
    limit: 100,
    page: 1,
  });

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          </div>
          <Separator className="bg-gray-200" />

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load dashboard data
            </h2>
            <p className="text-gray-600 max-w-md">
              {error && "status" in error
                ? `Error ${error.status}: ${JSON.stringify(error.data)}`
                : "An unexpected error occurred. Please try again later."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats - safely handle undefined/null data
  const products = data?.data || [];
  const totalProducts = products.length;
  const featuredProducts = products.filter(
    (product) => product.is_feature,
  ).length;
  const newArrivals = products.filter(
    (product) => product.is_new_arrival,
  ).length;
  const inStockProducts = products.filter(
    (product) => product.instock_count > 0,
  ).length;

  return (
    <div className="bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        <Separator className="bg-gray-200" />

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={totalProducts.toString()}
            icon="Package"
            description="All products in store"
            trend={null}
            loading={isLoading}
          />
          <StatsCard
            title="Total Instock"
            value={inStockProducts.toString()}
            icon="Folder"
            description="Product Instock"
            trend={null}
            loading={isLoading}
          />
          <StatsCard
            title="Featured Products"
            value={featuredProducts.toString()}
            icon="Star"
            description="Currently featured"
            trend={null}
            loading={isLoading}
          />
          <StatsCard
            title="New Arrivals"
            value={newArrivals.toString()}
            icon="Sparkles"
            description="This month"
            trend={null}
            loading={isLoading}
          />
        </div>

        {/* Charts Section */}
        <ChartSection products={products} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Products - Takes 2 columns */}
          <div className="lg:col-span-2">
            {/* <RecentProductsTable products={products.slice(0, 10)} /> */}
          </div>

          {/* Quick Actions - Takes 1 column */}
          {/* <div className="lg:col-span-1">
            <QuickActions />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
