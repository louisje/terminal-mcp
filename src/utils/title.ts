export function normalizeTitle(title?: string): string | undefined {
  const normalized = (title ?? "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  if (!normalized) {
    return undefined;
  }

  return normalized;
}

export function buildSetWindowTitleSequence(title: string): string {
  const sanitized = title.replace(/[\u0007\u001b]/g, "");
  return `\u001b]0;${sanitized}\u0007`;
}

export function createClientTitleSetter(
  write: (data: string) => void
): (title?: string) => void {
  return (title?: string) => {
    const normalized = normalizeTitle(title);
    if (!normalized) {
      return;
    }

    write(buildSetWindowTitleSequence(normalized));
  };
}