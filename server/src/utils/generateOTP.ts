import otpGenerator from "otp-generator";
export const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

export const generateOneTimeToken = () => {
  return otpGenerator.generate(30, {
    upperCaseAlphabets: true,
    lowerCaseAlphabets: true,
    specialChars: false,
    digits: true,
  });
};
