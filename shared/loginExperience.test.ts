import { describe, expect, it } from "vitest";
import { LOGIN_TRUST_POINTS, oauthCallbackPath } from "./loginExperience";

describe("login experience", () => {
  it("keeps the trust points focused on privacy and EV ownership", () => {
    expect(LOGIN_TRUST_POINTS).toEqual(["Private by design", "Built for EV owners"]);
  });

  it("builds a stable OAuth callback path without duplicate slashes", () => {
    expect(oauthCallbackPath("https://voltpath.example/")).toBe("https://voltpath.example/api/oauth/callback");
    expect(oauthCallbackPath("https://voltpath.example")).toBe("https://voltpath.example/api/oauth/callback");
  });
});
