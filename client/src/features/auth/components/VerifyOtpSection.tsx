import VerifyOtpForm from "./VerifyOtpForm";

const VerifyOtpSection = () => {
  return (
    <section className="min-h-screen bg-linear-to-br from-emerald-50 to-cyan-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              WanderShop
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to your email
          </p>
          <p className="mt-1 text-sm font-medium text-gray-700">
            john@example.com
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
          <VerifyOtpForm />

          <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  The code will expire in{" "}
                  <span className="font-semibold">2:00</span> minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyOtpSection;
