"use client";

import { UserContext } from "@/layout";
import NotFound from "@/not-found";
import { use } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = use(UserContext);

  if (!user) {
    return;
  }

  if (user && user.role !== "ADMIN") {
    return <NotFound />;
  }

  return children;
}
