import { SignupRequestBody, SignupErrors } from "../types";
import { validateEmail, validatePassword } from "./helpers/auth";

export const validateSignupRequest = (body: SignupRequestBody): SignupErrors => {
  const errors: SignupErrors = {};

  if (!validateEmail(body.email)) {
    errors.email = "Invalid email format";
  }

  if (!validatePassword(body.password)) {
    errors.password =
      "Password must be at least 8 characters long and contain a number";
  }

  if (body.password !== body.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
