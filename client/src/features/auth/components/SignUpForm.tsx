import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schema/auth";
import type { registerFormInputs } from "@/types/formInputs";
import { useRegisterMutation } from "@/store/rtk/authApi";
import { toast } from "sonner";
import { Button } from "@base-ui/react";
import { useNavigate } from "react-router";
import { setCookie } from "react-use-cookie";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const SignUpForm = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<registerFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (data: registerFormInputs) => {
    try {
      const response = await registerUser(data).unwrap();
      console.log(response);
      reset();

      if (!response.success) {
        throw new Error();
      }

      const { confirm_password, ...userDataWithoutConfirm } = data;

      const userData = {
        ...userDataWithoutConfirm,
        token: response.token,
      };
      setCookie("userInfo", JSON.stringify(userData));

      navigate("/verify-otp");
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.data.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <FieldSet>
          <FieldGroup className="space-y-4">
            {/* Name Field */}
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <FieldDescription className="text-red-500">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            {/* Email Field */}
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <FieldDescription className="text-red-500">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>

            {/* Password Field */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  {...register("password")}
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <FieldDescription className="text-red-500">
                  {errors.password.message}
                </FieldDescription>
              )}
              <FieldDescription className="text-xs text-gray-500">
                Must be at least 6 characters with uppercase, number, and
                special character
              </FieldDescription>
            </Field>

            {/* Confirm Password Field */}
            <Field>
              <FieldLabel htmlFor="confirm_password">
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirm_password")}
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={toggleConfirmPasswordVisibility}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <FieldDescription className="text-red-500">
                  {errors.confirm_password.message}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-black text-white hover:bg-black/80 py-2 rounded-lg"
          >
            {isLoading ? "Processing..." : "Request OTP"}
          </Button>
        </FieldSet>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
