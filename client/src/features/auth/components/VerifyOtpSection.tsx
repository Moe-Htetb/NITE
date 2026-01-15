import VerifyOtpForm from "./VerifyOtpForm";
import { AlertTriangle } from "lucide-react";

const VerifyOtpSection = () => {
  return (
    <section className="min-h-screen bg-linear-to-br from-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-black to-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">WanderShop</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-200">
          <VerifyOtpForm />

          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="shrink-0 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Note:</span> The code will
                  expire in 2 minutes for security reasons. Make sure to verify
                  within the time limit.
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
