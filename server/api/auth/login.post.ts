import { db } from "../../db/database";
import crypto from "crypto";
import {
  createSession,
  setSessionCookie,
  type UserRow,
} from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, password, rememberMe = false } = body;

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Логин и пароль обязательны",
      });
    }

    const user = await new Promise<UserRow | undefined>((resolve, reject) => {
      db.get(
        "SELECT id, username, password, avatar FROM users WHERE username = ?",
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row as UserRow | undefined);
        }
      );
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Неверный логин или пароль",
      });
    }

    const [salt, hash] = user.password.split(":");

    if (!salt || !hash) {
      throw createError({
        statusCode: 500,
        statusMessage: "Внутренняя ошибка сервера (102)",
      });
    }

    const verifyHash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    if (hash !== verifyHash) {
      throw createError({
        statusCode: 401,
        statusMessage: "Неверный логин или пароль",
      });
    }

    const sessionToken = await createSession(user.id, rememberMe);

    setSessionCookie(event, sessionToken, rememberMe);

    return {
      success: true,
      message: "Авторизация успешна",
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      },
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    console.error("Ошибка входа:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера (103)",
    });
  }
});
