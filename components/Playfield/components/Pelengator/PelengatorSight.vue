<style scoped lang="scss">
@use "~/styles/colors.scss" as *;

$fixed-size: 15px;

.pelengator-sight {
  min-width: calc(var(--fcell-size) * 1.5);
  min-height: calc(var(--fcell-size) * 1.5);
  display: grid;
  grid-template-columns: $fixed-size 1fr $fixed-size 1fr $fixed-size;
  grid-template-rows: $fixed-size 1fr $fixed-size 1fr $fixed-size;
}

.pelengator-part {
  background: $pen-color;
  mask-image: url("/images/pelengator.svg");
  mask-size: 500% 500%;
  mask-repeat: no-repeat;
  mask-position: calc(var(--x) * 25% + var(--displace-x, 0%))
    calc(var(--y) * 25%);
  grid-column: calc(var(--x) + 1);
  grid-row: calc(var(--y) + 1);
}

.pelengator-content {
  grid-column: 2 / 5;
  grid-row: 2 / 5;
  margin: -5px;
  overflow: hidden;
  clip-path: inset(0 0 0 0);
}

.left-arrow,
.right-arrow,
.top-arrow,
.bottom-arrow {
  position: absolute;
  overflow: hidden;
  clip-path: inset(0 0 0 0);
}
.left-arrow:before,
.right-arrow:before,
.top-arrow:before,
.bottom-arrow:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--pen-color);
  mask-image: url("/images/dash-line.svg");
  mask-repeat: no-repeat;
  mask-position: center;
  clip-path: inset(0 0 0 0);
}
.left-arrow:after,
.right-arrow:after,
.top-arrow:after,
.bottom-arrow:after {
  content: "";
  position: absolute;
  aspect-ratio: 1;
  height: calc(var(--fcell-size) * 0.5);
  height: calc(var(--fcell-size) * 0.5);
  background-color: var(--pen-color);
  mask-image: url("/images/triangle-arrow.svg");
  mask-repeat: no-repeat;
  mask-position: center;
}
.left-arrow,
.right-arrow {
  width: calc(var(--cell-size) * 18);
  height: calc(var(--fcell-size) * 0.5);
  translate: 0 -50%;
}
.top-arrow,
.bottom-arrow {
  width: calc(var(--fcell-size) * 0.5);
  height: calc(var(--cell-size) * 18);
  left: 50%;
  top: 0;
  translate: -15px -100%;
}
.bottom-arrow {
  top: 100%;
  translate: -15px 0;
}
.left-arrow {
  top: calc(50% + -2px);
  left: calc(var(--cell-size) * -18);
  translate: 0% -50%;
}
.right-arrow {
  top: calc(50% - 3px);
  left: 100%;
}
.top-arrow:before {
  height: calc(var(--fcell-size) * 0.5);
  width: calc(var(--fcell-size) * 9.25);
  transform-origin: calc(var(--fcell-size) * 0.25)
    calc(var(--fcell-size) * 0.25);
  rotate: 270deg;
  left: calc(50% - 15px);
  top: 100%;
  translate: 0 -100%;
}
.bottom-arrow:before {
  height: calc(var(--fcell-size) * 0.5);
  width: calc(var(--fcell-size) * 9.25);
  transform-origin: calc(var(--fcell-size) * 0.25)
    calc(var(--fcell-size) * 0.25);
  rotate: 90deg;
}
.left-arrow:before {
  height: calc(var(--fcell-size) * 0.5);
  width: calc(var(--fcell-size) * 9.25);
  transform-origin: 50% 0%;
  scale: -1 1;
  right: 0;
}
.right-arrow:before {
  height: calc(var(--fcell-size) * 0.5);
  width: calc(var(--fcell-size) * 9.25);
}
.top-arrow:after {
  top: calc(var(--cell-size));
  rotate: -90deg;
  translate: 0 -3px;
}
.bottom-arrow:after {
  top: calc(var(--cell-size) * 16);
  rotate: 90deg;
}
.left-arrow:after {
  left: calc(var(--cell-size));
  scale: -1 1;
  translate: 0px 0;
}
.right-arrow:after {
  left: calc(var(--cell-size) * 16);
}
.is-hit {
  .pelengator-part {
    opacity: 0;
    transition: opacity calc(var(--turn-animation-duration) * 0.3)
      calc(var(--turn-animation-duration) * 0.8);
  }
  :is(.left-arrow, .right-arrow, .top-arrow, .bottom-arrow) {
    transition: all calc(var(--turn-animation-duration) * 0.7)
      calc(var(--turn-animation-duration) * 0.3);
    transition-property: top, left, clip-path;
    animation: pelengator-sight-step-4
      calc(var(--turn-animation-duration) * 1.2)
      calc(var(--turn-animation-duration) * 0.8) forwards infinite;
  }
  .top-arrow {
    transform-origin: 50% calc(var(--cell-size) * 3 + 1%);
    top: calc(var(--cell-size) * (var(--pelengator-size-to) * 2 + 15.8));
    clip-path: inset(0 0 calc(var(--cell-size) * 16) 0);
    &:before {
      animation: pelengator-arrow-line-step-4
        calc(var(--turn-animation-duration) * 0.6)
        calc(var(--turn-animation-duration) * 0.8) forwards infinite;
      transition: clip-path calc(var(--turn-animation-duration) * 0.23)
        calc(var(--turn-animation-duration) * 0.6);
      clip-path: inset(0 0 0 calc(100% - var(--cell-size) * 1.5));
    }
    &:after {
      animation: pelengator-top-arrow-step-4
        calc(var(--turn-animation-duration) * 0.6)
        calc(var(--turn-animation-duration) * 0.8) forwards infinite;
    }
  }
  .right-arrow {
    transform-origin: calc(var(--cell-size) * 15 - 1%) 50%;
    left: calc(
      100% - var(--pelengator-size-to) * var(--fcell-size) - 15.8 *
        var(--cell-size)
    );
    clip-path: inset(0 0 0 calc(var(--cell-size) * 16));
    &:before {
      animation: pelengator-arrow-line-step-4
        calc(var(--turn-animation-duration) * 0.6)
        calc(var(--turn-animation-duration) * 0.8) forwards infinite;
      transition: clip-path calc(var(--turn-animation-duration) * 0.23)
        calc(var(--turn-animation-duration) * 0.6);
      clip-path: inset(0 0 0 calc(100% - var(--cell-size) * 1.5));
    }
    &:after {
      animation: pelengator-right-arrow-step-4
        calc(var(--turn-animation-duration) * 0.6)
        calc(var(--turn-animation-duration) * 0.8) forwards infinite;
    }
  }
  .bottom-arrow {
    transform-origin: 50% calc(var(--cell-size) * 15 - 1%);
    top: calc(
      100% - var(--pelengator-size-to) * var(--fcell-size) - 15.8 *
        var(--cell-size)
    );
    clip-path: inset(calc(var(--cell-size) * 16) 0 0 0);
    &:before {
      animation: pelengator-arrow-line-step-4
        calc(var(--turn-animation-duration) * 0.6)
        calc(var(--turn-animation-duration) * 0.8) forwards infinite;
      transition: clip-path calc(var(--turn-animation-duration) * 0.23)
        calc(var(--turn-animation-duration) * 0.6);
      clip-path: inset(0 0 0 calc(100% - var(--cell-size) * 1.5));
    }
    &:after {
      animation: pelengator-bottom-arrow-step-4
        calc(var(--turn-animation-duration) * 0.6)
        calc(var(--turn-animation-duration) * 0.8) forwards infinite;
    }
  }
  .left-arrow {
    transform-origin: calc(var(--cell-size) * 3 + 1%) 50%;
    left: calc(var(--cell-size) * (var(--pelengator-size-to) * 2 - 2.2));
    clip-path: inset(0 calc(var(--cell-size) * 16) 0 0);
    &:before {
      animation: pelengator-arrow-line-step-4
        calc(var(--turn-animation-duration) * 0.6)
        calc(var(--turn-animation-duration) * 0.8) forwards infinite;
      transition: clip-path calc(var(--turn-animation-duration) * 0.23)
        calc(var(--turn-animation-duration) * 0.6);
      clip-path: inset(0 0 0 calc(100% - var(--cell-size) * 1.5));
    }
    &:after {
      animation: pelengator-left-arrow-step-4
        calc(var(--turn-animation-duration) * 0.6)
        calc(var(--turn-animation-duration) * 0.8) forwards infinite;
    }
  }
}
.is-hidden {
  opacity: 0;
  transition: opacity calc(var(--turn-animation-duration) * 0.25)
    calc(var(--turn-animation-duration) * 0.1);
}
</style>

<script setup lang="ts">
defineProps<{ isHit?: boolean; hide?: boolean }>();
</script>
<template>
  <div :class="['pelengator-sight', { 'is-hit': isHit, 'is-hidden': hide }]">
    <!-- Углы -->
    <div class="pelengator-part" style="--x: 0; --y: 0"></div>
    <div class="pelengator-part" style="--x: 4; --y: 0"></div>
    <div class="pelengator-part" style="--x: 0; --y: 4"></div>
    <div class="pelengator-part" style="--x: 4; --y: 4"></div>

    <!-- Центры сторон -->
    <div class="pelengator-part" style="--x: 2; --y: 0"></div>
    <div class="pelengator-part" style="--x: 0; --y: 2"></div>
    <div class="pelengator-part" style="--x: 4; --y: 2"></div>
    <div class="pelengator-part" style="--x: 2; --y: 4"></div>

    <!-- Растягиваемые по ширине -->
    <div class="pelengator-part" style="--x: 1; --y: 0"></div>
    <div class="pelengator-part" style="--x: 3; --y: 0; --displace-x: 1%"></div>
    <div class="pelengator-part" style="--x: 1; --y: 4"></div>
    <div class="pelengator-part" style="--x: 3; --y: 4"></div>

    <!-- Растягиваемые по высоте -->
    <div class="pelengator-part" style="--x: 0; --y: 1"></div>
    <div class="pelengator-part" style="--x: 0; --y: 3"></div>
    <div class="pelengator-part" style="--x: 4; --y: 1"></div>
    <div class="pelengator-part" style="--x: 4; --y: 3"></div>

    <div class="pelengator-content">
      <div class="top-arrow" />
      <div class="bottom-arrow" />
      <div class="left-arrow" />
      <div class="right-arrow" />
    </div>
  </div>
</template>
