import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordSection = () => {
  return (
    <section className="min-h-screen bg-linear-to-br from-white to-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-linear-to-br from-black to-gray-800 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">WanderShop</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white py-6 px-6 shadow-lg rounded-2xl border border-gray-200">
          <ForgotPasswordForm />
        </div>

        {/* Help Text */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                We'll send you an email with instructions to reset your
                password. The link will expire in 1 hour for security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordSection;
