import Link from "next/link";

export function ViewTabs({
  basePath,
  showArchived,
  activeCount,
  archivedCount,
}: {
  basePath: string;
  showArchived: boolean;
  activeCount: number;
  archivedCount: number;
}) {
  const tab = (selected: boolean) =>
    `rounded-[8px] px-3.5 py-1.5 text-sm font-medium ${
      selected ? "bg-surface-alt text-text-primary" : "text-text-dim hover:text-text-body"
    }`;

  return (
    <div className="mt-5 flex gap-1" role="tablist" aria-label="Filter by status">
      <Link href={basePath} role="tab" aria-selected={!showArchived} className={tab(!showArchived)}>
        Active ({activeCount})
      </Link>
      <Link
        href={`${basePath}?view=archived`}
        role="tab"
        aria-selected={showArchived}
        className={tab(showArchived)}
      >
        Archived ({archivedCount})
      </Link>
    </div>
  );
}
