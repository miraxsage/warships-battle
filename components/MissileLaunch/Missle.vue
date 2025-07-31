<style module lang="scss">
@import "~/styles/colors.scss";

@keyframes fire-flicker {
  0% {
    opacity: 1;
    transform: scale(1, 1) skewX(0deg);
  }
  12% {
    opacity: 0.9;
    transform: scale(1.15, 1.04) skewX(16deg);
  }
  25% {
    opacity: 0.8;
    transform: scale(1.2, 1.08) skewX(-10deg);
  }
  37% {
    opacity: 0.9;
    transform: scale(1.1, 0.96) skewX(20deg);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.25, 1.12) skewX(-16deg);
  }
  62% {
    opacity: 0.8;
    transform: scale(1.05, 0.92) skewX(13deg);
  }
  75% {
    opacity: 0.9;
    transform: scale(1.18, 1.05) skewX(-20deg);
  }
  87% {
    opacity: 0.8;
    transform: scale(1.12, 0.95) skewX(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1.15, 1) skewX(7deg);
  }
}

@keyframes fire-color {
  0% {
    color: rgb(255, 100, 50);
  }
  20% {
    color: rgb(255, 120, 60);
  }
  40% {
    color: rgb(227, 119, 18);
  }
  60% {
    color: rgb(255, 140, 70);
  }
  80% {
    color: rgb(255, 130, 65);
  }
  100% {
    color: rgb(255, 100, 50);
  }
}

@keyframes fire-pulse {
  0% {
    opacity: 0;
    transform: translateX(7px) scaleY(1);
  }
  15% {
    opacity: 0.5;
    transform: translateX(4px) scaleY(1.1);
  }
  30% {
    opacity: 0.8;
    transform: translateX(2px) scaleY(1.2);
  }
  50% {
    opacity: 0.8;
    transform: translateX(0) scaleY(1.3);
  }
  70% {
    opacity: 0.5;
    transform: translateX(-2px) scaleY(1.1);
  }
  85% {
    opacity: 0.3;
    transform: translateX(-4px) scaleY(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-7px) scaleY(1);
  }
}

@keyframes fire-color-pulse {
  0% {
    color: rgb(255, 110, 55);
  }
  25% {
    color: rgb(255, 120, 60);
  }
  50% {
    color: rgb(227, 119, 18);
  }
  75% {
    color: rgb(255, 140, 70);
  }
  100% {
    color: rgb(255, 110, 55);
  }
}

@keyframes fire-trail-1 {
  0% {
    opacity: 0;
    transform: translateX(6px);
  }
  15% {
    opacity: 0.3;
    transform: translateX(4px);
  }
  30% {
    opacity: 0.7;
    transform: translateX(3px);
  }
  50% {
    opacity: 0.9;
    transform: translateX(0);
  }
  70% {
    opacity: 0.7;
    transform: translateX(-3px);
  }
  85% {
    opacity: 0.3;
    transform: translateX(-4px);
  }
  100% {
    opacity: 0;
    transform: translateX(-6px);
  }
}

@keyframes fire-color-trail-1 {
  0% {
    color: rgb(255, 90, 45);
  }
  30% {
    color: rgb(227, 119, 18);
  }
  60% {
    color: rgb(255, 130, 65);
  }
  100% {
    color: rgb(255, 90, 45);
  }
}

@keyframes fire-trail-2 {
  0% {
    opacity: 0;
    transform: translateX(4px);
  }
  20% {
    opacity: 0.4;
    transform: translateX(3px);
  }
  40% {
    opacity: 0.8;
    transform: translateX(1px);
  }
  60% {
    opacity: 0.8;
    transform: translateX(0);
  }
  80% {
    opacity: 0.4;
    transform: translateX(-1px);
  }
  100% {
    opacity: 0;
    transform: translateX(-4px);
  }
}

@keyframes fire-trail-3 {
  0% {
    opacity: 0;
    transform: translateX(7px);
  }
  25% {
    opacity: 0.2;
    transform: translateX(6px);
  }
  45% {
    opacity: 0.6;
    transform: translateX(3px);
  }
  65% {
    opacity: 0.7;
    transform: translateX(0);
  }
  85% {
    opacity: 0.4;
    transform: translateX(-3px);
  }
  100% {
    opacity: 0;
    transform: translateX(-7px);
  }
}

@keyframes fire-top {
  0% {
    opacity: 0;
    transform: translateX(6px);
  }
  15% {
    opacity: 0.4;
    transform: translateX(4px);
  }
  30% {
    opacity: 0.8;
    transform: translateX(2px);
  }
  50% {
    opacity: 1;
    transform: translateX(0);
  }
  70% {
    opacity: 0.8;
    transform: translateX(-2px);
  }
  85% {
    opacity: 0.4;
    transform: translateX(-4px);
  }
  100% {
    opacity: 0;
    transform: translateX(-6px);
  }
}

@keyframes fire-movement {
  0% {
    transform: translateX(-10%) translateY(0);
    scale: 1.3 1;
  }
  50% {
    transform: translateX(-20%) translateY(0);
    scale: 1.75 1;
  }
  100% {
    transform: translateX(-10%) translateY(0);
    scale: 1.3 1;
  }
}

.root {
  position: relative;
  width: calc(var(--cell-size) * 4.5);
  height: calc(var(--cell-size) * 1.8);

  .fire {
    width: calc(var(--cell-size) * 5 * 0.6);
    height: calc(var(--cell-size) * 2 * 0.22);
    position: absolute;
    top: calc(var(--cell-size) * 2 * 0.33);
    left: 0;
    translate: -100% 0;
    color: rgb(227, 119, 18);
    animation: fire-movement 3s infinite ease-in-out;

    // Анимация основного пламени
    path:nth-child(1) {
      animation: fire-flicker 1.5s infinite ease-in-out alternate,
        fire-color 3s infinite ease-in-out;
    }

    // Анимация центральной линии
    path:nth-child(2) {
      animation: fire-pulse 0.5s infinite ease-in-out,
        fire-color-pulse 2.5s infinite ease-in-out;
    }

    // Анимация нижних линий
    path:nth-child(3) {
      animation: fire-trail-1 0.4s infinite ease-in-out,
        fire-color-trail-1 2s infinite ease-in-out;
    }

    path:nth-child(4) {
      animation: fire-trail-2 0.3s infinite ease-in-out,
        fire-color 2.8s infinite ease-in-out;
    }

    path:nth-child(5) {
      animation: fire-trail-3 0.5s infinite ease-in-out,
        fire-color-pulse 2.2s infinite ease-in-out;
    }

    // Анимация верхней линии
    path:nth-child(6) {
      animation: fire-top 0.4s infinite ease-in-out,
        fire-color 3.2s infinite ease-in-out;
    }
  }
  .missile {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    color: $pen-color;
  }
  .missile-silhouette {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("/images/bg.jpg");
    background-size: 100% 100%;
    mask-image: url("/images/missile-silhouette.svg");
    mask-size: 100% 100%;
    z-index: 1;
  }
}
</style>
<template>
  <div :class="$style.root">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26.23 4.94"
      preserveAspectRatio="none"
      :class="$style.fire"
    >
      <path
        d="M25.74.79C22.64.8,19.6,0,16.5,0a.5.5,0,0,0,0,1c1.87.1,3.72,1,5.43,1.74l.13-1c-4.45.25-8.9-.17-13.34-.29-.65,0-.64,1,0,1a71.74,71.74,0,0,1,11.5,1.35L20.1,2.9a13.18,13.18,0,0,1-3.74,1,.5.5,0,0,0,0,1c3.14,0,6.25-.35,9.38-.31a.5.5,0,0,0,0-1c-3.13,0-6.24.35-9.38.31v1a15,15,0,0,0,4.25-1.17.51.51,0,0,0-.12-.92A75.14,75.14,0,0,0,8.72,1.47v1c4.44.12,8.89.54,13.34.29a.5.5,0,0,0,.13-1A18.21,18.21,0,0,0,16.5,0V1c3.1,0,6.14.8,9.24.79a.5.5,0,0,0,0-1Z"
        style="fill: currentColor"
      />
      <path
        d="M13,1h1a.51.51,0,0,0,.36-.15A.48.48,0,0,0,14.55.5a.51.51,0,0,0-.5-.5H13a.53.53,0,0,0-.36.15.5.5,0,0,0-.14.35A.51.51,0,0,0,13,1Z"
        style="fill: currentColor"
      />
      <path
        d="M10.28,4.51h2.6a.5.5,0,0,0,0-1h-2.6a.5.5,0,0,0,0,1Z"
        style="fill: currentColor"
      />
      <path
        d="M4,2.27h1.4a.5.5,0,0,0,0-1H4a.5.5,0,0,0,0,1Z"
        style="fill: currentColor"
      />
      <path
        d="M.48,2.27a.5.5,0,0,0,0-1,.5.5,0,0,0,0,1Z"
        style="fill: currentColor"
      />
      <path
        d="M23.64,3.38q.88,0,1.77,0a.5.5,0,0,0,0-1q-.89,0-1.77,0a.5.5,0,0,0-.5.5.51.51,0,0,0,.5.5Z"
        style="fill: currentColor"
      />
    </svg>
    <div :class="$style['missile-silhouette']" />
    <SpriteSymbol :class="$style.missile" name="game/missile" />
  </div>
</template>

<script setup></script>
