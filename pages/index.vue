<style module lang="scss">
@use "~/styles/colors.scss" as *;
@use "~/styles/mixins.scss" as *;

.splash {
  background-image: url("/images/splash.svg");
  scale: 1.1;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  mix-blend-mode: multiply;
  width: 100%;
  height: 100%;
  aspect-ratio: 1.86;
}
.container {
  display: grid;
  grid-template-rows: minmax(0, auto) 1fr;
  align-items: center;
  height: 100%;
}
.authButton.authButton {
  font-size: 30px;
}
.content {
  flex-grow: 1;
  padding: calc(var(--cell-size)) 0;
  align-self: center;
  text-align: center;
}
.playButton.playButton {
  grid-area: 1/3/3/4;
  margin-left: 40px;
  font-size: 30px;
}
.logout {
  font-size: 24x;
  align-self: flex-start;
  color: rgba($pen-color, 0.6);
  &.logout:hover {
    color: $error;
    @include bold-filter($error);
  }
}
.userContainer {
  display: flex;
  gap: 20px;
  align-items: center;
  width: min-content;
  margin: 0 auto;
}
</style>
<script setup lang="ts">
const userStore = useUserStore();
</script>
<template>
  <div :class="$style.container">
    <div :class="$style.splash" />
    <div :class="$style.content">
      <template v-if="userStore.isAuthenticated && userStore.user">
        <div :class="$style.userContainer">
          <UserLegend :user="userStore.user">
            <template #actions>
              <Button
                :class="$style.logout"
                text="Выход"
                theme="ghost"
                @click="userStore.logout()"
              />
            </template>
          </UserLegend>
          <Button
            :class="$style.playButton"
            :text="userStore.isAuthenticated ? 'Играть' : 'Вход / Регистрация'"
            variant="4"
            @click="
              userStore.isAuthenticated
                ? $router.push('/game')
                : $router.push('/auth')
            "
          />
        </div>
      </template>
      <Button
        v-else
        :class="$style.authButton"
        text="Вход / Регистрация"
        variant="4"
        @click="
          userStore.isAuthenticated
            ? $router.push('/game')
            : $router.push('/auth')
        "
      />
    </div>
  </div>
</template>
