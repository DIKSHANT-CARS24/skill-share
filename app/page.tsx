import { redirect, unauthorized } from "next/navigation";
import { getOptionalMemberContext } from "@/lib/auth";

export default async function Home() {
  const context = await getOptionalMemberContext();

  if (!context) {
    redirect("/login");
  }

  if (context.access === "granted") {
    redirect("/skills");
  }

  unauthorized();
}
