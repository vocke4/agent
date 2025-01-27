"use client";

import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <div className="p-4">
      <Loader2 className="h-5 w-5 animate-spin text-red-500" />
      <p>It works!</p>
    </div>
  );
}
