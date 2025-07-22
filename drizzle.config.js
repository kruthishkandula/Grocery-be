import { ENV } from "./src/config/env";

export default {
    schema: "./src/common/db/migrations/schema.ts",
    out: "./src/common/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: ENV.DATABASE_URL
    }
}