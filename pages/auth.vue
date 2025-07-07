<style lang="scss" scoped>
@use "@/styles/mixins.scss" as *;
@use "@/styles/colors.scss" as *;

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: start;
  max-width: 300px;
}
.buttons {
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
}
.button {
  min-width: 120px;
  box-sizing: border-box;
  text-align: center;
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
.avatar-container {
  overflow: hidden;
  max-height: 150px;
  width: calc(100% + 30px);
  margin-left: -15px;
}
.avatar-selector {
  min-height: calc(var(--cell-size) * 3);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-leave-active {
  transition: all 0.3s;
  :deep(.keen-slider__slide) {
    display: var(--avatar-display);
    text-align: center;
  }
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0px !important;
}
.error {
  margin-top: -20px;
  margin-bottom: 25px;
  font-size: 24px;
  color: $error;
  max-height: 95px;
  overflow: hidden;
  @include bold-filter($error);
  svg {
    display: inline-block;
  }
  &-icon {
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
    margin-right: 8px;
  }
}
.label:has(+ div input:focus) {
  color: black;
  @include bold-filter(black);
}
</style>
<script setup lang="ts">
import type { AvatarId } from "~/components/AvatarSelector/type";

definePageMeta({
  middleware: "auth-redirect",
});

const newUser = ref(false);
const rememberMe = ref(false);
const avatarId = ref<AvatarId | null>(null);
const username = ref("");
const password = ref("");
const error = ref("");

const clearError = () => {
  error.value = "";
};

const userStore = useUserStore();
const route = useRoute();

onMounted(() => {
  document.getElementById("login")?.focus();
});

const redirectAfterAuth = () => {
  const redirectUrl = route.query.redirect as string;
  return navigateTo(redirectUrl || "/");
};

const handleAuth = async () => {
  error.value = "";

  if (!username.value || !password.value) {
    error.value = "Заполните все поля";
    return;
  }

  if (newUser.value) {
    try {
      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body: {
          username: username.value,
          password: password.value,
          avatar: avatarId.value || 1,
          rememberMe: rememberMe.value,
        },
      });

      if (response.success) {
        await userStore.fetchUser();
        await redirectAfterAuth();
      }
    } catch (err: unknown) {
      error.value = (
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data
          ? err.data.message
          : "Ошибка регистрации"
      ) as string;
    }
  } else {
    try {
      await userStore.login(username.value, password.value, rememberMe.value);
      await redirectAfterAuth();
    } catch (err: unknown) {
      error.value = (
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data
          ? err.data.message
          : "Ошибка авторизации"
      ) as string;
    }
  }
};
</script>

<template>
  <div class="container">
    <form class="form" @submit.prevent="handleAuth">
      <Label text="Логин" for="login" class="mb-4 label" />
      <Input
        variant="3"
        id="login"
        v-model="username"
        @focus="clearError"
        @input="clearError"
        class="mb-10"
        :style="{ paddingBlock: '14px' }"
      />
      <Label text="Пароль" for="password" class="mb-4 label" />
      <Input
        variant="4"
        id="password"
        type="password"
        v-model="password"
        @focus="clearError"
        @input="clearError"
        class="mb-10"
        :style="{ paddingBlock: '14px' }"
      />
      <Transition name="slide">
        <div
          v-if="newUser"
          class="avatar-container"
          :style="{ '--selected-avatar': String(avatarId ?? 0) }"
        >
          <Label text="Аватар" class="mb-4 ml-16" />
          <AvatarSelector
            key="avatar-selector"
            class="avatar-selector mb-20"
            @select="avatarId = $event"
          />
        </div>
      </Transition>
      <Checkbox
        v-model="newUser"
        label="Создать новый аккаунт"
        class="mb-10 mt-10 ml-2"
      />
      <Checkbox
        v-model="rememberMe"
        label="Запомнить меня"
        class="mb-40 ml-2"
        variant="2"
      />
      <Transition name="slide">
        <div v-if="error" class="error">
          <SpriteSymbol name="error" class="error-icon" />
          {{ error }}
        </div>
      </Transition>
      <div class="buttons">
        <Button
          :text="newUser ? 'Регистрация' : 'Вход'"
          variant="2"
          class="button"
          :disabled="!!error"
          type="submit"
        />
        <Button text="Назад" variant="1" href="/" class="button" />
      </div>
    </form>
  </div>
</template>
