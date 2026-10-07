import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error(
    "AUTH_SECRET is not defined in environment variables."
  );
}

const encodedKey = new TextEncoder().encode(secret);

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: "customer" | "admin";
};

export async function createSession(
  payload: SessionPayload
) {
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  const token = await new SignJWT({
    ...payload,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const cookieStore = await cookies();

  cookieStore.set("techsphere-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    "techsphere-session"
  )?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      encodedKey
    );

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete("techsphere-session");
}