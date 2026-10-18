
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload === "string" ||
      typeof payload.userId !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
    };
  } catch {
    return null;
  }
}
