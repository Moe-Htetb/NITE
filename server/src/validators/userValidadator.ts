import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .trim()
    .escape(),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value) => {
      //   console.log("Password validation:", value); // Debug log

      if (!/(?=.*[A-Z])/.test(value)) {
        throw new Error("Password must contain at least one uppercase letter");
      }

      if (!/(?=.*\d)/.test(value)) {
        throw new Error("Password must contain at least one number");
      }

      if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) {
        throw new Error("Password must contain at least one special character");
      }

      return true;
    }),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

export const imageUploadValidation = [
  body("imageUrl").notEmpty().withMessage("Image is required"),
];

export const updateEmailValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid Email"),
];

export const updateNameValidation = [
  body("name").notEmpty().withMessage("Name is required"),
];

export const updatePasswordValidation = [
  body("old_password").notEmpty().withMessage("old password is required"),

  body("new_password")
    .isLength({ min: 6 })
    .withMessage("new_password must be at least 6 characters long")
    .custom((value) => {
      //   console.log("Password validation:", value); // Debug log

      if (!/(?=.*[A-Z])/.test(value)) {
        throw new Error("Password must contain at least one uppercase letter");
      }

      if (!/(?=.*\d)/.test(value)) {
        throw new Error("Password must contain at least one number");
      }

      if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) {
        throw new Error("Password must contain at least one special character");
      }

      return true;
    }),

  body("confirm_password")
    .notEmpty()
    .withMessage("confirm_password is required")
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

export const forgotPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),
];

export const verifyOtpValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),
  body("otp").notEmpty().withMessage("Otp is required"),
  body("token").notEmpty().withMessage("token is required"),
];
export const resetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),
  body("token").notEmpty().withMessage("token is required"),
  body("new_password")
    .isLength({ min: 6 })
    .withMessage("new_password must be at least 6 characters long")
    .custom((value) => {
      //   console.log("Password validation:", value); // Debug log

      if (!/(?=.*[A-Z])/.test(value)) {
        throw new Error("Password must contain at least one uppercase letter");
      }

      if (!/(?=.*\d)/.test(value)) {
        throw new Error("Password must contain at least one number");
      }

      if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) {
        throw new Error("Password must contain at least one special character");
      }

      return true;
    }),

  body("confirm_password")
    .notEmpty()
    .withMessage("confirm_password is required")
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
