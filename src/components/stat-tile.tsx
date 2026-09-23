export function StatTileRow({
  stats,
}: {
  stats: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="container-page">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[14px] border border-border-faint bg-surface p-5"
          >
            <p className="font-display text-3xl font-semibold text-teal">{stat.value}</p>
            <p className="mt-1 text-sm text-text-dim">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
