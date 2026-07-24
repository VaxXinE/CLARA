const secretNamePattern =
  /(api[_-]?key|authorization|bearer|token|cookie|secret|password)/i;

export function redactAiProviderSecretConfig(
  input: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      key,
      secretNamePattern.test(key) ? "[redacted]" : value,
    ]),
  );
}

export function assertNoAiProviderSecretInPublicKey(key: string): boolean {
  return !/^(VITE|NEXT_PUBLIC|PUBLIC)_.*AI.*(KEY|SECRET|TOKEN)/.test(key);
}
