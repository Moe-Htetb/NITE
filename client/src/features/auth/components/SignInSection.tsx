import SignInForm from "./SignInForm";

const SignInSection = () => {
  return (
    <section className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-gray-900 to-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="text-3xl font-bold bg-linear-to-r from-gray-900 to-black bg-clip-text text-transparent">
              WanderShop
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <SignInForm />
      </div>
    </section>
  );
};

export default SignInSection;
