import type { ReactNode } from "react";

export function SettingRow({
  title,
  desc,
  descMono,
  leading,
  className = "",
  children,
}: {
  title: string;
  desc: string;
  descMono?: boolean;
  leading?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 sm:gap-4 ${leading ? "min-h-12 py-3" : "py-3.5 sm:py-4"} ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {leading}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-medium leading-none">{title}</span>
          <span
            className={`truncate text-[13px] leading-snug text-muted ${descMono ? "font-mono" : ""}`}
          >
            {desc}
          </span>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function Divider() {
  return <div className="h-px bg-border" />;
}

export function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[var(--radius-sm)] border border-border bg-surface-2/40 px-2.5 py-2">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted">{label}</span>
      <span className="truncate text-[12px] font-medium">{value}</span>
    </div>
  );
}
