export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <span className="text-xs tracking-[0.3em] uppercase text-stone-400 block mb-3">Our Story</span>
      <h1 className="font-serif text-4xl font-medium text-stone-900 mb-8">About AbbyDora</h1>

      <div className="space-y-6 text-stone-500 leading-relaxed">
        <p>Founded in 2024, AbbyDora was born from a simple belief: that quality fashion should be timeless, accessible, and thoughtfully made. We set out to create a curated collection of wardrobe essentials that transcend fleeting trends.</p>
        <p>Every piece in our collection is carefully selected and crafted with attention to detail. From the sourcing of premium materials to the final stitching, we work with skilled artisans who share our commitment to excellence.</p>
        <p>Our approach is rooted in sustainability. We prioritize eco-friendly fabrics, ethical production practices, and designs meant to last. We believe that the best wardrobe is one built on quality, not quantity.</p>
      </div>

      <div className="grid grid-cols-3 gap-8 mt-16 text-center">
        {[
          { label: "Products", value: "500+" },
          { label: "Happy Customers", value: "10,000+" },
          { label: "Countries", value: "30+" },
        ].map((s, i) => (
          <div key={i}>
            <p className="font-serif text-3xl font-medium text-stone-900">{s.value}</p>
            <p className="text-sm text-stone-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
