import { Check, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const packages = [
  {
    name: "Fall Cleanup Package",
    price: "$150-$350",
    period: "",
    description:
      "Complete fall yard care to prep your lawn for winter and ensure a healthy, vibrant spring.",
    features: ["Leaf Removal", "Final Mow", "Trimming"],
    popular: false,
  },
  {
    name: "Essential Care",
    price: "$60",
    period: "/month",
    description: "Perfect for basic maintenance",
    features: [
      "Bi-weekly lawn mowing",
      "Edge trimming",
      "Basic weed control",
      "Seasonal cleanup (2x/year)",
    ],
    popular: false,
  }
];

export default function PricingSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest font-serif mb-6">
            Service Packages
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Transparent pricing for comprehensive landscaping services. All
            packages include consultation and can be customized to your specific
            needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                pkg.popular ? "border-2 border-forest" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-forest text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-forest font-serif mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-4xl font-bold text-forest mb-2">
                    Starting from {pkg.price}
                    <span className="text-lg font-normal">{pkg.period}</span>
                  </div>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="text-forest mr-3 h-4 w-4" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-6">
            Need something custom? We create tailored solutions for unique
            properties.
          </p>
          <Button
            onClick={() => scrollToSection("quote")}
            className="bg-brown text-white hover:bg-brown/90"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Get Custom Quote
          </Button>
        </div>
      </div>
    </section>
  );
}
