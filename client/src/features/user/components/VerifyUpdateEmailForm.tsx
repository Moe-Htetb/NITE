import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { getCookie, removeCookie } from "react-use-cookie";
import { useVerifyUpdateEmailMutation } from "@/store/rtk/userApi";
import { useLogoutMutation } from "@/store/rtk/authApi";
import { useAppDispatch } from "@/types/useRedux";
import { clearAuthInfo } from "@/store/authSlice";
import { emailUpdateOtpSchema } from "@/schema/user";
import type { verifyEmailOtpFormData } from "@/types/formInputs";

const VerifyUpdateEmailForm = () => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [emailData, setEmailData] = useState<{
    email: string;
    token: string;
  } | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<verifyEmailOtpFormData>({
    resolver: zodResolver(emailUpdateOtpSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const [verifyUpdateEmail, { isLoading: isVerifying }] =
    useVerifyUpdateEmailMutation();
  const [logout] = useLogoutMutation();

  const otpValue = watch("otp");

  // Read email and token from cookie on mount
  useEffect(() => {
    const cookieData = getCookie("updateEmailToken");
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        if (parsed.email && parsed.token) {
          setEmailData({ email: parsed.email, token: parsed.token });
        } else {
          toast.error(
            "Invalid email verification data. Please try updating your email again."
          );
          navigate("/profile/update-email");
        }
      } catch (error) {
        toast.error(
          "Error reading verification data. Please try updating your email again."
        );
        navigate("/profile/update-email");
      }
    } else {
      toast.error(
        "No verification data found. Please update your email first."
      );
      navigate("/profile/update-email");
    }
  }, [navigate]);

  // Sync OTP value with individual digits
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

  const handleRemoveToken = () => {
    removeCookie("updateEmailToken");
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAuthInfo());
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);

      dispatch(clearAuthInfo());
    }
  };

  // Function to relogin user (prepare function - user will implement logic)
  //   const handleRelogin = async (email: string) => {
  //     // TODO: Implement relogin logic
  //     // You'll need to get the password somehow (maybe from user input or stored securely)
  //     // Example structure:
  //     // try {
  //     //   const response = await login({ email, password: "..." }).unwrap();
  //     //   if (response.success) {
  //     //     dispatch(setAuthInfo(response.user));
  //     //     navigate("/");
  //     //   }
  //     // } catch (error: any) {
  //     //   toast.error(error.data?.message || "Login failed");
  //     // }
  //     // Reference to prepared functions/variables (to satisfy linter):
  //     void login;
  //     void setAuthInfo;
  //     console.log("Relogin with email:", email); // email parameter available for implementation
  //     toast.info("Please implement relogin logic");
  //   };

  const onSubmit = async (data: verifyEmailOtpFormData) => {
    if (!emailData) {
      toast.error("Email verification data not found");
      return;
    }

    try {
      const response = await verifyUpdateEmail({
        email: emailData.email,
        otp: data.otp,
        token: emailData.token,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Email verified successfully!");
        removeCookie("updateEmailToken");
        handleRemoveToken();
        await handleLogout();
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Invalid OTP. Please try again.");
      setOtpDigits(["", "", "", "", "", ""]);
      setValue("otp", "");
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = () => {
    toast.info("Resend OTP functionality - to be implemented");
  };

  const { ref: otpInputRef, ...otpRest } = register("otp");

  if (!emailData) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white text-black border border-gray-200">
        <CardContent className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-gray-600">Loading verification data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white text-black border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Link to="/profile/update-email">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-black hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
        </div>
        <CardTitle className="text-2xl font-bold">
          Verify Email Update
        </CardTitle>
        <CardDescription className="text-gray-600">
          Enter the 6-digit code sent to {emailData.email}
        </CardDescription>
      </CardHeader>

      <Separator className="bg-gray-200" />

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Hidden input for form submission */}
          <input
            type="hidden"
            {...otpRest}
            ref={(e) => {
              otpInputRef(e);
            }}
          />

          {/* Email Display */}
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Verifying email:</span>{" "}
              {emailData.email}
            </p>
          </div>

          {/* OTP Input Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Verification Code
            </label>
            <div
              className="flex justify-between space-x-2"
              onPaste={handlePaste}
            >
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
                  disabled={isSubmitting || isVerifying}
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
                  otpValue.length === 6 ? "text-green-600" : "text-gray-500"
                }`}
              >
                {otpValue.length}/6 digits
              </span>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-2">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={isSubmitting || isVerifying}
            >
              {isSubmitting || isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting || isVerifying}
                  className="text-blue-600 hover:text-blue-700 font-medium transition duration-300 disabled:opacity-50"
                >
                  Resend code
                </button>
              </p>
            </div>
          </div>

          {/* Security Notes */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-md border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">
              <ShieldAlert className="h-4 w-4 inline mr-2" />
              Important Information
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc pl-4">
              <li>After verification, you will be logged out</li>
              <li>You'll need to log in again with your new email</li>
              <li>The verification code expires after a certain time</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VerifyUpdateEmailForm;
