<template>
  <label class="checkbox-wrapper">
    <input
      type="checkbox"
      class="checkbox-input"
      :checked="modelValue"
      @change="
        $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
    />
    <div class="checkbox-custom">
      <div class="checkbox-border" :class="{ 'variant-2': variant === '2' }" />
    </div>
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  label?: string;
  variant?: "1" | "2";
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<style scoped lang="scss">
@use "@/styles/mixins.scss" as *;

.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  will-change: transform;
  &:hover {
    translate: 0 -2px;
    scale: 1.008;
  }
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-custom {
  position: relative;
  width: 32px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  @include bold-filter;
  input:checked + &::after {
    content: "V";
    font-family: "First Time Writing";
    font-size: 24px;
    scale: 1.5 1;
    color: var(--pen-color);
  }
}
.checkbox-border {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: var(--pen-color);
  mask-image: url("/images/rect1.svg");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;

  &.variant-2 {
    transform: scale(1, -1);
    rotate: -90deg;
  }
}

.checkbox-label {
  font-family: "First Time Writing";
  font-size: 24px;
  color: var(--pen-color);
  @include bold-filter;
}
</style>
