import {
  deleteSession,
  parseCookies,
  clearSessionCookie,
} from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event.node.req.headers.cookie || "");
    const sessionToken = cookies.session_token;

    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    clearSessionCookie(event);

    return {
      success: true,
      message: "Выход выполнен успешно",
    };
  } catch (error: unknown) {
    console.error("Ошибка выхода:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера (105)",
    });
  }
});
