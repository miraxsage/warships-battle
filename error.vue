<template>
  <NuxtLayout>
    <div
      :class="[
        'error-page-content',
        {
          ['not-found']: isNotFound,
          ['only-status-code']: !error?.statusMessage,
        },
      ]"
    >
      <div class="error-picture" />
      <h1>
        {{ isNotFound ? "" : error?.statusCode }}
        {{ error?.statusMessage }}
      </h1>
      <p v-if="!isNotFound">{{ error?.message }}</p>
      <NuxtLink to="/">
        <Button text="На главную" variant="2" />
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script setup>
const error = useError();

console.log(JSON.stringify(error.value));

const isNotFound = computed(() => {
  return error.value?.statusCode === 404;
});
</script>

<style scoped lang="scss">
@use "~/styles/colors" as *;

.error-page-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $pen-color;
  h1 {
    margin: 0 0 2rem;
    font-size: 3rem;
  }
  &.only-status-code h1 {
    font-size: 5rem;
    line-height: 1;
  }
  p {
    font-size: 1.625rem;
    font-weight: bold;
    margin: 0 0 2rem;
  }
}
.error-picture {
  aspect-ratio: 1.4;
  width: calc(var(--fcell-size) * 7);
  margin-bottom: 2rem;
  height: auto;
  background-color: $pen-color;
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
  mask-image: url("/images/error.svg");
  .not-found & {
    mask-image: url("/images/404.svg");
  }
}
</style>
