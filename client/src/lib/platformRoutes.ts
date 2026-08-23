const publicRoutePrefixes = [
  "/login", "/register", "/forgot-password", "/settings/mfa", "/privacy", "/terms", "/contact", "/blog",
  "/why-naqla", "/testimonials", "/integrations", "/roi-calculator", "/help", "/case-studies", "/three-engines",
];

/** Keeps the marketing and account-entry surfaces outside the operational shell. */
export function shouldUsePlatformShell(location: string) {
  return location !== "/" && !publicRoutePrefixes.some((prefix) => location === prefix || location.startsWith(`${prefix}/`));
}
