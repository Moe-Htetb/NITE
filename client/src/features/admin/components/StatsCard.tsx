import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  Folder,
  Star,
  Sparkles,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: "Package" | "Folder" | "Star" | "Sparkles";
  description: string;
  trend: { value: number; isPositive: boolean } | null;
}

const iconMap: Record<string, LucideIcon> = {
  Package,
  Folder,
  Star,
  Sparkles,
};

const StatsCard = ({
  title,
  value,
  icon,
  description,
  trend,
}: StatsCardProps) => {
  const IconComponent = iconMap[icon];

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
            <IconComponent className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-black">{value}</span>
            {trend && (
              <div
                className={`flex items-center space-x-1 text-sm ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <CardDescription className="text-xs text-gray-500">
            {description}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
