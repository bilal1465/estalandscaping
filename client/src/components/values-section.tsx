import { Award, Handshake, Leaf } from "lucide-react";

const values = [
  {
    number: "01",
    icon: Award,
    title: "Quality & Craftsmanship",
    description:
      "We don't cut corners. Every lawn, every bed, every edge is done right—so your property looks exceptional for years.",
    accent: "forest",
  },
  {
    number: "02",
    icon: Handshake,
    title: "Trust & Partnership",
    description:
      "From the first quote to the final walkthrough, we show up when we say we will. Your trust is what we build on.",
    accent: "brown",
  },
  {
    number: "03",
    icon: Leaf,
    title: "Built to Last",
    description:
      "We choose practices and materials that last. Landscapes that stay healthy and look great season after season.",
    accent: "forest",
  },
];

export default function ValuesSection() {
  return (
    <section id="values" className="section-contain py-20 bg-beige overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest font-serif mb-6">
            What We Stand For
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            The principles that guide every project we touch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {values.map((value) => (
            <div
              key={value.number}
              className={`relative bg-white rounded-xl p-8 shadow-md h-full flex flex-col border-l-4 ${
                value.accent === "forest"
                  ? "border-l-forest"
                  : "border-l-brown"
              }`}
            >
              <span
                className={`text-sm font-mono font-semibold mb-3 ${
                  value.accent === "forest" ? "text-forest" : "text-brown"
                }`}
              >
                {value.number}
              </span>
              <value.icon
                className={`w-10 h-10 mb-4 ${
                  value.accent === "forest" ? "text-forest" : "text-brown"
                }`}
              />
              <h3 className="text-xl font-semibold text-forest font-serif mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed flex-1">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
