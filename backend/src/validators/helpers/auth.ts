import jwt from "jsonwebtoken";

export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}


export function validatePassword(password: string): boolean {
  // Example: Password must be at least 8 characters long and contain a number
  const re = /^(?=.*[0-9])(?=.{8,})/;
  return re.test(password);
}

export function validateToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return typeof decoded === "object" && "userId" in decoded;
  } catch (error) {
    return false;
  }
}