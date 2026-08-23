export const STALE_CHUNK_RECOVERY_KEY = "naqla_stale_chunk_recovered";

export function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /failed to fetch dynamically imported module|importing a module script failed|chunkloaderror/i.test(message);
}
