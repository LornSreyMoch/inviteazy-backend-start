import { Pool } from "pg";

export const connectPostgresDb = (): Pool => {
  const pool = new Pool({
    user: "sornmonika",
    host: "localhost",
    database: "koka",
    password: "12345678",
    port: 5433,
  });
  return pool;
};
