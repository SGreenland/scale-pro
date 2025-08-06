export function hasFullAccess(): boolean {
  const token =
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1] || "";
  let parsedToken: { hasPremiumAccess: boolean } = { hasPremiumAccess: false };

  try {
    parsedToken = JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Error parsing token:", error);
    // If parsing fails, assume no premium access
    parsedToken.hasPremiumAccess = false;
  }

  if (!parsedToken || typeof parsedToken.hasPremiumAccess !== "boolean") {
    console.warn("Invalid token structure, defaulting to no premium access");
    parsedToken.hasPremiumAccess = false;
  }

  return parsedToken.hasPremiumAccess;
}
