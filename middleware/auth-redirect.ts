export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path !== "/auth") {
    return;
  }

  try {
    const response = await $fetch("/api/auth/me");

    if (response && response.success) {
      return navigateTo("/");
    }
  } catch (error) {}
});
