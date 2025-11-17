import { Link, useNavigate } from "react-router";

// ForgotPasswordForm.tsx
const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const onSubmitHandler = () => {
    navigate("/verify-otp");
  };
  return (
    <form
      className="space-y-6 max-w-[400px] mx-auto mt-10"
      onSubmit={onSubmitHandler}
    >
      <div className="text-center mb-2">
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
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 placeholder-gray-400"
            placeholder="Enter your email address"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute right-3 top-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition duration-300 transform hover:scale-[1.02] active:scale-100 shadow-sm hover:shadow-md"
      >
        Send reset instructions
      </button>

      <div className="text-center pt-4 border-t border-gray-100">
        <Link to={"/sign-in"}>
          {" "}
          <button className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 font-medium transition duration-300 group">
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
          </button>
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
