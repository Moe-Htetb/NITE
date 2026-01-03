import { Link } from "react-router";

const SignInForm = () => {
  return (
    <form className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
          placeholder="Enter your password"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>

        <Link to={"/forgot-password"}>
          <button className="text-sm text-emerald-600 hover:text-emerald-500 font-medium">
            Forgot password?
          </button>
        </Link>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition duration-300 transform hover:scale-105"
      >
        Sign in
      </button>

      <div className="text-center">
        <Link to={"/register"} className="text-sm text-gray-600">
          Don't have an account?
          <a
            href="#"
            className="text-emerald-600 hover:text-emerald-500 font-medium"
          >
            Sign up
          </a>
        </Link>
      </div>
    </form>
  );
};

export default SignInForm;
