import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { getCookie, removeCookie, setCookie } from "react-use-cookie";
import { useEffect, useRef, useState } from "react";

import { toast } from "sonner";
import type { otpFormInputs } from "@/types/formInputs";
import { otpSchema } from "@/schema/auth";
import {
  useVerifyRegisterOtpMutation,
  type VerifyRegisterOtpResponse,
} from "@/store/rtk/authApi";

const VerifyOtpForm = () => {
  const userInfoCookie = getCookie("userInfo");
  const userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<otpFormInputs>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const otpValue = watch("otp");

  // Sync otpDigits with form value
  useEffect(() => {
    if (otpValue && otpValue.length === 6) {
      setOtpDigits(otpValue.split(""));
    } else if (otpValue.length === 0) {
      setOtpDigits(["", "", "", "", "", ""]);
    }
  }, [otpValue]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    const newOtp = newOtpDigits.join("");
    setValue("otp", newOtp, { shouldValidate: true });

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "") // Remove non-digits
      .slice(0, 6)
      .split("");

    const newOtpDigits = ["", "", "", "", "", ""];
    pasteData.forEach((value, index) => {
      if (index < 6) {
        newOtpDigits[index] = value;
      }
    });

    setOtpDigits(newOtpDigits);
    const newOtp = newOtpDigits.join("");
    setValue("otp", newOtp, { shouldValidate: true });

    // Focus the last filled input
    const lastFilledIndex = pasteData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 6) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  // Register the hidden input for form submission
  const { ref: otpInputRef, ...otpRest } = register("otp");
  const [verifyRegisterMutation, { isLoading }] =
    useVerifyRegisterOtpMutation();

  const onSubmitHandler = async (otp: otpFormInputs) => {
    try {
      const data = { ...otp, ...userInfo };

      const response: VerifyRegisterOtpResponse = await verifyRegisterMutation(
        data
      ).unwrap();

      if (response.success) {
        toast.success("OTP verified successfully!");
        removeCookie("userInfo");
        setCookie("authInfo", JSON.stringify(response.user));
      }

      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

      setOtpDigits(["", "", "", "", "", ""]);
      setValue("otp", "");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error(error.data?.message || "Invalid OTP. Please try again.");

      setOtpDigits(["", "", "", "", "", ""]);
      setValue("otp", "");
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      // Example resend OTP API call
      // await resendOtp({ email: userInfo?.email, token }).unwrap();

      toast.success("New OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Enter verification code
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          We sent a 6-digit code to {userInfo?.email || "your email"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
        {/* Hidden input for form submission */}
        <input
          type="hidden"
          {...otpRest}
          ref={(e) => {
            otpInputRef(e);
          }}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Verification code
          </label>
          <div className="flex justify-between space-x-2" onPaste={handlePaste}>
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 transition duration-200 bg-white ${
                  errors.otp
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                }`}
                disabled={isSubmitting}
              />
            ))}
          </div>

          {/* Error message */}
          {errors.otp && (
            <p className="mt-2 text-sm text-red-600">{errors.otp.message}</p>
          )}

          {/* Character counter */}
          <div className="mt-2 text-right">
            <span
              className={`text-xs ${
                otpValue.length === 6 ? "text-emerald-600" : "text-gray-500"
              }`}
            >
              {otpValue.length}/6 digits
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full bg-emerald-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600 shadow-sm hover:shadow-md"
        >
          {isSubmitting ? "Verifying..." : "Verify code"}
        </button>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the code?
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isSubmitting}
              className="ml-1 text-emerald-600 hover:text-emerald-500 font-medium transition duration-300 disabled:opacity-50"
            >
              Resend code
            </button>
          </p>

          <div className="pt-4 border-t border-gray-100">
            <Link
              to="/sign-in"
              className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 font-medium transition duration-300 group"
            >
              <svg
                className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtpForm;
