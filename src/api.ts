interface OptionsType {
  [key: string]: boolean;
}

export async function fetchOptions(): Promise<OptionsType> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { a: true, b: false, c: false };
}

export async function saveOptions(options: OptionsType): Promise<OptionsType> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return options;
}
