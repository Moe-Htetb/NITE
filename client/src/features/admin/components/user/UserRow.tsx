import { Shield, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

interface UserRowProps {
  user: User;
}

const UserRow = ({ user }: UserRowProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <tr
      key={user._id}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 bg-gray-100">
            {user.profile && user.profile[0]?.url ? (
              <img
                src={user.profile[0].url}
                alt={user.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-black">{user.name}</p>
            <p className="text-sm text-gray-500">
              ID: {user._id.substring(0, 8)}...
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
      <td className="py-4 px-4">
        <Badge
          className={
            user.role === "admin"
              ? "bg-purple-100 text-purple-800 border-purple-200"
              : "bg-blue-100 text-blue-800 border-blue-200"
          }
        >
          <div className="flex items-center gap-1">
            {user.role === "admin" ? (
              <Shield className="h-3 w-3" />
            ) : (
              <UserIcon className="h-3 w-3" />
            )}
            <span className="capitalize">{user.role}</span>
          </div>
        </Badge>
      </td>
      <td className="py-4 px-4 text-sm text-gray-600">
        {formatDate(user.createdAt)}
      </td>
      <td className="py-4 px-4">
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Active
        </Badge>
      </td>
      {/* <td className="py-4 px-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 hover:bg-gray-100"
            onClick={() => {
              // View user details
              console.log("View user:", user._id);
            }}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 hover:bg-gray-100"
            onClick={() => {
              // Edit user
              console.log("Edit user:", user._id);
            }}
          >
            Edit
          </Button>
        </div>
      </td> */}
    </tr>
  );
};

export default UserRow;
