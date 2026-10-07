"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { connectToDatabase } from "@/lib/db/mongodb";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";
import User from "@/models/User";

export type LoginState = {
  error?: string;
};

function getSafeRedirectPath(value: FormDataEntryValue | null) {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/";
}

export async function loginUser(
  previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Invalid login details.",
    };
  }

  const { email, password } = parsed.data;

  await connectToDatabase();

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    return {
      error: "Invalid email or password.",
    };
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    return {
      error: "Invalid email or password.",
    };
  }

  await createSession({
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const redirectTo = getSafeRedirectPath(
    formData.get("redirectTo")
  );

  redirect(redirectTo);
}