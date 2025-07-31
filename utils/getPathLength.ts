export function getPathLength(path: string) {
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute("d", path);
  return pathElement.getTotalLength();
}
