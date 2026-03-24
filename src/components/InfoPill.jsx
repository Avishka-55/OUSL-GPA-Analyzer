export default function InfoPill({ kind = "ok", children }) {
  if (kind === "ok") return <span className="ok">{children}</span>;
  if (kind === "err") return <span className="err">{children}</span>;
  return <span>{children}</span>;
}