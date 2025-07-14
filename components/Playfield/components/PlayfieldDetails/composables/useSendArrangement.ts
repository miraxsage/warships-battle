import * as _ from "lodash-es";

export default function useSendArrangement() {
  const game = useGameStore();
  const fieldState = useFieldStore();

  const arrangementIsSent = ref(false);
  const sendArrangement = () => {
    if (arrangementIsSent.value) {
      return;
    }
    arrangementIsSent.value = true;
    game.sendMessage({
      type: "game:arranged",
      data: {
        arrangement: fieldState.player.ships.map((ship) => _.omit(ship, "id")),
      },
    });
  };

  return { arrangementIsSent, sendArrangement };
}
