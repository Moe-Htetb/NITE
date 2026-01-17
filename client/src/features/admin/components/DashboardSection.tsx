import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StatsCard from "./StatsCard";
import RecentProductsTable from "./RecentProductsTable";
import QuickActions from "./QuickActions";
import ChartSection from "./ChartSection";

const DashboardSection = () => {
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
            value="0"
            icon="Package"
            description="All products in store"
            trend={null}
          />
          <StatsCard
            title="Total Categories"
            value="0"
            icon="Folder"
            description="Product categories"
            trend={null}
          />
          <StatsCard
            title="Featured Products"
            value="0"
            icon="Star"
            description="Currently featured"
            trend={null}
          />
          <StatsCard
            title="New Arrivals"
            value="0"
            icon="Sparkles"
            description="This month"
            trend={null}
          />
        </div>

        {/* Charts Section */}
        <ChartSection />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Products - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentProductsTable />
          </div>

          {/* Quick Actions - Takes 1 column */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
