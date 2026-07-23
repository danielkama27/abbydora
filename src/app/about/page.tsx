import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const defaultBody = `Founded in 2024, AbbyDora was born from a simple belief: that quality fashion should be timeless, accessible, and thoughtfully made. We set out to create a curated collection of wardrobe essentials that transcend fleeting trends.

Every piece in our collection is carefully selected and crafted with attention to detail. From the sourcing of premium materials to the final stitching, we work with skilled artisans who share our commitment to excellence.

Our approach is rooted in sustainability. We prioritize eco-friendly fabrics, ethical production practices, and designs meant to last. We believe that the best wardrobe is one built on quality, not quantity.`;

const defaultStats = [
  { label: "Products", value: "500+" },
  { label: "Happy Customers", value: "10,000+" },
  { label: "Countries", value: "30+" },
];

export default async function AboutPage() {
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });

  const title = settings?.aboutTitle || "About AbbyDora";
  const subtitle = settings?.aboutSubtitle || "Our Story";
  const body = settings?.aboutBody || defaultBody;

  let stats = defaultStats;
  if (settings?.aboutStats) {
    try {
      const parsed = JSON.parse(settings.aboutStats);
      if (Array.isArray(parsed) && parsed.length > 0) stats = parsed;
    } catch {}
  }

  const paragraphs = body.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-abby-cream">
      <span className="text-xs tracking-[0.3em] uppercase text-abby-black/40 block mb-3">{subtitle}</span>
      <h1 className="font-serif text-4xl font-medium text-abby-black mb-8">{title}</h1>

      <div className="space-y-6 text-abby-black/60 leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {stats.length > 0 && (
        <div className="grid gap-8 mt-16 text-center" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
          {stats.map((s, i) => (
            <div key={i}>
              <p className="font-serif text-3xl font-medium text-abby-black">{s.value}</p>
              <p className="text-sm text-abby-black/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
