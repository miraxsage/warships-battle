export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== "/auth") {
    return;
  }

  const userStore = useUserStore();

  // Если пользователь авторизован, перенаправляем на главную
  if (userStore.isAuthenticated) {
    return navigateTo("/");
  }
});
