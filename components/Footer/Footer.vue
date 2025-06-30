<style lang="scss">
@use "@/styles/colors.scss" as *;
@use "@/styles/mixins.scss" as *;

.footer {
  height: calc(var(--fcell-size) * 2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  @include bold-filter;
  .link {
    text-decoration: none;
    color: var(--pen-color);
    &:hover {
      text-decoration: underline;
      text-decoration-color: rgba($pen-color, 0.1);
      text-underline-offset: 6px;
    }
  }
}
</style>
<script setup lang="ts">
const date = new Date();
</script>
<template>
  <div class="footer container">
    <a href="https://miraxsage.ru" target="_blank" class="link"
      >Miraxsage.ru © 2025{{
        date.getFullYear() > 2025 ? ` – ${date.getFullYear()}` : ""
      }}</a
    >
  </div>
</template>
