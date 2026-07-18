import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface AuthResult {
  user: { id: string; email: string; role: string } | null;
  error: { status: number; body: object } | null;
}

/**
 * Verifies the backend-issued JWT sent as `Authorization: Bearer <token>`.
 * Returns the parsed payload if valid.
 */
export async function getAuthedUser(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return { user: null, error: { status: 401, body: { error: "Unauthorized", message: "Missing Authorization header." } } };
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return { user: null, error: { status: 401, body: { error: "Unauthorized", message: "Invalid or expired token." } } };
  }

  const profile = await prisma.profile.findUnique({
    where: { id: decoded.sub },
    select: { id: true, email: true, role: true },
  });

  if (!profile) {
    return { user: null, error: { status: 401, body: { error: "Unauthorized", message: "No profile found for this user." } } };
  }

  return { user: profile, error: null };
}

/**
 * Checks the authed user's role against a list of allowed roles.
 * Returns the same 403 shape the frontend expects.
 */
export function checkRole(userRole: string, ...allowedRoles: string[]) {
  if (!allowedRoles.includes(userRole)) {
    return {
      status: 403,
      body: {
        error: "Forbidden",
        message: "You do not have permission to access this resource.",
        requiredRole: allowedRoles.length === 1 ? allowedRoles[0] : allowedRoles,
        userRole,
      },
    };
  }
  return null;
}
