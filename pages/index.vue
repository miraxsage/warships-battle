<style scoped>
.splash {
  background-image: url("/images/splash.svg");
  scale: 1.1;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  mix-blend-mode: multiply;
  width: 100%;
  aspect-ratio: 1.86;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.button {
  font-size: 32px;
}
.content {
  flex-grow: 1;
  display: flex;
  align-items: center;
}
</style>
<template>
  <div class="container">
    <div class="splash" />
    <div class="content">
      <Button
        class="button"
        text="Вход / Регистрация"
        variant="4"
        href="/auth"
      />
    </div>
  </div>
</template>
