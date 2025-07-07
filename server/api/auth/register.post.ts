import { db } from "../../db/database";
import crypto from "crypto";
import { AVATARS_COUNT } from "~/constants/common";
import { createSession, setSessionCookie } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, password, avatar = 1, rememberMe = false } = body;

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Логин и пароль обязательны",
      });
    }

    if (username.length < 3 || username.length > 20) {
      throw createError({
        statusCode: 400,
        statusMessage: "Логин должен содержать от 3 до 20 символов",
      });
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: "Пароль должен содержать минимум 6 символов",
      });
    }

    if (!Number.isInteger(avatar) || avatar < 1 || avatar > AVATARS_COUNT) {
      throw createError({
        statusCode: 400,
        statusMessage: `Аватар должен быть числом от 1 до ${AVATARS_COUNT}`,
      });
    }

    const existingUser = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id FROM users WHERE username = ?",
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: "Пользователь с таким логином уже существует",
      });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    const hashedPassword = `${salt}:${hash}`;

    const result = await new Promise<{ id: number }>((resolve, reject) => {
      db.run(
        "INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)",
        [username, hashedPassword, avatar],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    // Автоматическая авторизация после регистрации
    const sessionToken = await createSession(result.id, rememberMe);
    setSessionCookie(event, sessionToken, rememberMe);

    return {
      success: true,
      message: "Пользователь успешно зарегистрирован",
      userId: result.id,
      user: {
        id: result.id,
        username,
        avatar,
      },
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    console.error("Ошибка регистрации:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера (101)",
    });
  }
});
