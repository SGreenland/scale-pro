export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}


export function validatePassword(password: string): boolean {
  // Example: Password must be at least 8 characters long and contain a number
  const re = /^(?=.*[0-9])(?=.{8,})/;
  return re.test(password);
}