<style lang="scss" scoped>
@use "@/styles/mixins.scss" as *;

.root {
  input {
    font-size: 26px;
    font-family: "First Time Writing";
    border: none;
    background: transparent;
    width: 100%;
    color: var(--pen-color);
    transition: all 0.3s;
    @include bold-filter;
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
  modelValue?: string;
  variant?: "1" | "2" | "3" | "4";
  id?: string;
  type?: string;
}>();

const emit = defineEmits<{
  focus: [event: FocusEvent];
  "update:modelValue": [value: string];
}>();

const isFocused = ref(false);
const { borderVariant, updateVariant } = useBorderVariant(props.variant);

watch(isFocused, () => {
  updateVariant(isFocused.value ? "black" : undefined);
});

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit("focus", event);
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>
<template>
  <div class="root" :style="{ ...borderVariant }">
    <input
      :value="modelValue"
      :type="type"
      :id="id"
      @input="handleInput"
      @focus="handleFocus"
      @blur="isFocused = false"
    />
  </div>
</template>
