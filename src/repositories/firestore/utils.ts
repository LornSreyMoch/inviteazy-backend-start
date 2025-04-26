import { Firestore } from "firebase-admin/firestore";

export async function queryWithLogging<T>(
  operation: () => Promise<T>,
  info: { type: string; collection: string; details?: any }
): Promise<T> {
  const start = Date.now();
  try {
    const result = await operation();
    const duration = Date.now() - start;
    console.log(`[Firestore] ${info.type.toUpperCase()} on ${info.collection}`, {
      details: info.details || null,
      duration: `${duration}ms`
    });
    return result;
  } catch (error) {
    console.error(`[Firestore] ERROR during ${info.type.toUpperCase()} on ${info.collection}`, {
      error,
      details: info.details || null,
    });
    throw error;
  }
}
