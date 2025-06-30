<style scoped lang="scss">
@use "@/styles/colors.scss" as *;
@use "@/styles/mixins.scss" as *;

.root {
  border-style: solid;
  display: inline-block;
  font-size: 26px;
  font-family: "First Time Writing";
  position: relative;
  color: var(--pen-color);
  background: transparent;
  transition: all 0.3s;
  will-change: transform;
  mix-blend-mode: darken;
  text-decoration: none;
  cursor: pointer;
  .text {
    display: inline;
    position: relative;
  }
  .text:before {
    content: "";
    visibility: hidden;
    transition: all 0.3s;
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: white;
    filter: blur(4px);
  }
  span {
    @include bold-filter;
    position: relative;
  }
  &:hover {
    translate: 0 -2px;
    transition: all 0.2s;
    background: rgba($pen-color, 0.01);
    .text:before {
      visibility: visible;
      opacity: 1;
      transition: all 0.1s;
    }
    .hatch-bg {
      opacity: 1;
    }
  }
  &:active {
    scale: 0.97;
  }
}
.hatch-bg {
  opacity: 0;
  transition: all 0.2s;
  color: rgba($pen-color, 0.3);
}
</style>
<script setup lang="ts">
import { NuxtLink } from "#components";
import { useBorderVariant } from "~/composables/useBorderVariant";

const props = defineProps<{
  text: string;
  variant?: "1" | "2" | "3" | "4";
  href?: string;
}>();

const { borderVariant } = useBorderVariant(props.variant);
</script>
<template>
  <component
    :is="props.href ? NuxtLink : 'button'"
    v-bind="props.href ? { to: props.href } : { type: 'button' }"
    class="root"
    :style="{ ...borderVariant }"
  >
    <HatchBackground class="hatch-bg" />
    <div class="text">
      <span>{{ props.text }}</span>
    </div>
  </component>
</template>
