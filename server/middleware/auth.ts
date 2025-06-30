import { validateSession, parseCookies } from "../utils/auth";

export default defineEventHandler(async (event) => {
  if (!event.node.req.url?.startsWith("/api/protected/")) {
    return;
  }

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

  event.context.user = session.user;
  event.context.session = session;
});
