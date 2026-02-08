import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { PasswordFormValues } from "@/types/formInputs";
import { passwordSchema } from "@/schema/user";
import { useAppDispatch } from "@/types/useRedux";
import { useUpdatePasswordMutation } from "@/store/rtk/userApi";
import { toast } from "sonner";
import { clearAuthInfo } from "@/store/authSlice";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "@/store/rtk/authApi";

const UpdatePasswordForm = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Initialize react-hook-form with destructuring
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdatePasswordMutation();
  const [logout] = useLogoutMutation();

  const handleSignOut = async () => {
    try {
      const response = await logout().unwrap();
      if (response.success) {
        dispatch(clearAuthInfo());
        navigate("/");
      }
    } catch (error) {
      toast.error("Error signing out. Please try again.");
    }
  };

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const response = await updatePassword({
        old_password: data.oldPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      }).unwrap();

      toast.success(response.message);
      await handleSignOut();
      reset();
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(
        error.data?.message || "Failed to update password. Please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-black mb-2">Update Password</h2>
        <p className="text-gray-600 mb-6">
          Please enter your current password and set a new one.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Old Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-800"
            >
              Old Password
            </label>
            <div className="relative">
              <input
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                {...register("oldPassword")}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.oldPassword ? "border-red-500" : "border-gray-300"
                } text-black bg-white`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
              >
                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-800"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                } text-black bg-white`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
            <div className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters with uppercase, lowercase,
              number, and special character.
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-800"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } text-black bg-white`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                isUpdatingPassword
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 text-white"
              } transition-colors duration-200`}
            >
              {isUpdatingPassword ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>

        {/* Password Requirements Info */}
        <div className="mt-6 p-4 bg-gray-100 rounded-md border border-gray-200">
          <h3 className="font-medium text-black mb-2">Password Requirements</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
              At least 8 characters long
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
              Contains at least one uppercase letter (A-Z)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
              Contains at least one lowercase letter (a-z)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
              Contains at least one number (0-9)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
              Contains at least one special character (!@#$%^&*, etc.)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
