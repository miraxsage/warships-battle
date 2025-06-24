<style lang="scss" scoped>
.root {
  input {
    font-size: 26px;
    font-family: "First Time Writing";
    border: none;
    background: transparent;
    width: 100%;
    color: var(--pen-color);
    transition: all 0.3s;
    filter: drop-shadow(1px 0px 0px var(--pen-color))
      drop-shadow(0px 1px 0px var(--pen-color));
    &:focus {
      outline: none;
      color: black;
      filter: drop-shadow(1px 0px 0px black) drop-shadow(0px 1px 0px black);
    }
  }
}
</style>
<script setup lang="ts">
import { useBorderVariant } from "~/composables/useBorderVariant";

const props = defineProps<{
  value?: string;
  variant?: "1" | "2" | "3" | "4";
}>();

const isFocused = ref(false);
const { borderVariant, updateVariant } = useBorderVariant(props.variant);

watch(isFocused, () => {
  updateVariant(isFocused.value ? "black" : undefined);
});
</script>
<template>
  <div class="root" :style="{ ...borderVariant }">
    <input :model="value" @focus="isFocused = true" @blur="isFocused = false" />
  </div>
</template>
