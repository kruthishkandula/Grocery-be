import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../common/db/migrations/schema";
import { ENV } from "./env";

export const sql = neon(ENV.DATABASE_URL);

export const db = drizzle(sql, { schema });
