import * as _ from "lodash-es";

export function getRootSizeCssVar(name: string) {
  if (!isBrowser()) {
    return;
  }
  const varName = `--${_.kebabCase(name)}`;
  return parseInt(
    window.getComputedStyle(document.body).getPropertyValue(varName)
  );
}
