//
// FILE: app/api/auth/[...nextauth]/route.ts
// This file's only job is to re-export the handlers from our main auth.ts file.
//
import { handlers } from "@/auth";
export const { GET, POST } = handlers;