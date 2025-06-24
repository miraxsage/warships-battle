import * as _ from "lodash-es";

export function getRootCssVar(name: string): string | undefined;
export function getRootCssVar(name: string, defaultValue: string): string;
export function getRootCssVar(name: string, defaultValue?: string) {
  if (!isBrowser()) {
    return;
  }
  const varName = `--${_.kebabCase(name)}`;
  return (
    window.getComputedStyle(document.body).getPropertyValue(varName) ||
    defaultValue
  );
}
export function getRootSizeCssVar(name: string) {
  return parseInt(getRootCssVar(name, "0"));
}
