// Eyebrow + big heading + optional sub-copy. Used to open every major
// section so the hierarchy stays consistent.
export function SectionHeading({
  eyebrow, title, sub, align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.025em] text-zinc-900 leading-[1.05]">
        {title}
      </h2>
      {sub && <p className="mt-5 text-base sm:text-lg text-zinc-600 leading-relaxed">{sub}</p>}
    </div>
  );
}
