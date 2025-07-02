import { defineStore } from "pinia";
import type { User } from "~/types/common";

export const useUserStore = defineStore("user", () => {
  const user = useState<User | null>("user.data", () => null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  async function fetchUser() {
    try {
      isLoading.value = true;
      const response = await $fetch<{ success: boolean; user: User }>(
        "/api/auth/me"
      );

      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      user.value = null;
      console.error("Ошибка получения пользователя:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function login(username: string, password: string, rememberMe = false) {
    try {
      isLoading.value = true;
      const response = await $fetch<{ success: boolean; user: User }>(
        "/api/auth/login",
        {
          method: "POST",
          body: { username, password, rememberMe },
        }
      );

      if (response.success) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    try {
      isLoading.value = true;
      await $fetch("/api/auth/logout", { method: "POST" });
      user.value = null;
    } catch (error) {
      console.error("Ошибка выхода:", error);
    } finally {
      isLoading.value = false;
    }
  }

  function clearUser() {
    user.value = null;
  }

  function setUser(userData: User) {
    user.value = userData;
  }

  return {
    user,
    isLoading: readonly(isLoading),
    isAuthenticated,
    fetchUser,
    login,
    logout,
    clearUser,
    setUser,
  };
});
