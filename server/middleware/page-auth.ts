import { validateSession, parseCookies } from "../utils/auth";

export default defineEventHandler(async (event) => {
  // Проверяем только page routes, которые требуют авторизации
  const url = getRouterParam(event, "url") || event.node.req.url;

  if (!url?.startsWith("/game")) {
    return;
  }

  const cookies = parseCookies(event.node.req.headers.cookie || "");
  const sessionToken = cookies.session_token;

  // Если нет токена сессии, переадресуем на auth
  if (!sessionToken) {
    await sendRedirect(event, `/auth?redirect=${encodeURIComponent(url)}`, 302);
    return;
  }

  // Проверяем валидность сессии
  const session = await validateSession(sessionToken);

  if (!session) {
    await sendRedirect(event, `/auth?redirect=${encodeURIComponent(url)}`, 302);
    return;
  }

  // Добавляем данные пользователя в контекст
  event.context.user = session.user;
  event.context.session = session;
});
