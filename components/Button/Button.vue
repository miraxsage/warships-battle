<style scoped lang="scss">
@use "@/styles/colors.scss" as *;
@use "@/styles/mixins.scss" as *;

.regular,
.ghost {
  display: inline-block;
  font-size: pxrem(26);
  font-family: "First Time Writing";
  color: var(--pen-color);
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
  background: transparent;
  border: none;
}
.ghost {
  @include bold-filter;
  &:hover {
    color: black;
    @include bold-filter(black);
  }
}
.regular {
  border-style: solid;
  position: relative;
  background: transparent;
  will-change: transform;
  mix-blend-mode: darken;
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
  theme?: "regular" | "ghost";
  variant?: "1" | "2" | "3" | "4";
  href?: string;
}>();

const { borderVariant } = useBorderVariant(props.variant);
</script>
<template>
  <template v-if="props.theme === 'ghost'">
    <component
      :is="props.href ? NuxtLink : 'button'"
      v-bind="props.href ? { to: props.href } : { type: 'button' }"
      class="ghost"
      >{{ props.text }}</component
    >
  </template>
  <component
    v-else
    :is="props.href ? NuxtLink : 'button'"
    v-bind="props.href ? { to: props.href } : { type: 'button' }"
    class="regular"
    :style="{ ...borderVariant }"
  >
    <HatchBackground class="hatch-bg" />
    <div class="text">
      <span>{{ props.text }}</span>
    </div>
  </component>
</template>
