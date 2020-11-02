export function padStart(input, targetLength, padChar) {
  if (padChar.length !== 1) {
    throw new Error("padChar must a string with a length of exactly 1");
  }
  let result = (input ?? "").toString();
  while (result.length < targetLength) {
    result = padChar + result;
  }
  return result;
}
