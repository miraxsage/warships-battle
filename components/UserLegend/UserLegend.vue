<style lang="scss" module>
@use "~/styles/colors" as *;
@use "~/styles/mixins" as *;

.avatar {
  width: calc(var(--cell-size) * 3);
  height: calc(var(--cell-size) * 3);
}
.userContainer {
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: 1fr 1fr;
  gap: 0 10px;
  align-items: center;
  color: $pen-color;
  .username {
    font-size: 28px;
    .hasActions & {
      grid-row: span 2;
    }
  }
  &.right {
    & > :nth-child(1) {
      order: 999;
    }
    & > :nth-child(2) {
      order: 998;
    }
    & > :nth-child(3) {
      order: 997;
    }
  }
}
.avatarBorder {
  color: $pen-color;
  grid-row: span 2;
  padding: 0 !important;
  min-width: 80px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.emptyAvatar {
  color: $pen-color;
  font-size: 50px;
  line-height: 1;
  filter: drop-shadow(1px 1px 0 $pen-color);
}
</style>
<script setup lang="ts">
import type { User } from "~/types/common";
defineProps<{
  user?: User;
  arrangement?: "left" | "right";
}>();
const slots = useSlots();
const hasActions = computed(() => !!slots.actions);
const { borderVariant } = useBorderVariant("1");
</script>
<template>
  <div
    :class="[
      $style.userContainer,
      { [$style.hasActions]: hasActions },
      { [$style.right]: arrangement === 'right' },
    ]"
  >
    <div :class="$style.avatarBorder" :style="borderVariant">
      <SpriteSymbol
        v-if="user"
        :class="$style.avatar"
        :name="`avatars/id-${user.avatar as 1}`"
      />
      <div v-else :class="$style.emptyAvatar">?</div>
    </div>
    <Button
      :text="user?.username ?? 'noname'"
      theme="ghost"
      :class="$style.username"
    />
    <slot name="actions" />
  </div>
</template>
