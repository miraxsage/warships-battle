import { validateSession, parseCookies } from "~/server/utils/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore();
  // Получаем cookies из запроса
  const event = nuxtApp.ssrContext?.event;
  if (!event) return;

  try {
    const cookies = parseCookies(event.node.req.headers.cookie || "");
    const sessionToken = cookies.session_token;

    if (sessionToken) {
      const session = await validateSession(sessionToken);
      if (session?.user) {
        // Устанавливаем пользователя в стор на сервере
        userStore.setUser(session.user);
      }
    }
  } catch (error) {
    console.debug("Не удалось загрузить пользователя на сервере:", error);
  }
});
