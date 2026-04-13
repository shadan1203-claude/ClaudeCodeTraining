import { test, expect, vi, beforeEach } from "vitest";

// Must be mocked before importing auth to prevent "server-only" crash
vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("jose", () => ({
  SignJWT: vi.fn(),
  jwtVerify: vi.fn(),
}));

import { getSession } from "../auth";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const mockCookies = cookies as ReturnType<typeof vi.fn>;
const mockJwtVerify = jwtVerify as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

test("getSession returns null when auth-token cookie is absent", async () => {
  mockCookies.mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
  });

  const result = await getSession();

  expect(result).toBeNull();
  expect(mockJwtVerify).not.toHaveBeenCalled();
});

test("getSession returns SessionPayload when token is valid", async () => {
  const fakePayload = {
    userId: "user-123",
    email: "test@example.com",
    expiresAt: new Date("2026-12-31"),
  };

  mockCookies.mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: "valid.jwt.token" }),
  });
  mockJwtVerify.mockResolvedValue({ payload: fakePayload });

  const result = await getSession();

  expect(result).toEqual(fakePayload);
  expect(mockJwtVerify).toHaveBeenCalledWith("valid.jwt.token", expect.anything());
});

test("getSession returns null when token is invalid or expired", async () => {
  mockCookies.mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: "expired.jwt.token" }),
  });
  mockJwtVerify.mockRejectedValue(new Error("JWTExpired"));

  const result = await getSession();

  expect(result).toBeNull();
});
