import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

const ChartSection = () => {
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
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center space-y-2">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-gray-600">Chart will be displayed here</p>
              <p className="text-sm text-gray-500">
                Integrate your charting library
              </p>
            </div>
          </div>
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
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-gray-600">Chart will be displayed here</p>
              <p className="text-sm text-gray-500">
                Integrate your charting library
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartSection;
