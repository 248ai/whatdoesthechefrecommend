import { Pool, type PoolConfig } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable");
}

function getPoolConfig(): PoolConfig {
  return {
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

let pool: Pool;

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._pgPool) {
    global._pgPool = new Pool(getPoolConfig());
  }
  pool = global._pgPool;
} else {
  pool = new Pool(getPoolConfig());
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const result = await pool.query(text, params);
  return (result.rows[0] as T) || null;
}

export async function execute(
  text: string,
  params?: unknown[]
): Promise<number> {
  const result = await pool.query(text, params);
  return result.rowCount ?? 0;
}

export { pool };
export default pool;
