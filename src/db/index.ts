import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Local development falls back to a SQLite file; production points at Turso.
export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL ?? "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  schema,
});
