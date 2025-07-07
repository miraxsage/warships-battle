import crypto from "crypto";
import cookie from "cookie";
import type { H3Event } from "h3";
import { db } from "../db/database";

export interface Session {
  id: number;
  token: string;
  user_id: number;
  expires_at: string;
  user?: {
    id: number;
    username: string;
    avatar: number;
  };
}
export interface SessionRow {
  id: number;
  token: string;
  user_id: number;
  expires_at: string;
  username: string;
  avatar: number;
}

export interface UserRow {
  id: number;
  username: string;
  password: string;
  avatar: number;
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(
  userId: number,
  rememberMe: boolean = false
): Promise<string> {
  const token = generateSessionToken();
  const aDay = 24 * 60 * 60 * 1000;
  const expiresIn = rememberMe ? 30 * aDay : aDay;
  const expiresAt = new Date(Date.now() + expiresIn);

  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
      [token, userId, expiresAt.toISOString()],
      function (err) {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
}

export async function validateSession(token: string): Promise<Session | null> {
  if (!token) {
    return null;
  }

  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT s.*, u.username, u.avatar 
      FROM sessions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.token = ? AND s.expires_at > datetime('now')
      `,
      [token],

      (err, row: SessionRow | undefined) => {
        if (err) {
          reject(err);
        } else if (row) {
          const { id, token, user_id, expires_at, username, avatar } = row;
          resolve({
            id,
            token,
            user_id,
            expires_at,
            user: {
              id: user_id,
              username,
              avatar,
            },
          });
        } else {
          resolve(null);
        }
      }
    );
  });
}

export async function deleteSession(token: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM sessions WHERE token = ?", [token], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function parseCookies(cookieHeader: string): Record<string, string> {
  const parsed = cookie.parse(cookieHeader || "");
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

export function setSessionCookie(
  event: H3Event,
  token: string,
  rememberMe: boolean = false
) {
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // в секундах

  const cookieValue = cookie.serialize("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  event.node.res.setHeader("Set-Cookie", cookieValue);
}

export function clearSessionCookie(event: H3Event) {
  const cookieValue = cookie.serialize("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  event.node.res.setHeader("Set-Cookie", cookieValue);
}

export async function getUserFromToken(event: H3Event) {
  const cookieHeader = getHeader(event, "cookie") || "";
  const cookies = parseCookies(cookieHeader);
  const token = cookies.session_token;

  if (!token) return null;

  const session = await validateSession(token);
  return session?.user || null;
}
