import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, CheckCircle, Loader2 } from "lucide-react";
import { resetPasswordSchema } from "@/schema/auth";
import type { ResetPasswordFormValues } from "@/types/formInputs";
import { useResetPasswordMutation } from "@/store/rtk/authApi";
import { getCookie, removeCookie } from "react-use-cookie";

const ResetPasswordForm = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const newPassword = watch("newPassword");

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;

    return Math.min(strength, 100);
  };

  // Handle password strength calculation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const strength = calculatePasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  // Form submission handler
  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      // Get user info from cookie
      const userInfo = getCookie("userInfo");
      const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;

      if (!parsedUserInfo?.email || !parsedUserInfo?.token) {
        toast.error("Session expired. Please try again.");
        navigate("/forgot-password");
        return;
      }

      const response = await resetPassword({
        email: parsedUserInfo.email,
        token: parsedUserInfo.token,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      }).unwrap();

      console.log("Reset password response:", response);

      // Clear the cookie after successful reset
      removeCookie("userInfo");

      toast.success("Password reset successfully!");

      // Navigate to login page
      navigate("/login");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(
        error.data?.message || "Failed to reset password. Please try again."
      );
    }
  };

  // Password strength indicator color
  const getStrengthColor = (strength: number) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength >= 70) return "Strong";
    if (strength >= 30) return "Medium";
    return "Weak";
  };

  const submitting = isLoading || isSubmitting;

  return (
    <form
      className="space-y-6 max-w-md mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-gray-800" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Create new password
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      {/* New Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            {...register("newPassword", {
              onChange: handlePasswordChange,
            })}
            className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-300 placeholder-gray-400 ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your new password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
          >
            {showNewPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getStrengthColor(
                  passwordStrength
                )}`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>Password strength</span>
              <span>{getStrengthText(passwordStrength)}</span>
            </div>
          </div>
        )}

        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-2">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-300 placeholder-gray-400 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Confirm your new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-2">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Password Requirements */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h4 className="text-sm font-medium text-gray-800 mb-3">
          Password Requirements
        </h4>
        <ul className="space-y-2">
          {[
            {
              text: "At least 8 characters",
              test: (pwd: string) => pwd.length >= 8,
            },
            {
              text: "At least one uppercase letter (A-Z)",
              test: (pwd: string) => /[A-Z]/.test(pwd),
            },
            {
              text: "At least one lowercase letter (a-z)",
              test: (pwd: string) => /[a-z]/.test(pwd),
            },
            {
              text: "At least one number (0-9)",
              test: (pwd: string) => /[0-9]/.test(pwd),
            },
            {
              text: "At least one special character",
              test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
            },
          ].map((req, index) => (
            <li key={index} className="flex items-center text-sm">
              {req.test(newPassword) ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-gray-300 mr-2" />
              )}
              <span
                className={
                  req.test(newPassword) ? "text-green-600" : "text-gray-600"
                }
              >
                {req.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-3.5 px-4 rounded-xl font-semibold transition duration-300 transform hover:scale-[1.02] active:scale-100 shadow-sm hover:shadow-md ${
          submitting
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-black hover:bg-gray-800 text-white"
        }`}
      >
        {submitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
            Resetting password...
          </span>
        ) : (
          "Reset Password"
        )}
      </button>

      {/* Back to Login */}
      <div className="text-center pt-4 border-t border-gray-100">
        <Link to="/login">
          <button
            type="button"
            className="inline-flex items-center text-sm text-gray-600 hover:text-black font-medium transition duration-300"
          >
            Back to sign in
          </button>
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
