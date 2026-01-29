// Import React first to ensure it's available
import * as React from "react";

// Ensure React is on window before creating tRPC
if (typeof window !== 'undefined') {
  (window as any).React = (window as any).React || React;
}

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();
