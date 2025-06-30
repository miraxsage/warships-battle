// https://nuxt.com/docs/api/configuration/nuxt-config
import { removeSizes } from "nuxt-svg-icon-sprite/processors";

// Кастомный процессор для замены цветов на currentColor
const forceCurrentColorAdvanced = () => (svg: any) => {
  // Удаляем размеры
  svg.removeAttribute("width");
  svg.removeAttribute("height");

  // Ищем все элементы
  const elements = svg.querySelectorAll("*");
  elements.forEach((el: any) => {
    // Удаляем ненужные атрибуты
    el.removeAttribute("id");
    el.removeAttribute("data-name");

    // Обрабатываем атрибуты fill и stroke
    const fillAttr = el.getAttribute("fill");
    const strokeAttr = el.getAttribute("stroke");

    if (fillAttr && fillAttr !== "none" && !fillAttr.includes("url(")) {
      el.setAttribute("fill", "currentColor");
    }

    if (strokeAttr && strokeAttr !== "none" && !strokeAttr.includes("url(")) {
      el.setAttribute("stroke", "currentColor");
    }

    // Обрабатываем inline стили
    const style = el.getAttribute("style");
    if (style) {
      const newStyle = style
        .replace(/fill:\s*[^;]+/g, "fill:currentColor")
        .replace(/stroke:\s*[^;]+/g, "stroke:currentColor");

      if (newStyle !== style) {
        el.setAttribute("style", newStyle);
      }
    }
  });
};

export default defineNuxtConfig({
  // compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: ["@nuxt/fonts", "@pinia/nuxt", "nuxt-svg-icon-sprite"],
  css: ["@/styles/variables.scss"],
  svgIconSprite: {
    sprites: {
      default: {
        importPatterns: ["assets/icons/common/**/*.svg"],
        processSpriteSymbol: [forceCurrentColorAdvanced()],
      },
      avatars: {
        importPatterns: ["assets/icons/avatars/**/*.svg"],
        processSpriteSymbol: [forceCurrentColorAdvanced()],
      },
    },
  },
});
