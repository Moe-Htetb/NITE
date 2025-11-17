import { Link } from "react-router";

const SignUpForm = () => {
  return (
    <form className="space-y-6">
      <div>
        <label
          htmlFor="Name"
          className="block   text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="Name"
          name="Name"
          type="text"
          autoComplete="given-name"
          required
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
          placeholder="John"
        />
      </div>

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
          placeholder="john@example.com"
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
          autoComplete="new-password"
          required
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
          placeholder="Create a password"
        />
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
          placeholder="Confirm your password"
        />
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the{" "}
          <a
            href="#"
            className="text-emerald-600 hover:text-emerald-500 font-medium"
          >
            Terms and Conditions
          </a>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition duration-300 transform hover:scale-105"
      >
        Create account
      </button>

      <div className="text-center">
        <Link to={"/sign-in"} className="text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="#"
            className="text-emerald-600 hover:text-emerald-500 font-medium"
          >
            Sign in
          </a>
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
