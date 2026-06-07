export type Input = {
  value: number;
};

export type Output = {
  result: number;
};

export function calculate(input: Input): Output {
  if (!Number.isFinite(input.value)) return { result: 0 };
  return { result: input.value * 2 };
}
