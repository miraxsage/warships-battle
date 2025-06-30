import { validateSession, parseCookies } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event.node.req.headers.cookie || "");
    const sessionToken = cookies.session_token;

    if (!sessionToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Требуется авторизация",
      });
    }

    const session = await validateSession(sessionToken);

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: "Недействительная сессия",
      });
    }

    return {
      success: true,
      user: session.user,
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    console.error("Ошибка получения пользователя:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера (104)",
    });
  }
});
