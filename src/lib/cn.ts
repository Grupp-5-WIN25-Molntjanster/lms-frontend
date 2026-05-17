// Minimal className combiner. Avoids the clsx/twMerge dependency until we need it.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
