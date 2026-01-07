import { redirect } from "next/navigation";

export default async function Home() {
  // Redirect to dashboard - ProtectedRoute will handle auth checks
  redirect("/dashboard");
}
