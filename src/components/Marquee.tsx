export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden bg-abby-black py-3 border-y border-abby-stone/20">
      <div className="flex whitespace-nowrap animate-marquee">
        {doubled.map((text, i) => (
          <span key={i} className="mx-8 text-xs tracking-[0.2em] uppercase text-abby-off-white/70">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
