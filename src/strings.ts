export function padStart(input: string, targetLength: number, padChar: string) {
  if (padChar.length !== 1) {
    throw new Error("padChar must be a string with a length of exactly 1");
  }
  let result = input || "";
  while (result.length < targetLength) {
    result = padChar + result;
  }
  return result;
}
