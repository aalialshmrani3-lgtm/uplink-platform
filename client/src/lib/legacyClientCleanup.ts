/**
 * A prior deployment could have registered a client-side shell that is no
 * longer part of NAQLA. This runs without delaying the first React render and
 * removes only browser-managed workers/caches for the current origin.
 */
export async function clearLegacyClientShell(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ("caches" in window) {
      const keys = await window.caches.keys();
      await Promise.all(keys.map((key) => window.caches.delete(key)));
    }
  } catch {
    // Cache cleanup is a recovery aid only. Rendering must never depend on it.
  }
}
