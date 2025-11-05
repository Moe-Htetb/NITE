// Helper function to check OTP limits
export const checkOtpLimit = (
  isSameDate: boolean,
  errorCount: number,
  count: number
) => {
  if (isSameDate && count >= 3) {
    throw new Error(
      "OTP is allowed to request for 3 times, try again tomorrow"
    );
  }

  if (errorCount >= 5) {
    throw new Error("Too many failed attempts, please try again later");
  }
};
