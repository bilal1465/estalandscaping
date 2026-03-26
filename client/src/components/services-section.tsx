import { Sprout, Palette, Layers, Mountain, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Sprout,
    title: "Lawn Care & Maintenance",
    description: "Regular mowing, fertilization, and seasonal care to keep your lawn healthy and beautiful throughout the year.",
    features: [
      "Weekly/bi-weekly mowing",
      "Fertilization programs", 
      "Weed control",
      "Seasonal treatments"
    ],
    image: "/images/image-36.JPG"
  },
  {
    icon: Palette,
    title: "Garden Bed Design",
    description: "Custom garden designs featuring seasonal flowers, perennials, and shrubs tailored to your style and climate.",
    features: [
      "Custom design consultation",
      "Plant selection & sourcing",
      "Soil preparation", 
      "Professional installation"
    ],
    image: "/images/image-33.jpg"
  },
  {
    icon: Layers,
    title: "Sod Installation",
    description: "Transform your yard instantly with professional sod installation for immediate, lush green coverage.",
    features: [
      "Site preparation",
      "Premium sod selection",
      "Expert installation",
      "Initial care guidance"
    ],
    image: "/images/image-03.JPG"
  },
  {
    icon: Mountain,
    title: "Mulching",
    description: "Professional mulch installation to retain moisture, suppress weeds, and give your beds a polished appearance.",
    features: [
      "Premium mulch selection",
      "Proper application depth",
      "Edge definition",
      "Seasonal refreshing"
    ],
    image: "/images/image-38.jpg"
  },
  {
    icon: Calendar,
    title: "Seasonal Clean-ups",
    description: "Comprehensive spring and fall cleanup services to prepare your landscape for the changing seasons.",
    features: [
      "Leaf removal",
      "Pruning & trimming", 
      "Debris cleanup",
      "Garden bed preparation"
    ],
    image: "/images/image-37.JPG"
  },
  {
    icon: Layers,
    title: "Decking & Fencing",
    description:
      "We design and build high-end decking and fencing solutions that elevate your outdoor space with durability, precision, and a clean architectural finish.",
    features: [
      "Custom deck design & layout",
      "Composite & wood decking options",
      "Privacy and decorative fencing",
      "Professional installation & finishing",
    ],
    image: "/images/service-decking-fencing.jpg",
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-contain py-20 bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest font-serif mb-6">Our Services</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            From regular maintenance to complete landscape design, we offer comprehensive services to keep your outdoor space looking its best year-round.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-white shadow-md overflow-hidden h-full flex flex-col">
              <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <CardContent className="p-6 flex-1">
                <div className="flex items-center mb-3">
                  <service.icon className="text-forest text-2xl mr-3 h-6 w-6 flex-shrink-0" />
                  <h3 className="text-xl font-semibold text-forest">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>• {feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
