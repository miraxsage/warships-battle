<style lang="scss" module>
@use "../styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import { HITS_TO_WIN, SHIPS_CLASSES } from "~/constants/common";

const startPhrases = [
  "Враг попал по нашему кораблю!",
  "Наш флот накрыло огнем!",
  "Вражеский снаряд достиг цели!",
  "Враг разрушает наши позиции!",
];
const startPhrase = _.sample(startPhrases);
const game = useGameStore();
const fieldStore = useFieldStore();
const { count } = useCountdown(game.lastTurn?.isShipDestroyed ? 15 : 10);
const gameStore = useGameStore();
const hitSector = computed(() => {
  const lastTurn = gameStore.lastTurn;
  if (!lastTurn) return "X";
  return coordsToSector(lastTurn.x, lastTurn.y);
});
const damagedShipDetails = computed(() => {
  const lastTurn = gameStore.lastTurn;
  if (!lastTurn) return;
  return fieldStore.getShipDetailsByCoords()(lastTurn.x, lastTurn.y, "player");
});
const damagedShip = computed(() => damagedShipDetails.value?.ship);
const damagedShipPart = computed(() => damagedShipDetails.value?.part);
const fullDamage = computed(() => gameStore.lastTurn?.isShipDestroyed);
const enemyHasWon = computed(() => gameStore.enemyStats.hits == HITS_TO_WIN);
const iconSize = computed(() => (enemyHasWon.value ? pxrem(60) : pxrem(40)));
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        :name="enemyHasWon ? 'game/skull' : 'fire'"
        :style="{ minWidth: iconSize, minHeight: iconSize }"
        :class="[$style.info, $style.error]"
      />
    </p>
    <p :class="[$style.text, $style.center]">
      <span>{{ startPhrase }}</span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span>Противник отправил снаряд в наш сектор </span>
      <span :class="$style.info">{{ hitSector }}</span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span
        >Удар пришелся по
        {{
          damagedShip?.type
            ? SHIPS_CLASSES[damagedShip?.type].nameTo.toLowerCase()
            : "нашему кораблю"
        }},
        <br />
        {{
          fullDamage
            ? `последняя боеспособная секция повреждена`
            : ["первая", "вторая", "третья", "четвертая"][
                damagedShipPart?.part ?? 0
              ] + " секция повреждена"
        }}
      </span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span :class="$style.error" v-if="fullDamage">
        Борт полностью уничтожен!
        <br />
      </span>
      <span v-if="fullDamage">
        Пилот пал смертью храбрых...
        <br />
      </span>
      <span v-if="enemyHasWon">
        Похоже у нас не осталось кораблей, капитан!
        <br />
      </span>
      <span :class="$style.warning" v-if="!enemyHasWon">
        Держать оборону!
      </span>
    </p>
    <p
      :style="{ opacity: count > 0 ? 1 : 0 }"
      :class="[$style.text, $style.center]"
    >
      <span>{{ count }}</span>
    </p>
  </div>
</template>
