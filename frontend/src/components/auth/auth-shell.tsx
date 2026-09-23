export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="section-y">
      <div className="container-page">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold text-text-primary">{title}</h1>
          <p className="mt-2 text-sm text-text-dim">{description}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-sm text-text-dim">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
