<style lang="scss">
.my-field,
.enemy-field {
  position: absolute;
  width: calc(var(--fcell-size) * 10);
  height: calc(var(--fcell-size) * 10);
  top: calc(
    var(--cell-size) * max(7, (var(--v-cells) - var(--v-cells-odd) - 20) / 2) -
      3px
  );
  left: calc(
    max(
        var(--cell-size),
        var(--horizontal-center) - var(--fcell-size) * 5 - var(--cell-size)
      ) - 1px
  );
}
.my-field {
  @media (width >= 1024px) {
    left: calc(
      max(
          var(--cell-size),
          var(--horizontal-center) - var(--fcell-size) * 11 - var(--cell-size)
        ) - 1px
    );
  }
}
.enemy-field {
  @media (width >= 1024px) {
    left: calc(
      max(
          var(--cell-size),
          var(--horizontal-center) + var(--fcell-size) - var(--cell-size)
        ) - 1px
    );
  }
  @media (width < 1024px) {
    top: calc(var(--cell-size) * 6 + var(--fcell-size) * 11);
  }
}
</style>

<script setup lang="ts">
import { sizeContextKey } from "~/layouts/utils";
const sizeContext = inject(sizeContextKey, null);
</script>

<template>
  <Playfield type="player" class="my-field" />
  <Playfield type="enemy" class="enemy-field" />
</template>
