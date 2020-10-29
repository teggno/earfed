export function hitTest(x, y, element, tolerance) {
  const rect = element.getBoundingClientRect();
  tolerance = tolerance || 0;
  return (
    rect.left <= x + tolerance &&
    rect.right >= x - tolerance &&
    rect.top <= y + tolerance &&
    rect.bottom >= y - tolerance
  );
}
