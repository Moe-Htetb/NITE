import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schema/auth";
import type { signInFormInputs } from "@/types/formInputs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/store/rtk/authApi";
import { toast } from "sonner";
import { setCookie } from "react-use-cookie";

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<signInFormInputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const rememberMeValue = watch("rememberMe");

  const onSubmit = async (data: signInFormInputs) => {
    try {
      const response = await login(data).unwrap();
      console.log(response);

      if (response.success) {
        toast.success("Login successful!");

        // Set cookie with remember me option

        setCookie("authInfo", JSON.stringify(response.user));

        // Navigate based on user role
        if (response.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error(
        error.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md border shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={errors.email ? "border-red-500" : ""}
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                {...register("password")}
                disabled={isLoading}
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
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me Checkbox - Fixed */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMeValue}
              onCheckedChange={(checked) =>
                setValue("rememberMe", checked as boolean)
              }
              disabled={isLoading}
            />
            <Label
              htmlFor="remember-me"
              className="text-sm font-normal text-gray-700 cursor-pointer"
            >
              Remember me
            </Label>
          </div>

          {/* Hidden input for react-hook-form to track rememberMe */}
          <input type="hidden" {...register("rememberMe")} />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800 text-white py-2"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-gray-900 hover:text-gray-700"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
