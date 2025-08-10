<style lang="scss" module>
@use "./styles.scss" as *;
@use "~/styles/colors.scss" as *;
:global(:is(.border1, .border2)):has(.root) {
  &::before {
    background-color: $error;
    mix-blend-mode: multiply;
  }
}
</style>
<template>
  <div :class="[$style.details, 'critical']">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="game/skull"
        :style="{ minWidth: '80px', minHeight: '80px' }"
        :class="[$style.info, $style.error]"
      />
    </p>
    <p :class="[$style.text, $style.center]"><span>О НEEЕТ!!!</span></p>
    <p :class="[$style.text, $style.center]">
      <span>Капитан, враг полностью</span>
      <span :class="$style.error"> уничтожил </span>
      <span>наш флот!</span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span
        >Импульсный аннигиляционный удар <br />
        буквально
      </span>
      <span :class="$style.error">расщепил </span>
      <span>наc на атомы!</span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span :class="$style.error">-5 </span>
      <span>к нашей карме за медлительность</span>
      <br />
      <span>Увидимся в следующей жизни!</span>
    </p>
    <NuxtLink to="/" :class="$style.fightButton">
      <Button text="На главную" variant="2" />
    </NuxtLink>
  </div>
</template>
