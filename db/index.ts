import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle({
  connection: {
    // biome-ignore lint: use non-null assertion
    connectionString: process.env.DATABASE_URL!,
  },
});

export { db };
