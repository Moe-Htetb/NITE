import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartSectionProps {
  products?: any[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

// Mock data generation
const generateSalesData = (products?: any[]) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (!products || products.length === 0) {
    return days.map((day) => ({
      name: day,
      sales: Math.floor(Math.random() * 10000) + 5000,
      orders: Math.floor(Math.random() * 200) + 50,
    }));
  }

  return days.map((day) => {
    const baseSales = products.length * 100;
    const variation = Math.random() * 0.4 - 0.2;
    return {
      name: day,
      sales: Math.floor(baseSales * (1 + variation)),
      orders: Math.floor(products.length * 0.2 * (1 + variation)),
      avgPrice: Math.floor(Math.random() * 200) + 50,
    };
  });
};

const generateRevenueData = (products?: any[]) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (!products || products.length === 0) {
    return months.map((month, _) => ({
      name: month,
      revenue: Math.floor(Math.random() * 50000) + 20000,
      profit: Math.floor(Math.random() * 15000) + 5000,
      growth: Math.random() * 30 - 10,
    }));
  }

  return months.map((month, index) => {
    const baseRevenue = products.length * 500;
    const monthFactor = index < 6 ? 0.8 : 1.2;
    return {
      name: month,
      revenue: Math.floor(
        baseRevenue * monthFactor * (0.8 + Math.random() * 0.4),
      ),
      profit: Math.floor(
        baseRevenue * monthFactor * 0.3 * (0.8 + Math.random() * 0.4),
      ),
      growth: Math.random() * 25 - 5,
    };
  });
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-semibold text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {entry.name.includes("$")
              ? `$${entry.value.toLocaleString()}`
              : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartSection = ({
  products = [],
  loading = false,
  error = false,
  onRetry,
}: ChartSectionProps) => {
  const salesData = generateSalesData(products);
  const revenueData = generateRevenueData(products);

  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const avgDailySales = Math.floor(totalSales / salesData.length);
  const revenueGrowth = revenueData[revenueData.length - 1]?.growth || 0;

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-black">
                  Sales Overview
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Failed to load data
                </CardDescription>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 min-h-50 flex flex-col items-center justify-center border-2 border-dashed border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-gray-700 mb-2">Failed to load chart data</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
                >
                  Retry
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-black">
                  Revenue Trend
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Failed to load data
                </CardDescription>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 min-h-50 flex flex-col items-center justify-center border-2 border-dashed border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-gray-700 mb-2">Failed to load chart data</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
                >
                  Retry
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg min-h-50" />
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg min-h-50" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Chart */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-black">
                Sales Overview
              </CardTitle>
              <CardDescription className="text-gray-600">
                Last 7 days performance
                {products.length > 0 && (
                  <span className="ml-2 text-green-600">
                    • ${avgDailySales.toLocaleString()} daily avg
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 min-h-50 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={300}
              minHeight={200}
            >
              <BarChart
                data={salesData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="sales"
                  name="Sales ($)"
                  fill="#000000"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#9ca3af"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {products.length === 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Using demo data. Connect to your data source for real insights.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-black">
                Revenue Trend
              </CardTitle>
              <CardDescription className="text-gray-600">
                Monthly revenue analysis
                {revenueGrowth !== 0 && (
                  <span
                    className={`ml-2 ${revenueGrowth > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    • {revenueGrowth > 0 ? "↗" : "↘"}{" "}
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 min-h-50 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={300}
              minHeight={200}
            >
              <AreaChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit ($)"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="growth"
                  name="Growth (%)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {products.length === 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Using demo data. Connect to your data source for real insights.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartSection;
