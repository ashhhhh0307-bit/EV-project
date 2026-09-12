export const LOGIN_TRUST_POINTS = ["Private by design", "Built for EV owners"] as const;

export function oauthCallbackPath(origin: string): string {
  return `${origin.replace(/\/$/, "")}/api/oauth/callback`;
}
