import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, CheckCircle, ShieldAlert } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useAppSelector } from "@/types/useRedux";
import { selectAuthInfo, updateAuthInfo } from "@/store/authSlice";
import { useUpdateEmailMutation } from "@/store/rtk/userApi";
import { useAppDispatch } from "@/types/product";

import { emailUpdateSchema } from "@/schema/user";
import type { emailUpdateFormData } from "@/types/formInputs";

const UpdateEmailForm = () => {
  const userInfo = useAppSelector(selectAuthInfo);
  const [isSuccess, setIsSuccess] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<emailUpdateFormData>({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      email: userInfo?.email || "",
      // confirmEmail: "",
    },
  });

  const [updateEmail, { isLoading: isUpdating }] = useUpdateEmailMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: emailUpdateFormData) => {
    console.log("Email update data:", data);

    try {
      // Call API to update email (only email field needed)
      const response = await updateEmail({
        email: data.email,
      }).unwrap();

      console.log("Email update response:", response);

      // Update Redux state with new email
      dispatch(updateAuthInfo({ email: data.email }));

      toast.success(response.message || "Email updated successfully!");
      setIsSuccess(true);

      // Reset form with new email
      reset({
        email: data.email,
        // confirmEmail: data.email,
      });
    } catch (error: any) {
      console.error("Email update failed:", error);

      // Handle specific error cases
      if (error?.data?.requiresVerification) {
        setRequiresVerification(true);
        setNewEmail(data.email);
        toast.info("Verification email sent. Please check your inbox.");
      } else {
        toast.error(
          error?.data?.message || "Failed to update email. Please try again."
        );
      }
    }
  };

  const handleBack = () => {
    if (isSuccess || requiresVerification) {
      setIsSuccess(false);
      setRequiresVerification(false);
    }
  };

  const handleResendVerification = () => {
    // Implement resend verification logic here
    toast.info("Verification email resent. Please check your inbox.");
  };

  if (!userInfo) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white text-black border border-gray-200">
        <CardContent className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-gray-600">Loading user information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white text-black border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Link to="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-black hover:bg-gray-100"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
        </div>
        <CardTitle className="text-2xl font-bold">Change Email</CardTitle>
        <CardDescription className="text-gray-600">
          Update your email address
        </CardDescription>
      </CardHeader>

      <Separator className="bg-gray-200" />

      <CardContent className="pt-6">
        {requiresVerification ? (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <ShieldAlert className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">
              Verify Your New Email Address
            </h3>
            <p className="text-gray-600">
              We've sent a verification email to{" "}
              <span className="font-semibold">{newEmail}</span>
            </p>
            <p className="text-sm text-gray-500">
              Please check your inbox and click the verification link to
              complete the email update process. Your email will be updated
              after verification.
            </p>
            <div className="pt-4 space-y-3">
              <Link to="/profile">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-100 text-black"
                >
                  Return to Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </Button>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">
              Email Updated Successfully!
            </h3>
            <p className="text-gray-600">
              Your email has been updated to{" "}
              <span className="font-semibold">{watch("email")}</span>
            </p>
            <div className="pt-4">
              <Link to="/profile">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Return to Profile
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Email Display */}
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Current email:</span>{" "}
                {userInfo.email}
              </p>
            </div>

            {/* New Email Input */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium">
                New Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={`border-gray-300 focus:border-black focus:ring-black ${
                  errors.email ? "border-red-500" : ""
                }`}
                disabled={isSubmitting || isUpdating}
                placeholder="Enter your new email address"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Confirm Email Input
            <div className="space-y-3">
              <Label htmlFor="confirmEmail" className="text-base font-medium">
                Confirm New Email
              </Label>
              <Input
                id="confirmEmail"
                type="email"
                {...register("confirmEmail")}
                className={`border-gray-300 focus:border-black focus:ring-black ${
                  errors.confirmEmail ? "border-red-500" : ""
                }`}
                disabled={isSubmitting || isUpdating}
                placeholder="Re-enter your new email address"
              />
              {errors.confirmEmail && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.confirmEmail.message}
                </p>
              )}
            </div> */}

            <Separator className="bg-gray-200" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
              <Link to="/profile" className="sm:w-1/3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-100 text-black"
                  disabled={isSubmitting || isUpdating}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="w-full sm:w-2/3 bg-black text-white hover:bg-gray-800"
                disabled={isSubmitting || isUpdating}
              >
                {isSubmitting || isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Email"
                )}
              </Button>
            </div>

            {/* Security Notes */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-md border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">
                <ShieldAlert className="h-4 w-4 inline mr-2" />
                Important Information
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc pl-4">
                <li>You may need to verify the new email address</li>
                <li>Login credentials will be updated</li>
                <li>All notifications will be sent to the new email</li>
                <li>You might need to log in again with the new email</li>
              </ul>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdateEmailForm;
