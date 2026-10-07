import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import User from "@/models/User";

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirectTo=/admin");
  }

  await connectToDatabase();

  const user = await User.findById(session.userId)
    .select("name email role")
    .lean();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  return {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as "admin",
  };
}