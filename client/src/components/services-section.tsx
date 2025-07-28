import { Sprout, Palette, Layers, Mountain, Calendar, Compass } from "lucide-react";
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
    image: "/images/IMG_8843_1753669932336.JPG"
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
    image: "/images/IMG_9048_1753669932336.JPG"
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
    image: "/images/IMG_9100_1753669932337.JPG"
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
    image: "/images/IMG_9104_1753669932337.JPG"
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
    image: "/images/IMG_9427_1753669932337.JPG"
  },
  {
    icon: Compass,
    title: "Custom Landscaping",
    description: "Complete landscape design and installation including hardscaping, water features, and outdoor living spaces.",
    features: [
      "Design consultation",
      "Hardscape installation",
      "Water features",
      "Outdoor living spaces"
    ],
    image: "/images/IMG_8843_1753669932336.JPG"
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest font-serif mb-6">Our Services</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            From regular maintenance to complete landscape design, we offer comprehensive services to keep your outdoor space looking its best year-round.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <service.icon className="text-forest text-2xl mr-3 h-6 w-6" />
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
