export const useGameAuth = () => {
  const userStore = useUserStore();
  const route = useRoute();
  const router = useRouter();

  const checkAuthAndRedirect = async () => {
    // Проверяем авторизацию
    if (!userStore.isAuthenticated) {
      // Сохраняем текущий URL для возврата после авторизации
      const currentUrl = route.fullPath;
      await router.push(`/auth?redirect=${encodeURIComponent(currentUrl)}`);
      return false;
    }
    return true;
  };

  return {
    checkAuthAndRedirect,
  };
};
