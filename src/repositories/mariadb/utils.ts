import { Pool, RowDataPacket, FieldPacket } from "mysql2/promise";
import { logger } from "../../services/loggerService";

export async function queryWithLogging<T>(
  pool: Pool,
  sql: string,
  params: any[] = [],
  requestId?: string
): Promise<[T, FieldPacket[]]> { 
  const startTime = Date.now();
  try {
    const [rows, fields] = await pool.execute<RowDataPacket[]>(sql, params);
    const duration = Date.now() - startTime;

    logger.info("Database query executed", {
      requestId,
      sql,
      params,
      rowCount: rows.length,
      duration: `${duration}ms`,
    });

    return [rows as T, fields]; 
  } catch (error) {
    if (error instanceof Error) {
      const duration = Date.now() - startTime;
      logger.error("Database query failed", {
        requestId,
        sql,
        params,
        error: error.message,
        duration: `${duration}ms`,
      });
    }
    throw error;
  }
}
