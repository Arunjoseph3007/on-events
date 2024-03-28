import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function migrateDB() {
  const sql = postgres(process.env.DATABASE_URL as string, { max: 1 });
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: "./migrations" });
  await sql.end();
}

migrateDB()
  .then(() => {
    console.log("Migration succesfull");
  })
  .catch((e) => {
    console.log("Migration unsuccesfull");
    console.log(e);
  });
