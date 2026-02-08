import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useForgotPasswordMutation } from "@/store/rtk/authApi";
import { toast } from "sonner";
import { emailSchema } from "@/schema/auth";
import type { ForgotPasswordFormValues } from "@/types/formInputs";
import { setCookie } from "react-use-cookie";
import { ArrowLeft, KeyRoundIcon, Mail, Loader2 } from "lucide-react";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(emailSchema),
  });

  // RTK Query mutation
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  // Form submission handler
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      console.log(data);

      const response = await forgotPassword({ email: data.email }).unwrap();
      console.log(response);

      toast.success(
        response.message || "Reset instructions sent to your email"
      );

      // Store email in cookie for OTP verification
      const info = {
        email: data.email,
        token: response.token,
      };
      setCookie("resetInfo", JSON.stringify(info));

      // Navigate to OTP verification page
      navigate("/verify-otp");
    } catch (error: any) {
      navigate("/");
      console.error("Error sending reset instructions:", error);
      toast.error(
        error.data?.message ||
          "Failed to send reset instructions. Please try again."
      );
    }
  };

  const submitting = isLoading || isSubmitting;

  return (
    <form
      className="space-y-6 max-w-100 mx-auto mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-center mb-2">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <KeyRoundIcon className="w-8 h-8 text-gray-800" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Reset your password
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          We'll send you a link to reset your password
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-300 placeholder-gray-400 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email address"
          />
          <Mail className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full bg-black text-white py-3.5 px-4 rounded-xl font-semibold transition duration-300 transform hover:scale-[1.02] active:scale-100 shadow-sm hover:shadow-md ${
          submitting ? "bg-gray-400 cursor-not-allowed" : "hover:bg-gray-800"
        }`}
      >
        {submitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
            Sending...
          </span>
        ) : (
          "Send reset instructions"
        )}
      </button>

      <div className="text-center pt-4 border-t border-gray-100">
        <Link to="/login">
          <button
            type="button"
            className="inline-flex items-center text-sm text-gray-600 hover:text-black font-medium transition duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to sign in
          </button>
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
