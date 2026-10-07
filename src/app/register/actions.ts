"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { connectToDatabase } from "@/lib/db/mongodb";
import { createSession } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validations/auth";
import User from "@/models/User";

export type RegisterState = {
  error?: string;
};

export async function registerUser(
  previousState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Invalid registration data.",
    };
  }

  const { name, email, password } = parsed.data;

  await connectToDatabase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return {
      error: "An account with this email already exists.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "customer",
  });

  await createSession({
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const redirectValue = formData.get("redirectTo");

const redirectTo =
  typeof redirectValue === "string" &&
  redirectValue.startsWith("/") &&
  !redirectValue.startsWith("//")
    ? redirectValue
    : "/";

redirect(redirectTo);
}