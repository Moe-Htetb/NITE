import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Package,
  Folder,
  Users,
  Settings,
  BarChart3,
  FileText,
  Download,
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: "Add Product",
      description: "Create a new product",
      variant: "default" as const,
    },
    {
      icon: Package,
      label: "Manage Products",
      description: "View all products",
      variant: "outline" as const,
    },
    {
      icon: Folder,
      label: "Categories",
      description: "Manage categories",
      variant: "outline" as const,
    },
    {
      icon: Users,
      label: "Users",
      description: "View all users",
      variant: "outline" as const,
    },
    {
      icon: BarChart3,
      label: "Analytics",
      description: "View reports",
      variant: "outline" as const,
    },
    {
      icon: FileText,
      label: "Reports",
      description: "Generate reports",
      variant: "outline" as const,
    },
    {
      icon: Download,
      label: "Export Data",
      description: "Download data",
      variant: "outline" as const,
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Configure store",
      variant: "outline" as const,
    },
  ];

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-black">
          Quick Actions
        </CardTitle>
        <CardDescription className="text-gray-600">
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                className={`w-full justify-start ${
                  action.variant === "default"
                    ? "bg-black text-white hover:bg-gray-800"
                    : "border-gray-300 text-black hover:bg-gray-100"
                }`}
              >
                <IconComponent className="h-4 w-4 mr-3" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{action.label}</span>
                  <span className="text-xs opacity-70">
                    {action.description}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
