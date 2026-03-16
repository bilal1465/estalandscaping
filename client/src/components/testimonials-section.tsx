import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "ESTA Landscaping transformed our backyard into a beautiful oasis. Their attention to detail and professionalism was outstanding. We couldn't be happier with the results!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Business Owner",
    content:
      "Professional, reliable, and creative. ESTA Landscaping has been maintaining our commercial property for 3 years. Their seasonal plantings always impress our customers.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Property Manager",
    content:
      "From design consultation to installation, the entire process was seamless. They listened to our vision and brought it to life beautifully. Highly recommend!",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-contain py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest font-serif mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers
            have to say about our landscaping services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="bg-beige shadow-md h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 italic">"{t.content}"</p>

                <div>
                  <div className="font-semibold text-forest">{t.name}</div>
                  <div className="text-gray-600 text-sm">{t.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-beige px-6 py-4 rounded-xl transition-transform duration-300 hover:scale-[1.02]">
            <div className="text-3xl text-red-500 mr-4">G</div>
            <div className="text-left">
              <div className="font-semibold text-forest">4.9/5 Stars on Google</div>
              <div className="text-gray-600 text-sm">Based on 50+ reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
