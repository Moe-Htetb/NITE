import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useAppSelector } from "@/types/useRedux";
import { selectAuthInfo, updateAuthInfo } from "@/store/authSlice";

import type { NameUpdateFormData } from "@/types/formInputs";
import { nameUpdateSchema } from "@/schema/user";
import { useUpdateUserNameMutation } from "@/store/rtk/userApi";
import { useAppDispatch } from "@/types/product";

const UpdateNameForm = () => {
  const userInfo = useAppSelector(selectAuthInfo);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
  } = useForm<NameUpdateFormData>({
    resolver: zodResolver(nameUpdateSchema),
    defaultValues: {
      name: userInfo?.name || "",
    },
  });

  const [updateName, { isLoading: isUpdating }] = useUpdateUserNameMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: NameUpdateFormData) => {
    console.log(data);

    try {
      const response = await updateName({ name: data.name }).unwrap();
      console.log(response);

      dispatch(updateAuthInfo({ name: data.name }));

      toast.success("Name updated successfully!");
      setIsSuccess(true);

      if (response.name) {
        reset({ name: response.name });
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(
        error?.data?.message || "Failed to update name. Please try again."
      );
    }
  };

  const handleBack = () => {
    if (isSuccess) {
      setIsSuccess(false);
    }
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
        <CardTitle className="text-2xl font-bold">Change Name</CardTitle>
      </CardHeader>

      <Separator className="bg-gray-200" />

      <CardContent className="pt-6">
        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">
              Name Updated Successfully!
            </h3>

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
            {/* Name Input */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-medium">
                New Name
              </Label>
              <Input
                id="name"
                type="text"
                autoFocus={true}
                {...register("name")}
                className={`border-gray-300 focus:border-black focus:ring-black ${
                  errors.name ? "border-red-500" : ""
                }`}
                disabled={isLoading || isUpdating}
                placeholder="Enter your new name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Must be 2-50 characters, letters and spaces only
              </p>
            </div>

            <Separator className="bg-gray-200" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
              <Link to="/profile" className="sm:w-1/3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-100 text-black"
                  disabled={isLoading || isUpdating}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="w-full sm:w-2/3 bg-black text-white hover:bg-gray-800"
                disabled={isLoading || isUpdating}
              >
                {isLoading || isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Name"
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdateNameForm;
