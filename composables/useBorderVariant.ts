import { borderImageVariants } from "~/constants/ui";

export function useBorderVariant(
  variant?: "1" | "2" | "3" | "4",
  colorKey: string = "penColor"
) {
  const borderVariant = ref<Record<string, string>>({});

  const updateVariant = (colorOverride?: string) => {
    const color = colorOverride || getRootCssVar(colorKey, "black");
    borderVariant.value =
      borderImageVariants[parseInt(variant ?? "1") - 1](color);
  };

  onMounted(() => {
    updateVariant();
  });

  return {
    borderVariant: readonly(borderVariant),
    updateVariant,
  };
}
