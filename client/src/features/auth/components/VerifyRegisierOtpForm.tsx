import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { getCookie, removeCookie } from "react-use-cookie";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { otpFormInputs } from "@/types/formInputs";
import { otpSchema } from "@/schema/auth";
import {
  useVerifyRegisterOtpMutation,
  type VerifyRegisterOtpResponse,
} from "@/store/rtk/authApi";
import { ArrowLeft, Shield, Timer, Loader2 } from "lucide-react";

const VerifyRegisterOtpForm = () => {
  const userInfoCookie = getCookie("userInfo");
  const userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;
  console.log("User Info from cookie:", userInfo);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
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
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);

  const otpValue = watch("otp");

  useEffect(() => {
    if (otpValue && otpValue.length === 6) {
      setOtpDigits(otpValue.split(""));
    } else if (otpValue.length === 0) {
      setOtpDigits(["", "", "", "", "", ""]);
    }
  }, [otpValue]);

  // Timer effect
  useEffect(() => {
    let interval: number;

    if (isTimerActive && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    const newOtp = newOtpDigits.join("");
    setValue("otp", newOtp, { shouldValidate: true });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
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

    const lastFilledIndex = pasteData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 6) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const { ref: otpInputRef, ...otpRest } = register("otp");
  const [verifyRegisterOtp, { isLoading }] = useVerifyRegisterOtpMutation();

  const onSubmitHandler = async (otpData: otpFormInputs) => {
    try {
      console.log("User info from cookie:", userInfo);

      if (!userInfo || !userInfo.email || !userInfo.token) {
        toast.error(
          "Registration information not found. Please register again.",
        );
        navigate("/register");
        return;
      }

      const data = {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        otp: otpData.otp,
        token: userInfo.token,
      };

      console.log("Data sent to API:", data);

      const response: VerifyRegisterOtpResponse =
        await verifyRegisterOtp(data).unwrap();

      console.log("API Response:", response);

      if (!response.success) {
        toast.error(response.message || "OTP verification failed");
        return;
      }

      // Clear the temporary registration cookie
      removeCookie("userInfo");

      toast.success("Registration completed successfully!");

      // Navigate to login page
      setTimeout(() => {
        navigate("/login");
      }, 100);
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
      if (!userInfo || !userInfo.email) {
        toast.error("User information not found");
        return;
      }

      // You might want to implement a separate API endpoint for resending registration OTP
      // For now, we'll show a toast message
      toast.info("Resend OTP feature will be implemented soon");

      // Reset timer to 2 minutes
      setTimer(120);
      setIsTimerActive(true);
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  // Determine which email to display
  const displayEmail = userInfo?.email || "your email";

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-gray-800" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Complete your registration
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          We sent a 6-digit verification code to{" "}
          <span className="font-medium">{displayEmail}</span>
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
                    : "border-gray-300 focus:ring-black focus:border-black"
                }`}
                disabled={isSubmitting || isLoading}
              />
            ))}
          </div>

          {/* Error message */}
          {errors.otp && (
            <p className="mt-2 text-sm text-red-600">{errors.otp.message}</p>
          )}

          {/* Character counter */}
          <div className="mt-2 flex justify-between items-center">
            <span
              className={`text-xs ${
                otpValue.length === 6 ? "text-black" : "text-gray-500"
              }`}
            >
              {otpValue.length}/6 digits
            </span>
            {isTimerActive && (
              <div className="flex items-center text-xs text-gray-600">
                <Timer className="w-3 h-3 mr-1" />
                Expires in: {formatTime(timer)}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading || otpValue.length !== 6}
          className={`w-full py-3.5 px-4 rounded-xl font-semibold transition duration-300 shadow-sm hover:shadow-md ${
            isSubmitting || isLoading || otpValue.length !== 6
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-black hover:bg-gray-800 text-white"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 mr-3 animate-spin" />
              Verifying...
            </span>
          ) : (
            "Complete Registration"
          )}
        </button>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the code?
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isTimerActive}
              className={`ml-1 font-medium transition duration-300 ${
                isTimerActive
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black hover:text-gray-700"
              }`}
            >
              Resend code {isTimerActive && `(${formatTime(timer)})`}
            </button>
          </p>

          <div className="pt-4 border-t border-gray-100">
            <Link
              to="/signup"
              className="inline-flex items-center text-sm text-gray-600 hover:text-black font-medium transition duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifyRegisterOtpForm;
