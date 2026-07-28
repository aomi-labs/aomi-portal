"use client";

import type { CSSProperties, SVGProps } from "react";

export type BrandProps = SVGProps<SVGSVGElement> & { size?: number };

/** Fixed brand hex, or per-theme colors for marks that are light-on-dark in brand guidelines. */
export type BrandColor = string | { light: string; dark: string };

export function isThemeBrandColor(color: BrandColor): color is { light: string; dark: string } {
  return typeof color !== "string";
}

/**
 * Renders registry SVG paths with `fill="currentColor"`.
 * Theme-aware marks set CSS vars consumed by `.brand-mark-themed` in globals.css.
 */
export function markup(
  viewBox: string,
  html: string,
  color: BrandColor,
): (props: BrandProps) => React.JSX.Element {
  function Mark({ size = 14, style, className, ...props }: BrandProps) {
    const themed = isThemeBrandColor(color);
    const mergedStyle: CSSProperties = themed
      ? {
          ["--brand-mark-light" as string]: color.light,
          ["--brand-mark-dark" as string]: color.dark,
          ...style,
        }
      : { color, ...style };

    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        aria-hidden="true"
        className={["shrink-0", themed ? "brand-mark-themed" : "", className].filter(Boolean).join(" ")}
        style={mergedStyle}
        dangerouslySetInnerHTML={{ __html: html }}
        {...props}
      />
    );
  }
  return Mark;
}

/** Ink in light mode, brand white/light gray in dark mode. */
export const MONO_BRAND = {
  light: "#18181b",
  dark: "#fafafa",
} as const;

/** Lemon "auto / basic apps" — darker green in light mode for contrast on elevated surfaces. */
export const LEMON_BRAND = {
  light: "#65a30d",
  dark: "#c8f542",
} as const;

/** Mint hyperliquid wordmark — deeper teal in light mode. */
export const MINT_BRAND = {
  light: "#0f766e",
  dark: "#97fce4",
} as const;
